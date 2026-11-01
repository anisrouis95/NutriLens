# Tounsi Fit 1.2.0: training plan

The goal of 1.2.0 is that a beginner (first user: Anis, about 100 kg, losing
weight, knee pain, Mon/Wed/Fri plus sometimes Sunday) never has to guess at
the gym again:

- the app says what weight and reps to do on every set, and learns from how
  each set felt;
- typing the first set fills the rest;
- training days can change from inside the app, even for one week;
- the phone reminds and times rests properly, including on the lock screen;
- bodyweight moves (push-ups, pull-ups, dips, core) progress through ladders
  of harder variations, mixed into the normal plan.

Order of work, most useful first: 1 → 5. Status: all five sections are in
1.2.0; what is still open is listed in section 8.

---

## 1. Fixes

### 1.1 "Swapped exercise has no sets and Add set does nothing"

Cause: during a workout, the **ⓘ How to do it** page can still swap an
exercise in the program. The workout screen underneath keeps its session,
which has no sets for the new exercise, so its page is empty. **Add set**
copies the last set of that exercise; with none, it inserted an empty set
attached to no exercise (invisible, but counted in "x/y sets").

Fix:

- The workout screen reconciles its session with the program whenever the
  program changes: exercises it lacks get their sets; sets not yet done for
  exercises that left the session are dropped; done sets are always kept.
- **Add set** on an exercise without sets creates one from its target.
- On load, sets attached to no exercise (left by the old bug) are removed.

## 2. Filling sets

- Typing a weight or reps in a set copies it to every set **below** it that
  is not ticked and that you have not typed in yourself. Typing in set 1 fills
  the whole exercise; you can still change any set by hand.
- Sets you typed in are remembered (`LoggedSet.manual`), so a later change
  above never overwrites them.
- New sets start filled with the coach's target (section 3), not with zeros.

## 3. Weight coach

### 3.1 What the app needs to know

Weight and reps are not enough: 25 kg × 10 that was easy and 25 kg × 10 that
was a fight need different next steps. After ticking a set, the rest bar asks
**How was it? Easy · Good · Hard** (one tap, can be skipped).

| Answer | Meaning | Reps left in the tank (RIR) |
|---|---|---|
| Easy | could have done 4+ more | 4 |
| Good | 1–3 more | 2 |
| Hard | 0–1 more, or failed | 0.5 |
| (skipped) | assumed Good | 2 |

