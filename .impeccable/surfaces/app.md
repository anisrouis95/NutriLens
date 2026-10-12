---
version: 1
slug: "app"
primary_target: "app"
related_targets: ["components"]
---

# NutriLens app shell and all screens

Scope: every screen of the Android app (onboarding, Today, Train, Workout, Exercise, Library, Food, Snap/Add, Learn, Lesson, Coach, Plan, Progress, Profile, Settings, Fasting). Visitor mode: Operate (Learn/Lesson reading surfaces follow Read rules for prose).

Audience and job: a beginner whose main job is training: following and logging gym sessions set by set, learning each movement; meals by photo and calories left come second. Used at the gym under bright light with sweaty hands, in a dark room at night, and outdoors in daylight.

Constraints: Expo SDK 57 with Reanimated 4, forward compatible with SDK 58; EN/FR; Material navigation and controls on Android; 48dp targets; respect system font scale and Remove-animations. Dark only: black ground with white and volt ink reads under gym light, in a dark room and in daylight glare, so the light scheme is retired.

Benchmarks (user chose the category standard): Nike Training Club, Gymshark Training, Whoop. Their craft level is the bar.

User anti-references: not playful or gamified, not clinical, not busy, not harsh on the eyes. Motion wanted on action feedback, step transitions, numbers and charts, exercise demos.

## Direction contract

THESIS: Training first. The app is the session you follow set by set: the next workout is the hero, each exercise fills the screen with its moving demo, and logging a set is one big tap. Refuses the calm nutrition-dashboard arrangement where calories lead and the workout is a list row.

OWN-WORLD: Kinetic Black, the category standard played straight. Ground #0A0A0A, graphite surfaces (#141414 to #1F1F1F), hairlines #232323, off-white ink #F5F5F5. One volt accent #D9FF3D owns every action, progress and the current set; selection is inverted white pills with black text. Protein coral, carbs sky, fat lilac for data only. Anton uppercase for titles and every big number; Inter for words and small data (tracked uppercase labels at 12sp). Full-bleed exercise photos fading into black; photo cards radius 20; pill buttons with uppercase heavy labels.

STORY: The user opens the app, sees today's session and starts it in one tap. In the gym each exercise is one page: demo, set table, LOG SET; rest counts down in big numerals; story bars show the whole session; Up next carries them on. Calories and macros sit one glance below the workout.

FIRST VIEWPORT: Today. Date (tracked caps) left, progress and profile icon buttons right. A full-width 260dp photo card of the next session (exercise photo, gradient to black), session name in Anton 40, "6 exercises · 55 min", volt START WORKOUT pill. Under it the week as segmented bars with "1/3 sessions". Then the calories left in Anton 72 with KCAL LEFT in volt, a volt line, eaten/target labels, three macro columns. Volt camera FAB bottom right; bottom navigation Today, Train, Food, Learn.

FORM: Kinetic Black, the category standard (canon card E) chosen by the user from the direction round, plus two pieces from challenger C (One Rep Feed): story progress bars across the workout and the Up next card; the workout runs one exercise per page (swipe or tap Up next), C's real strength. Seed key a6112e13. Signature interaction: LOG SET stamps the row volt, its story segment fills, the rest clock takes the Up next slot in big Anton numerals; after an exercise's last set the button becomes NEXT EXERCISE and the next page slides in. Motion: exponential ease-out 160–320ms, horizontal page slides, numbers count; reduced motion swaps to instant cuts and crossfades.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
