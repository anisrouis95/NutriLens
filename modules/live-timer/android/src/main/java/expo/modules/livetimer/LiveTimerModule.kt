package expo.modules.livetimer

import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// The workout's lock-screen notification (one id, updated in place) and the
// phone settings that decide whether reminders arrive on time.
//
// The rest countdown uses Android's own chronometer, so the system draws the
// seconds while the app sleeps, and `setTimeoutAfter` removes it exactly when
// the rest ends. Only platform APIs (minSdk 26), no extra dependencies.
class LiveTimerModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  private val notifications: NotificationManager
    get() = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

  override fun definition() = ModuleDefinition {
    Name("LiveTimer")

    // Rest countdown to `endAtMs` (epoch ms); disappears by itself at the end.
    Function("showRest") { endAtMs: Double, title: String, body: String, channelId: String, color: Int ->
      val left = endAtMs.toLong() - System.currentTimeMillis()
      if (left <= 0) return@Function
      val builder = base(title, body, channelId, color)
        .setWhen(endAtMs.toLong())
        .setShowWhen(true)
        .setUsesChronometer(true)
        .setTimeoutAfter(left)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) builder.setChronometerCountDown(true)
      notifications.notify(NOTIFICATION_ID, promoted(builder).build())
    }

    // The workout in progress, without a clock.
    Function("showSession") { title: String, body: String, channelId: String, color: Int ->
      val builder = base(title, body, channelId, color).setShowWhen(false)
      notifications.notify(NOTIFICATION_ID, builder.build())
    }

    Function<Unit>("clear") {
      notifications.cancel(NOTIFICATION_ID)
    }

    // Exact alarms: allowed by default before Android 12; after, the user decides.
    Function<Boolean>("canScheduleExactAlarms") {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return@Function true
      (context.getSystemService(Context.ALARM_SERVICE) as AlarmManager).canScheduleExactAlarms()
    }

    Function<Boolean>("openExactAlarmSettings") {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return@Function false
      open(Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM, Uri.parse("package:" + context.packageName)))
    }

    Function<Boolean>("isIgnoringBatteryOptimizations") {
      val power = context.getSystemService(Context.POWER_SERVICE) as PowerManager
      power.isIgnoringBatteryOptimizations(context.packageName)
    }

    // The list of apps and their battery rules (asking directly is reserved for other app types on Play).
    Function<Boolean>("openBatterySettings") {
      open(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)) ||
        open(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + context.packageName)))
    }

    Function<Boolean>("openNotificationSettings") {
      open(Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName))
    }

    Function<Boolean>("openAppSettings") {
      open(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + context.packageName)))
    }
  }

  private fun base(title: String, body: String, channelId: String, color: Int): Notification.Builder {
    val builder = Notification.Builder(context, channelId)
      .setSmallIcon(smallIcon())
      .setColor(color)
      .setContentTitle(title)
      .setContentText(body)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setVisibility(Notification.VISIBILITY_PUBLIC)
      .setCategory(if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) Notification.CATEGORY_STOPWATCH else Notification.CATEGORY_PROGRESS)
    context.packageManager.getLaunchIntentForPackage(context.packageName)?.let { launch ->
      launch.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
      builder.setContentIntent(PendingIntent.getActivity(context, NOTIFICATION_ID, launch, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT))
    }
    return builder
  }

  // Android 16 Live Updates: asks for the status-bar chip (Samsung shows it in the Now Bar).
  // Set through the extra so older SDKs and phones simply ignore it.
  private fun promoted(builder: Notification.Builder): Notification.Builder {
    builder.extras.putBoolean("android.requestPromotedOngoing", true)
    return builder
  }

  // The white silhouette expo-notifications puts in the app, else the launcher icon.
  private fun smallIcon(): Int {
    val id = context.resources.getIdentifier("notification_icon", "drawable", context.packageName)
    return if (id != 0) id else context.applicationInfo.icon
  }

  private fun open(intent: Intent): Boolean {
    return try {
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
      true
    } catch (e: Exception) {
      false
    }
  }

  companion object {
    private const val NOTIFICATION_ID = 4201
  }
}