The target for every working set is **Good**: stop with about 2 clean reps
left. Only the last reps should be a fight; never grind every set to failure
(knees, a calorie deficit, and a beginner's technique all argue against it).

### 3.2 Before the session: today's target

For each exercise, from its history (`lib/coach.ts`, pure functions):

1. **First time:** set 1 is a test. Pick a weight you could do about 15
   times, do the low end of the range, rate it. The app then computes the
   weight for the next sets and fills them.
2. **Strength estimate:** each done set gives an estimated max
   `e1RM = kg × (1 + (reps + RIR) / 30)` (Epley, adjusted for effort).
3. **Next target (double progression, effort-aware):**
   - every set reached the top of the range and none felt Hard
     → **add one weight step**, back to the bottom of the range;
     if they all felt Easy, the step can be two (capped at +10 %);
   - otherwise, same weight, **one more rep** than last time on each set;
   - below the bottom of the range, or Hard, two sessions in a row at the
     same weight → **drop about 10 %** and build back;
   - no improvement for three sessions → **reset 10 %** (a deload);
   - back after a break: 15–30 days off → −10 %; more than 30 → −20 %.
4. **Weight steps** come from the exercise: what you typed before (25 then
   30 means 5 kg steps), else a default by equipment: machine and cable 5 kg,
   barbell 2.5 kg, dumbbell 2 kg, kettlebell 4 kg, bands and bodyweight none.
   A different step can be set per exercise.
5. **Bodyweight exercises** have no weight to add: they progress by reps,
   then by moving up their ladder (section 5).

Body weight does not set machine weights: the same "25" means different
loads on different brands. It is used only for bodyweight moves (a push-up
is about ⅔ of your weight) and for choosing ladder starting steps.

### 3.3 During the session

- After a set rated **Easy** with the target reps done, the sets below that
  you have not typed in go up one step; after **Hard** below the bottom of
  the range, they go down one step. A line under the sets says why
  ("Set 2 felt easy: next sets 30 kg").
- The page shows **Today: 25 kg × 10 · 10 · 10** and the reason
  ("Last time 25 × 10, 10, 9: one more rep").

### 3.4 While losing weight

Strength climbs more slowly in a calorie deficit. Holding the same weights
while the scale drops is a win, and the coach says so instead of showing a
"stalled" message as a failure.

## 4. Training days and notifications

### 4.1 Training days

- **Usual days** (default from the number of sessions: 2 → Mon/Thu,
  3 → Mon/Wed/Fri, 4 → Mon/Tue/Thu/Fri, 5 → Mon–Fri, 6 → Mon–Sat), plus
  **optional days** (Anis: Sunday) that never nag.
- **This week only:** tap a day on the Train tab's week strip to make it a
  training or a rest day for that date. The program keeps its order
  (A, B, C, A…) whatever the day, so a skipped day never breaks it: the next
  session is simply the next one.
- Changing the number of usual days offers to rebuild the program for the
  new count; keeping the current one is fine.
- **Tired today?** A lighter session: one set fewer per exercise, same
  weights (the same rule Ramadan mode uses).

### 4.2 Notifications

Local notifications only (no server, free, work offline). Android channels,
each switchable in the phone's settings too:

| Channel | What | Default |
|---|---|---|
| Rest timer | Countdown on the lock screen while resting ("Rest 1:30 · Next: Leg press set 3 · 25 kg × 10"), then a buzz "Rest over". | on |
| Workout in progress | Silent, ongoing: day, sets done, next set. Gone when the workout is saved. | on |
| Training days | On usual days and this-week training days, at a set time (default 17:00): "Today: Full Body B · ~45 min". Not sent when that day's workout is done or the day was made a rest day. | on, 17:00 |
| Weigh-in | Weekly, Monday 08:00: "Weigh yourself before breakfast, after the toilet." | on |
| Meals | Breakfast, lunch and dinner reminders, skipped for a meal already logged that day. | off |
| Ramadan | Suhoor (30 min before Fajr) and iftar (Maghrib), for the chosen governorate, only in Ramadan mode. | on in Ramadan mode |

How they are scheduled: every time the app opens or data changes (workout
saved, meal logged, settings changed), the next 21 days of reminders are
rebuilt with their exact content. Rest alerts are scheduled per set.

Lock screen and notification shade, on every Android phone:

- a white silhouette notification icon (Android requires one; the colour
  icon would show as a white square) and the volt accent colour;
- channels marked public on the lock screen (they hold no sensitive data);
- the rest countdown is drawn by Android itself (chronometer), so it stays
  exact while the phone sleeps, and it disappears exactly when the rest ends;
  a small native Android module (`modules/live-timer`) posts it;
- Android 13+ asks for the notification permission the first time a reminder
  or the rest timer is switched on, never at launch;
- exact rest alerts use "Alarms & reminders" when the phone allows it; the
  settings page shows whether it is allowed and opens the right page;
- battery savers that delay or block notifications are explained per maker,
  detected from the phone: Samsung (Battery → Background usage limits →
  Never sleeping apps), Xiaomi / Redmi / POCO (Autostart, No restrictions),
  Huawei / Honor, Oppo / OnePlus / Realme / Vivo, and a generic Android
  path for the rest;
- a **Send a test notification** button.

Watches: Garmin and Amazfit show these notifications when Tounsi Fit is
allowed in the watch app's notification settings.

### 4.3 Logging from the lock screen (1.2.1)

The workout notification walks through the sets with its own buttons, without
unlocking the phone and even after Android has closed the app
(`modules/live-timer/…/LiveWorkout.kt`):

| On the lock screen | Buttons |
|---|---|
| Next set: "Leg Press · Set 2/3 · 30 kg × 10" | **Start set** (or **Log set** with timing off) |
| Set under way, clock counting up | **Done** |
| Rest countdown, next set named | **Easy · Good · Hard** for the set just done, then **Start set** to cut the rest short |
| All sets done | open the app to save |

- Done logs the set at its target weight and reps: a lock screen can't type.
  A different number is fixed in the app afterwards.
- Every press is queued; the app applies the queue when it next runs (at once
  while it runs), with the same rules as a tap in the app: the rest clock,
  Easy/Hard moving the next sets. Opening the app after Android closed it
  during a workout goes straight back to that workout.
- The rest end is an alarm the phone keeps: it buzzes and turns the
  notification into the next set (exact when "Alarms & reminders" is allowed).
- The channel is silent but not "low", so Android keeps it expanded with its
  buttons on the lock screen; on Android 16 it asks to be a Live Update.

In the app, the dock follows the same steps: **Start set** → a clock counting
up → **Done**. Each set keeps its start and end (`LoggedSet.startedAt`,
`doneAt`), which gives:

- the set's length under its number;
- **tempo**: under 1.5 s per rep the exercise page says the weight is being
  bounced and asks for a 2–3 second lowering;
- **real rests**: the finish sheet shows lifting time and the average rest
  taken against the planned one.

Profile → Notifications → **Start and Done buttons** turns timing off (one
Log set tap per set, here and on the lock screen).

## 5. Calisthenics

Training style (Profile → Training style):

- **Weights** (today's behaviour);
- **Mixed (recommended)**: push, pull, rows, dips and core become ladders;
  legs stay on machines or weights;
- **Calisthenics**: everything on ladders, legs on a knee-safe ladder.

### 5.1 Ladders

Each slot maps to a ladder of steps, easiest first. A step has a target
(reps, or seconds for holds). Steps marked hard on a painful joint are
skipped.

| Ladder | Steps |
|---|---|
| Push | wall push-up → incline push-up (table) → push-up → feet-raised push-up → close-hands push-up → archer push-up |
| Row | table row, knees bent → inverted row → feet-raised row → archer row |
| Pull-up | dead hang → scapular pull-up → negative pull-up → band-assisted pull-up → pull-up → chin-up/wide pull-up |
| Dip | bar support hold → negative dip → parallel bar dip → ring dip |
| Core | dead bug → plank → hollow hold → hanging knee raise → hanging leg raise |
| Legs (knee-safe) | glute bridge → single-leg bridge → squat to a bench → split squat |

Move up when every set reached the top of the range and none felt Hard; the
finish screen says "Level up: next time, push-ups". Easier and harder steps
are also offered in the swap list.

### 5.2 Starting steps

A short test when the style is chosen: "How many push-ups on the floor?
0 / 1–5 / 6–12 / 13+", "Can you hang from a bar for 30 s?", "Pull-ups?",
"Dips?", "Plank for 30 s?". Above 90 kg or a BMI of 30, pull-up and dip
ladders start one step lower, and jumping moves stay out.

### 5.3 Progress

**Train → Calisthenics (My ladders)** shows each ladder as a row of steps with
the current one in volt, the next step, and arrows to move a step by hand.
The how-to there includes the monthly test (max push-ups, max pull-ups or
negative time, longest hollow hold).

Steps the exercise database lacks (wall push-up, dead hang, negative
pull-up, bar support hold, negative dip, hollow hold) are in
`data/customExercises.ts`, with cues in every language but no photos yet.

---

## 6. Data model changes

All optional fields; old data and backups keep working.

- `LoggedSet.manual?: boolean`, `LoggedSet.effort?: 'easy' | 'good' | 'hard'`
- `PlannedExercise.ladder?: string` (ladder id)
- `AppSettings.training?: { weekdays: number[]; optional: number[]; overrides: Record<date, 'train' | 'rest'>; reminderTime: string }`
- `AppSettings.notifications?: { rest, ongoing, training, weighIn, meals, ramadan }` with times
- `AppSettings.kgSteps?: Record<exerciseId, number>`
- `AppSettings.calisthenics?: { style: 'weights' | 'mixed' | 'calisthenics'; steps: Record<ladderId, number> }`

## 7. Test on the phone (morning checklist)

1. Make a backup (Profile → Google account & backup), then install 1.2.0 over 1.1.3.
2. Train tab: answer **Turn on** on the notifications card (Android asks once).
3. Profile → Notifications → **Send a test notification**; lock the phone within
   10 seconds; it must show on the lock screen. If "Exact alarms" says Off, tap it
   and allow Tounsi Fit.
4. Samsung: Settings → Battery → Background usage limits → Never sleeping apps →
   add Tounsi Fit (the Notifications screen shows the same steps).
5. Start a workout, log a set, lock the phone: the rest countdown shows on the
   lock screen and buzzes at the end.
6. Type 25 kg and 10 reps in set 1: sets 2 and 3 fill. Type in set 3, then change
   set 1: set 3 keeps what you typed.
7. Rate a set **Easy**: the sets below go up one step, and a line says why.
8. Train tab → week strip → tap Sunday → **Train this day**. Profile → Training
   days → Sunday shows as "Sometimes" after two taps.
9. Swap an exercise from the ⓘ page during a workout: its sets are there.
10. Train → Calisthenics → Mixed → answer the test: push, pull, row, dip and core
    slots become ladders; legs stay on machines.
11. (1.2.1) Start a workout, lock the phone: the notification shows the next set
    with **Start set**. Start, Done, rate it, all locked; open the app: the sets
    are logged with their times. If the buttons don't show, swipe the
    notification down to expand it.

## 8. Later (1.3+)

- Photos or drawings for the six custom calisthenics steps.
- A Skills card on Progress (the ladders are under Train → Calisthenics for now).
- Before publishing on Play: the exact-alarm permission needs the "timer" core
  use declared in the Play Console.
- Push notifications from a server (needs Firebase Cloud Messaging; free) for
  gym announcements in the platform plan.
- Android 16 Live Updates (status-bar chip) for the rest timer.
- iPhone: the same notifications through expo-notifications; the lock-screen
  countdown would need a Live Activity.
