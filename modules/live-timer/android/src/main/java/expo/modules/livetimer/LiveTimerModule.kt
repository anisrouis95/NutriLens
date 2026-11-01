package expo.modules.livetimer

import android.app.AlarmManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// The bridge to the app: the lock-screen workout (LiveWorkout.kt) and the
// phone settings that decide whether reminders arrive on time.
class LiveTimerModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("LiveTimer")

    Events("onLiveEvent")

    // A lock-screen button was pressed while the app runs: it reads the presses with `drain`.
    OnCreate {
      LiveWorkout.onEvent = { sendEvent("onLiveEvent", mapOf("at" to System.currentTimeMillis().toDouble())) }
    }
    OnDestroy {
      LiveWorkout.onEvent = null
    }

    Function("update") { json: String -> LiveWorkout.update(context, json) }

    Function<Unit>("stop") {
      LiveWorkout.stop(context)
    }

    Function<String>("drain") {
      LiveWorkout.drain(context)
    }

    Function<String?>("peek") {
      LiveWorkout.peek(context)
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

  private fun open(intent: Intent): Boolean {
    return try {
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
      true
    } catch (e: Exception) {
      false
    }
  }
}
