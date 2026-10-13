# Product

<!-- impeccable:product-schema 1 -->

## Platform

android

## Users

Primary user: the owner (Anis), a newcomer to calorie tracking and strength training who lives in Tunisia and reads English, French and Tunisian Darija. He uses the app several times a day: photographing meals, following and logging gym sessions, checking calories left, weight trend and watch steps, and reading lessons or asking the coach to understand *why*. Personal first; it may later be shared with friends and family or published, so it must stand on its own for a first-time user who knows nothing about fitness. The intended wider audience is the Tunisian market: gym-goers who speak Darija day to day.

## Product Purpose

Tell a beginner exactly what to eat and how to train to reach a real goal, and explain every number with their own data. Success: the user follows the plan without needing a coach, understands deficit/TDEE/protein/progressive overload in plain words, and sees progress in a trend they trust.

## Positioning

A plan-and-explain coach rather than a logger: every target (calories, macros, steps, sets, reps, rest) comes from the user's answers and later from their measured results (adaptive TDEE from logged intake and weight trend), and every number has a "why" in plain language, in English, French or Tunisian Darija (Arabic or Latin letters). Ramadan mode turns the app into a fasting-month coach: iftar and suhoor times for the user's governorate, a live countdown, the month's imsakiya, Ramadan meal slots and lighter sessions. Food recognition and the offline food base understand Tunisian home cooking (lablabi, ojja, couscous, brik, olive oil as a hidden calorie source). Exercises show the movement (start/end photos) and the muscles worked on a body map.

## Operating Context

- At the gym between sets: bright overhead light, sweaty hands, one-handed quick glances; the active-workout logger and rest timer must work at a glance with large targets.
- Evening, often in a dark room: reviewing the day's numbers, reading lessons, chatting with the coach; must be easy on the eyes.
- Outdoors / walking: daylight glare; steps and the plan checked on the go.
- Meals: snap → review AI estimate (grams, confidence, notes) → add to diary, several times a day; must be fast.
- Watch data arrives through Android Health Connect (Garmin / Xiaomi / Amazfit apps write into it).

## Capabilities and Constraints

- Expo SDK 57 (React Native 0.86, expo-router, Reanimated 4); Android is the target device; web preview is used only for development. SDK 58 is in beta; Expo Go will move to SDK 58 after its stable release, so code must avoid APIs SDK 58 changes (no `expo-router/react-navigation` deep imports, no `react-native/Libraries/*` deep imports).
- Only free services with no payment method: Gemini API free tier (key pasted in-app, stored in SecureStore), Firebase Spark (Google sign-in + Firestore backup), Open Food Facts, Health Connect.
- Four languages throughout: English, French, Tunisian Darija in Arabic letters (right to left, the app restarts to flip direction) and Tunisian Darija in Latin letters (Arabizi). Darija style and glossary: `locales/DARIJA.md`; `node scripts/check-darija.mjs` lists texts missing Darija. Numbers use French conventions in Darija (Latin digits, decimal comma).
- Ramadan dates from the Umm al-Qura calendar (user can shift a day for Tunisia's moon sighting); Fajr (18°) and Maghrib computed on the phone for the 24 governorates.
- Local-first data (AsyncStorage) with optional cloud backup.
- Medical safety: calorie floors, capped deficits, "not a doctor" guidance; never shame or moralize about food.
- Terminology: calories (kcal), protein/carbs/fat, TDEE/BMR/NEAT explained in plain words; sets × reps, RIR, rest.

## Brand Commitments

- Name: Tounsi Fit (renamed from NutriLens on 2026-10-13; the Android package stays com.anisrouis.nutrilens so updates keep the data).
- Voice: friendly, direct coach ("tu" in French, everyday Tunisian Darija rather than Modern Standard Arabic), honest about uncertainty, evidence-based, no hype, no shaming, no gamified pressure.
- App icon: an original anime-style bodybuilder in a double-biceps pose with a lime headband and wristband on black (assets/images/icon-art.jpg, made with Google Gemini), chosen by the owner on 2026-10-13. It must not resemble any existing anime character.
- Look (owner's standing choice, 2026-10-12): the category standard for training apps, played straight, with Nike Training Club, Gymshark Training and Whoop as the craft bar. Training is the app's main job; nutrition supports it.

## Evidence on Hand

- 876 exercises with start/end photos and muscle data (free-exercise-db, public domain) in `data/exercises.json`; 182 curated with cues/mistakes in `data/exerciseExtrasA.ts` and `data/exerciseExtrasB.ts`.
- 306 offline foods (102 Tunisian) in `data/foodsA.ts` and `data/foodsB.ts`.
- 18 lessons + 40-term glossary in `content/lessonParts/` (assembled in `content/lessons.ts`), in all four languages.
- No testimonials, user counts, reviews or press exist; never fabricate them.

## Product Principles

1. Explain before you instruct: every number links to a plain-language why built from the user's own data.
2. Fast at the moment of use: logging a meal or a set takes seconds, one-handed.
3. Honest over impressive: show estimates as estimates, trends over single days, no fake precision or claims.
4. One clear next step: the app always says what to do next (eat, train, walk, read).
5. Beginner-safe: protective defaults (floors, injury filters) without lecturing.

## Accessibility & Inclusion

- Must stay legible in bright gym light and comfortable in a dark room (user asked for "eye friendly").
- Large touch targets (≥48dp) for use with sweaty hands mid-workout; respect system font scaling and the system "remove animations" setting.
- French text runs ~20% longer than English; layouts must not clip any language.
- Darija in Arabic letters runs right to left: directional icons mirror, bars fill from the right, Arabic text uses Changa ExtraBold (titles) and IBM Plex Sans Arabic (text).
