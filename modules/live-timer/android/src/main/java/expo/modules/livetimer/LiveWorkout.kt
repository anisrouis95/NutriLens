package expo.modules.livetimer

import android.app.ActivityManager
import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.graphics.drawable.Icon
import android.os.Build
import org.json.JSONArray
import org.json.JSONObject

// The workout on the lock screen: one notification that walks through the
// sets the app hands over (next set → Start → Done → rest with Easy/Good/Hard
// → next set), driven by its buttons without unlocking the phone and without
// the app running. Every button press is queued as an event the app applies
// to the workout when it next runs (`drain`); while the app runs, it is told
// at once (`onEvent`) and takes over again with `update`.
//
// State (JSON from the app, kept in SharedPreferences):
//   dayId, phase ready | working | resting | finished, items [{key, name, set,
//   detail, restSec}] (sets still to do, next first), setStartedAt,
//   restEndsAt, ratingKey (the set waiting for "how was it?"), done, total,
//   timeSets, buzz, channel, alertChannel, color, labels {…}.
object LiveWorkout {
  private const val PREFS = "tounsi_live_workout"
  private const val NOTIFICATION_ID = 4201
  private const val ALERT_ID = 4202
  private const val PREFIX = "expo.modules.livetimer."
  const val START = PREFIX + "START"
  const val DONE = PREFIX + "DONE"
  const val EASY = PREFIX + "EASY"
  const val GOOD = PREFIX + "GOOD"
  const val HARD = PREFIX + "HARD"
  const val REST_OVER = PREFIX + "REST_OVER"

  /** Set by the module while the app runs: a button was pressed. */
  @Volatile var onEvent: (() -> Unit)? = null

  private fun prefs(ctx: Context) = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
  private fun manager(ctx: Context) = ctx.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

  private fun state(ctx: Context): JSONObject? =
    prefs(ctx).getString("state", null)?.let { runCatching { JSONObject(it) }.getOrNull() }

  private fun events(ctx: Context): JSONArray =
    prefs(ctx).getString("events", null)?.let { runCatching { JSONArray(it) }.getOrNull() } ?: JSONArray()

  /** The app's view of the workout. Ignored while presses it hasn't read yet are waiting. */
  fun update(ctx: Context, json: String): Boolean {
    if (events(ctx).length() > 0) return false
    val s = runCatching { JSONObject(json) }.getOrNull() ?: return false
    prefs(ctx).edit().putString("state", s.toString()).apply()
    schedule(ctx, s)
    render(ctx, s)
    return true
  }

  fun stop(ctx: Context) {
    prefs(ctx).edit().clear().apply()
    cancelAlarm(ctx)
    manager(ctx).cancel(NOTIFICATION_ID)
    manager(ctx).cancel(ALERT_ID)
  }

  /** Button presses since the last call, oldest first, as a JSON array. */
  fun drain(ctx: Context): String {
    val list = events(ctx)
    prefs(ctx).edit().remove("events").apply()
    return list.toString()
  }

  fun peek(ctx: Context): String? = state(ctx)?.toString()

