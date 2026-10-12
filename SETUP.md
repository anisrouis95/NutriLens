# NutriLens: setup guide

Everything below is **free**: no card or payment method is needed anywhere. Use your own Google account (the one this project belongs to) for every service.

## 0. Run it on your PC

```bash
npm install
npm run web          # opens the app in the browser (good for trying screens)
npm run typecheck    # TypeScript check
```

## 1. Try it on your phone right away (Expo Go)

1. Install **Expo Go** from the Play Store.
2. Run `npm run start:go` on the PC, with the phone on the same Wi-Fi.
3. Scan the QR code with Expo Go.

In Expo Go you get the questionnaire, plan, food diary, search, barcode scanner, AI photo scan, exercises, workouts, lessons and coach.
Health Connect (watch data) and Google sign-in need step 3, because Expo Go can't load those native modules.

**About the Expo Go "SDK 58" notice.** The project is on **SDK 57**, the current stable release. SDK 58 is still in beta. The Play Store's Expo Go keeps running SDK 57 projects until SDK 58's stable release; after that, the store app switches to SDK 58 only.

When that happens, you have two options:

- Upgrade the project with `npx expo install expo@^58.0.0 --fix`. The code already avoids the APIs that SDK 58 changes.
- Use your own installed build from step 3. It doesn't depend on Expo Go's SDK at all, so it keeps working whatever Expo Go supports.

## 2. Turn on AI food scanning and the coach (Gemini, free)

1. Go to <https://aistudio.google.com/apikey> and sign in with your Google account.
2. Click **Create API key** and copy it.
3. In the app, open **Profile → AI food scanning & coach**, paste the key, then tap **Save & test**.

Things to know:

- The key is stored encrypted on the phone (Android Keystore). It is never in the code or the APK.
- The free tier has per-minute and per-day limits. They're plenty for your own meals. If you hit one, the app tells you; wait a minute and retry.
- Google may use free-tier requests (your meal photos and questions) to improve its products. Don't send anything private.
- The app uses `gemini-3.8-flash` and falls back to `gemini-3.5-flash` / `gemini-2.5-flash` automatically (`services/gemini.ts`).

## 3. Install the real app on your phone (needed for watch data and Google sign-in)

Pick **one** of these:

### Option A: EAS cloud build (easiest, free plan)

The project is already linked to the Expo account `@anisrouis` (project `nutrilens`). In PowerShell, use `npx.cmd` instead of `npx`: Windows blocks the `npx.ps1` script by default.

```bash
npx.cmd eas-cli@latest login
npx.cmd eas-cli@latest build --platform android --profile preview
```

- **`preview`** is a standalone APK for daily use. It runs without the PC; install a new one to get new changes.
- **`development`** is a dev client. It loads the app from `npm start` on the PC like Expo Go does, but with the native features (Health Connect, Google sign-in). It's handy while changing native-dependent code.

When the build finishes, open the link on your phone and install the APK. You may need to allow "Install unknown apps".

The free plan includes a limited number of builds per month in a slower queue. Expo keeps the app's signing key; every update must be signed with it, so always build through the same account.

### Option B: build locally (no account, unlimited, heavier on the laptop)

1. Install **Android Studio**, which includes the Android SDK and a JDK.
2. Connect your phone with USB debugging enabled.
3. Run:

```bash
npx expo run:android
```

## 4. Connect your watch (Health Connect)

Google Fit's API is being shut down. On Android, phone and watch data now goes through **Health Connect**.

1. On Android 14+ Health Connect is built in. On older Android, install **Health Connect** from the Play Store.
2. In your watch's app, find **Health Connect** in its settings and allow steps, calories, sleep and heart rate. Menu names change between versions.
   - **Garmin Connect**: Settings → Connected apps → Health Connect
   - **Mi Fitness** (Xiaomi/Redmi): Profile → third-party data / add accounts → Health Connect
   - **Zepp** (Amazfit): Profile → Add accounts → Health Connect
3. In NutriLens: **Profile → Phone & watch activity → Connect Health Connect**, then allow the permissions.

NutriLens only **reads** data:

- steps
- active and total calories
- workouts
- resting heart rate
- sleep
- weight (e.g. from a smart scale)
- distance

After 7+ days of step data, your plan uses your *real* average steps instead of your questionnaire answer.

## 5. Google sign-in and cloud backup (Firebase Spark, free)

The app is already configured for the Firebase project `nutrilens-5b5ba` (`utils/firebaseConfig.ts`).
First open <https://console.firebase.google.com> with your Google account and check that this project is yours. If it isn't, create a new one (Spark plan) and paste its web config into `utils/firebaseConfig.ts`.

1. **Authentication → Sign-in method → Google → Enable.**
2. In the same Google panel, open **Web SDK configuration**, copy the **Web client ID**, and put it in `.env` as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...`. Cloud builds read it too: `.easignore` uploads `.env` with the project, while `.gitignore` still keeps it out of git.
3. **Project settings → Your apps → Add app → Android.**
   - Package name: `com.anisrouis.nutrilens`
   - SHA-1 certificate fingerprint:
     - EAS build: run `eas credentials` → Android → development, and copy the SHA-1.
     - Local build: run `cd android && ./gradlew signingReport` and copy the `debug` SHA-1.
4. **Firestore Database → Create database** in production mode. Then **Rules**: paste the contents of `firestore.rules` and click **Publish**.
5. Rebuild the app (step 3). Then go to **Profile → Google account & backup → Sign in with Google**.

Once signed in, the app backs up automatically once a day:

- profile
- food diary
- weights
- plan
- workouts

Use **Restore** on a new phone. The Gemini key is never uploaded.

## Where things live

| What | File |
|---|---|
| Calorie and macro maths (BMR, TDEE, deficit caps, adaptive TDEE, projection) | `lib/nutritionMath.ts` |
| Workout plan generator (splits, slots, sets/reps, progression) | `lib/workoutGenerator.ts` |
| Curated exercises: per-equipment choices, cues, mistakes, injury flags | `data/exerciseCuration.ts` |
| 876 exercises with images (free-exercise-db, public domain) | `data/exercises.json` |
| Offline food database (306 foods, 102 Tunisian) | `data/foods.ts` |
| Lessons and glossary, EN/FR, with `{{placeholders}}` filled from your plan | `content/lessons.ts` |
| AI (Gemini) client / food recognition prompt | `services/gemini.ts`, `services/foodRecognitionService.ts` |
| Barcodes and packaged products (Open Food Facts) | `services/openFoodFacts.ts` |
| Health Connect, Google sign-in, Firestore backup | `services/healthConnect.ts`, `services/auth.ts`, `services/cloudSync.ts` |
| All local data (profile, diary, weights, workouts) | `contexts/AppDataContext.tsx` |