  /** A button, or the end of a rest. */
  fun handle(ctx: Context, action: String) {
    val s = state(ctx) ?: return
    val items = s.optJSONArray("items") ?: JSONArray()
    val now = System.currentTimeMillis()
    val first = if (items.length() > 0) items.getJSONObject(0) else null
    when (action) {
      START -> {
        if (first == null) return
        s.put("phase", "working").put("setStartedAt", now).remove("restEndsAt")
        event(ctx, JSONObject().put("type", "start").put("key", first.getString("key")).put("at", now))
        manager(ctx).cancel(ALERT_ID)
      }
      DONE -> {
        if (first == null) return
        val e = JSONObject().put("type", "done").put("key", first.getString("key")).put("at", now)
        if (s.optString("phase") == "working" && s.has("setStartedAt")) e.put("startedAt", s.getLong("setStartedAt"))
        event(ctx, e)
        val rest = first.optInt("restSec", 0)
        val left = JSONArray()
        for (i in 1 until items.length()) left.put(items.get(i))
        s.put("items", left).put("ratingKey", first.getString("key")).put("done", s.optInt("done") + 1).remove("setStartedAt")
        when {
          left.length() == 0 -> s.put("phase", "finished").remove("restEndsAt")
          rest > 0 -> s.put("phase", "resting").put("restEndsAt", now + rest * 1000L)
          else -> s.put("phase", "ready").remove("restEndsAt")
        }
        manager(ctx).cancel(ALERT_ID)
      }
      EASY, GOOD, HARD -> {
        val key = s.optString("ratingKey", "")
        if (key.isEmpty()) return
        val effort = when (action) { EASY -> "easy"; HARD -> "hard"; else -> "good" }
        event(ctx, JSONObject().put("type", "effort").put("key", key).put("effort", effort).put("at", now))
        s.remove("ratingKey")
      }
      REST_OVER -> {
        if (s.optString("phase") != "resting") return
        // Woken early (inexact alarm): wait for the real end.
        if (now < s.optLong("restEndsAt") - 1500) {
          schedule(ctx, s)
          return
        }
        s.put("phase", "ready").remove("restEndsAt")
        if (s.optBoolean("buzz", true) && !inForeground()) alert(ctx, s)
      }
      else -> return
    }
    prefs(ctx).edit().putString("state", s.toString()).apply()
    schedule(ctx, s)
    render(ctx, s)
    if (action != REST_OVER) onEvent?.invoke()
  }

  private fun event(ctx: Context, e: JSONObject) {
    val list = events(ctx).put(e)
    prefs(ctx).edit().putString("events", list.toString()).apply()
  }

  // --- The notification ------------------------------------------------------

  private fun render(ctx: Context, s: JSONObject) {
    val labels = s.optJSONObject("labels") ?: JSONObject()
    fun label(k: String) = labels.optString(k, "")
    val item = s.optJSONArray("items")?.optJSONObject(0)
    val phase = s.optString("phase", "ready")
    val timeSets = s.optBoolean("timeSets", true)
    val b = Notification.Builder(ctx, s.optString("channel", "workout-live"))
      .setSmallIcon(smallIcon(ctx))
      .setColor(s.optInt("color"))
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setVisibility(Notification.VISIBILITY_PUBLIC)
      .setCategory(if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) Notification.CATEGORY_STOPWATCH else Notification.CATEGORY_PROGRESS)
      .setSubText(
        label("progress")
          .replace("{{day}}", s.optString("day"))
          .replace("{{done}}", s.optInt("done").toString())
          .replace("{{total}}", s.optInt("total").toString()),
      )
    launch(ctx)?.let { b.setContentIntent(it) }
    val name = item?.optString("name", "") ?: ""
    val set = item?.optString("set", "") ?: ""
    val detail = item?.optString("detail", "") ?: ""
    val next = if (timeSets) action(ctx, label("start"), START) else action(ctx, label("logSet"), DONE)

    when {
      phase == "working" && item != null -> {
        b.setContentTitle("$name · $set").setContentText("${label("working")} · $detail")
          .setWhen(s.optLong("setStartedAt", System.currentTimeMillis())).setShowWhen(true).setUsesChronometer(true)
        b.addAction(action(ctx, label("done"), DONE))
        promoted(b)
      }
      phase == "resting" && item != null -> {
        b.setContentTitle("${label("rest")} · ${label("next")}: $name").setContentText("$set · $detail")
          .setWhen(s.optLong("restEndsAt")).setShowWhen(true).setUsesChronometer(true)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) b.setChronometerCountDown(true)
        if (s.optString("ratingKey", "").isNotEmpty()) {
          b.addAction(action(ctx, label("easy"), EASY))
          b.addAction(action(ctx, label("good"), GOOD))
          b.addAction(action(ctx, label("hard"), HARD))
        } else {
          b.addAction(next)
        }
        promoted(b)
      }
      item == null || phase == "finished" -> {
        b.setContentTitle(label("allDone")).setContentText(label("saveHint")).setShowWhen(false)
        if (s.optString("ratingKey", "").isNotEmpty()) {
          b.addAction(action(ctx, label("easy"), EASY))
          b.addAction(action(ctx, label("good"), GOOD))
          b.addAction(action(ctx, label("hard"), HARD))
        }
      }
      else -> {
        b.setContentTitle("$name · $set").setContentText(detail).setShowWhen(false)
        b.addAction(next)
      }
    }
    manager(ctx).notify(NOTIFICATION_ID, b.build())
  }

  /** The buzz at the end of a rest, with the set to start. Gone after a minute. */
  private fun alert(ctx: Context, s: JSONObject) {
    val labels = s.optJSONObject("labels") ?: JSONObject()
    val item = s.optJSONArray("items")?.optJSONObject(0) ?: return
    val b = Notification.Builder(ctx, s.optString("alertChannel", "rest-over"))
      .setSmallIcon(smallIcon(ctx))
      .setColor(s.optInt("color"))
      .setContentTitle(labels.optString("restOver"))
      .setContentText("${item.optString("name")} · ${item.optString("set")} · ${item.optString("detail")}")
      .setAutoCancel(true)
      .setTimeoutAfter(60_000)
      .setVisibility(Notification.VISIBILITY_PUBLIC)
      .setCategory(Notification.CATEGORY_REMINDER)
    launch(ctx)?.let { b.setContentIntent(it) }
    manager(ctx).notify(ALERT_ID, b.build())
  }

  // Lock-screen buttons run in the background, without unlocking the phone.
  private fun action(ctx: Context, title: String, what: String): Notification.Action {
    val intent = Intent(ctx, LiveActionReceiver::class.java).setAction(what)
    val pending = PendingIntent.getBroadcast(ctx, what.hashCode(), intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
    val builder = Notification.Action.Builder(Icon.createWithResource(ctx, smallIcon(ctx)), title, pending)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) builder.setAuthenticationRequired(false)
    return builder.build()
  }

  private fun launch(ctx: Context): PendingIntent? {
    val intent = ctx.packageManager.getLaunchIntentForPackage(ctx.packageName) ?: return null
    intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
    return PendingIntent.getActivity(ctx, NOTIFICATION_ID, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
  }

  // Android 16 Live Updates: asks for the status-bar chip (Samsung shows it in the Now Bar).
  // Set through the extra so older SDKs and phones simply ignore it.
  private fun promoted(b: Notification.Builder) {
    b.extras.putBoolean("android.requestPromotedOngoing", true)
  }

  /** The white silhouette expo-notifications puts in the app, else the launcher icon. */
  fun smallIcon(ctx: Context): Int {
    val id = ctx.resources.getIdentifier("notification_icon", "drawable", ctx.packageName)
    return if (id != 0) id else ctx.applicationInfo.icon
  }

  private fun inForeground(): Boolean {
    val info = ActivityManager.RunningAppProcessInfo()
    ActivityManager.getMyMemoryState(info)
    return info.importance <= ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
  }

  // --- The end of a rest -----------------------------------------------------

  private fun alarmIntent(ctx: Context): PendingIntent {
    val intent = Intent(ctx, LiveActionReceiver::class.java).setAction(REST_OVER)
    return PendingIntent.getBroadcast(ctx, REST_OVER.hashCode(), intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
  }

  private fun cancelAlarm(ctx: Context) {
    (ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager).cancel(alarmIntent(ctx))
  }

  /** While resting, an alarm at the end of the rest (exact when the phone allows it). */
  private fun schedule(ctx: Context, s: JSONObject) {
    cancelAlarm(ctx)
    if (s.optString("phase") != "resting") return
    val at = s.optLong("restEndsAt")
    if (at <= 0) return
    val alarms = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val exact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || alarms.canScheduleExactAlarms()
    if (exact) alarms.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, alarmIntent(ctx))
    else alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, alarmIntent(ctx))
  }
}

/** Receives the notification's buttons and the end-of-rest alarm. */
class LiveActionReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    LiveWorkout.handle(context.applicationContext, intent.action ?: return)
  }
}
