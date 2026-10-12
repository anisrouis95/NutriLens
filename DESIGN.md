---
name: NutriLens
description: A training-first coach for Android in Kinetic Black, the training-app standard played straight; one volt accent on a black ground.
colors:
  ground: "#0A0A0A"
  surfaceLow: "#101010"
  surface: "#141414"
  surfaceHigh: "#1F1F1F"
  pressed: "#2A2A2A"
  track: "#262626"
  hairline: "#232323"
  border: "#3A3A3A"
  textDisabled: "#5C5C5C"
  textTertiary: "#8A8A8A"
  textSecondary: "#B3B3B3"
  text: "#F5F5F5"
  accent: "#D9FF3D"
  accentStrong: "#C6EC2A"
  accentDeep: "#9DBF1C"
  accentSoft: "#1D2309"
  accentText: "#D9FF3D"
  onAccent: "#0A0A0A"
  select: "#F5F5F5"
  onSelect: "#0A0A0A"
  protein: "#FF7A59"
  carbs: "#4FC3F7"
  fat: "#B794F6"
  success: "#D9FF3D"
  danger: "#FF5A4E"
  dangerSoft: "#2E1210"
  scrim: "rgba(0, 0, 0, 0.72)"
  shadow: "#000000"
typography:
  display:
    fontFamily: "Anton, sans-serif"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: "44px"
    letterSpacing: "0.2px"
  headline:
    fontFamily: "Anton, sans-serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: "38px"
    letterSpacing: "0.2px"
  title:
    fontFamily: "Anton, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: "27px"
    letterSpacing: "0.3px"
  titleSmall:
    fontFamily: "Inter, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: "23px"
    letterSpacing: "-0.1px"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  bodyStrong:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "22px"
    letterSpacing: "-0.1px"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "19px"
    letterSpacing: "0px"
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "18px"
    letterSpacing: "0px"
  overline:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 800
    lineHeight: "16px"
    letterSpacing: "1px"
  numHero:
    fontFamily: "Anton, sans-serif"
    fontSize: "76px"
    fontWeight: 400
    lineHeight: "80px"
    letterSpacing: "-0.5px"
  numLarge:
    fontFamily: "Anton, sans-serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: "36px"
    letterSpacing: "0px"
  numMedium:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "22px"
    letterSpacing: "0px"
    fontFeature: "tnum"
  numSmall:
    fontFamily: "Inter, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: "18px"
    letterSpacing: "0.2px"
    fontFeature: "tnum"
  button:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 800
    lineHeight: "19px"
    letterSpacing: "0.6px"
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  pill: "999px"
spacing:
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  gutter: "20px"
  xl: "24px"
  xxl: "32px"
  xxxl: "48px"
components:
  button-filled:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.onAccent}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-filled-pressed:
    backgroundColor: "{colors.accentStrong}"
    textColor: "{colors.onAccent}"
  button-filled-large:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.onAccent}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "56px"
  button-tonal:
    backgroundColor: "{colors.surfaceHigh}"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-tonal-pressed:
    backgroundColor: "{colors.pressed}"
  button-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.accentText}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "48px"
  button-disabled:
    backgroundColor: "{colors.surfaceHigh}"
    textColor: "{colors.textDisabled}"
  icon-button-filled:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.onAccent}"
    rounded: "{rounded.pill}"
    size: "48px"
  icon-button-filled-disabled:
    backgroundColor: "{colors.surfaceHigh}"
    textColor: "{colors.textTertiary}"
  icon-button-tonal:
    backgroundColor: "{colors.surfaceHigh}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    size: "48px"
  chip:
    backgroundColor: "{colors.surfaceHigh}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "36px"
  chip-selected:
    backgroundColor: "{colors.select}"
    textColor: "{colors.onSelect}"
  chip-multiline:
    rounded: "{rounded.lg}"
    padding: "10px 14px"
  segmented:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.textSecondary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "3px"
    height: "44px"
  segmented-indicator:
    backgroundColor: "{colors.select}"
    textColor: "{colors.onSelect}"
    rounded: "{rounded.pill}"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "52px"
  option-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.bodyStrong}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "64px"
  option-tile-selected:
    backgroundColor: "{colors.surfaceHigh}"
  group:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
  list-item:
    textColor: "{colors.text}"
    typography: "{typography.bodyStrong}"
    padding: "12px 16px"
    height: "64px"
  card-workout:
    backgroundColor: "{colors.surfaceHigh}"
    textColor: "{colors.text}"
    typography: "{typography.display}"
    rounded: "{rounded.lg}"
    height: "264px"
  up-next:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "64px"
  nav-bar:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.textTertiary}"
    height: "80px"
  nav-indicator:
    backgroundColor: "{colors.surfaceHigh}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    width: "64px"
    height: "32px"
  fab:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.onAccent}"
    rounded: "{rounded.pill}"
    size: "60px"
  stamp-check:
    backgroundColor: "transparent"
    textColor: "{colors.textSecondary}"
    rounded: "{rounded.pill}"
    size: "44px"
  stamp-check-done:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.onAccent}"
  sheet:
    backgroundColor: "{colors.surfaceHigh}"
    textColor: "{colors.text}"
    padding: "12px 24px 16px"
  snackbar:
    backgroundColor: "{colors.text}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: "48px"
---

# Design System: NutriLens

## Overview

**Creative North Star: "Kinetic Black"**

NutriLens is a training app first, and it looks like the best of its category: a black ground, graphite surfaces, off-white ink, and a single volt accent that means "act, progress, now". The next workout is the hero of every day; inside a session each exercise fills the screen with its demo photo fading into black, its name set in condensed Anton capitals on that fade, and logging a set is one large volt tap. Calories and macros sit one glance below the training, told in the same big Anton numerals.

The system plays the category standard straight rather than inventing a private metaphor. Density is generous where the hand is busy (64dp set rows, 56dp dock buttons, 48dp minimum targets for sweaty hands under gym light) and compact where the eye only checks (tracked 12sp labels, slim progress lines). It is dark only: black with white and volt ink holds up under gym fluorescents, in a dark room at night and in daylight glare, so there is no light scheme.

Motion serves feedback, never decoration: exponential ease-out at 160, 220 and 320ms for state changes, a quick spring only under the finger, numbers that count to their value, bars that grow once, horizontal page slides between exercises. When the system asks for reduced motion, every one of these becomes an instant cut or a crossfade.

**Key Characteristics:**
- Black ground, graphite tonal layers, no decorative color.
- One volt accent for every action, every progress fill and the current set.
- Selection is inverted ink: white pill, black text.
- Anton uppercase for titles and every big number; Inter for words and small data.
- Full-bleed exercise photography fading into the ground.
- Pills for actions, 20dp corners on photo cards, 14dp on containers.
- Story bars carry progress across a session, a week, a questionnaire.

## Colors

A near-monochrome graphite ramp carrying one electric volt, with three data inks reserved for the macros.

### Primary
- **Volt** (#D9FF3D): every primary action (filled buttons, the camera FAB, filled icon buttons), every progress fill (progress lines, story bars, the eat bar of the plan), the current set's numerals, done-set stamps, switch tracks when on, focus underlines and cursors. Pressed volt is **Volt Pressed** (#C6EC2A); **Deep Volt** (#9DBF1C) marks helper muscles on the body map one step quieter than primary muscles; **Volt Wash** (#1D2309) sits behind volt ink for the coach's own bubbles, plan boxes and tool chips. Ink on volt is always the ground black (#0A0A0A).

### Secondary
- **Inverted White** (#F5F5F5 with #0A0A0A ink): selection only. Selected chips, the segmented indicator, selected option tiles' border and check mark. White is the "chosen" signal so volt can stay the "act" signal.

### Tertiary (data inks)
- **Protein Coral** (#FF7A59), **Carbs Sky** (#4FC3F7), **Fat Lilac** (#B794F6): the three macros in bars, labels and charts. They never mark actions or state.

### Neutral
- **Ground Black** (#0A0A0A): every screen background, the nav bar, the workout dock, the end color of every photo fade.
- **Graphite Low / Graphite / Graphite High** (#101010 / #141414 / #1F1F1F): the scrolled top bar, grouped lists and fields, then raised things (sheets, tonal buttons, chips at rest, the nav indicator, the photo card before its image loads).
- **Pressed Graphite** (#2A2A2A): the pressed state of tonal surfaces and list rows.
- **Track** (#262626): the empty part of progress lines and story segments.
- **Hairline** (#232323): dividers, table rules, the top edge of the nav bar and dock.
- **Border** (#3A3A3A): outlined buttons, field strokes at rest, unchecked stamps, the current story segment's brighter track, past days in the week bars.
- **Ink ramp** (#F5F5F5 text, #B3B3B3 secondary, #8A8A8A tertiary, #5C5C5C disabled): about 18:1, 10:1, 5.6:1 and 2.9:1 against the ground. Disabled ink is for disabled controls only.
- **Danger Red** (#FF5A4E) on **Danger Wash** (#2E1210): over-target values, destructive actions, warnings.
- **Scrim** (rgba(0, 0, 0, 0.72)): behind sheets.

### Named Rules
**The One Volt Rule.** Volt means act, progress or now: buttons, fills, the current set, done stamps. It never decorates, never fills a background panel, and never marks selection or data.

**The Inverted Selection Rule.** What the user has chosen turns white with black ink. A selected chip or segment is never volt.

**The Data Ink Rule.** Coral, sky and lilac belong to protein, carbs and fat. Nothing else borrows them, and they never sit on a button.

**The Graphite Calm Rule.** Things that are merely present (the active nav destination, past days, completed-but-not-current bars, the burn strata of the plan) step through graphite, so the one volt element on screen stays findable at a glance.

## Typography

**Display Font:** Anton (with sans-serif fallback)
**Body Font:** Inter (Regular 400, Medium 500, SemiBold 600, Bold 700, ExtraBold 800)

**Character:** Anton is the condensed poster voice of the gym floor, always uppercase, used for names and numbers you read from arm's length. Inter does all the talking: sentences, captions, small figures in tabular numerals, and the heavy tracked capitals of labels and buttons.

### Hierarchy
- **Display** (Anton, 40/44sp, uppercase): the session name on the workout card and the exercise name on its photo fade (long names step down to stay within three lines).
- **Headline** (Anton, 34/38sp, uppercase): the large screen title that collapses into the top bar on scroll.
- **Title** (Anton, 22/27sp, uppercase): section titles, the collapsed bar title, sheet titles, and the KCAL LEFT unit beside the hero number.
- **Title Small** (Inter Bold, 17/23sp): card-level headings inside Inter-led content.
- **Body** (Inter Regular, 16/24sp): lessons, coach answers, explanations. Body Strong (Inter SemiBold 16/22sp) carries list titles and option titles.
- **Label** (Inter SemiBold, 14/19sp): chip and segment text, field labels, small actions.
- **Caption** (Inter Regular, 13/18sp): supporting lines in lists, empty-state bodies, footnotes.
- **Overline** (Inter ExtraBold, 12/16sp, +1 tracking, uppercase): data labels and units (SET 1, EATEN, TARGET, KG LIFTED), the date line on Today, the session line in the workout band, short status tags.
- **Numerals**: numHero (Anton 76/80sp) for calories left, the fasting clock and the ruler value; numLarge (Anton 32/36sp) for macro columns, rest clock, stats and volumes; set-table inputs in Anton 30sp; numMedium and numSmall (Inter SemiBold 16sp and 13sp, tabular) for inline figures.
- **Button** (Inter ExtraBold 14sp, 15sp on 56dp buttons, +0.6 tracking, uppercase): every button label, the FAB label, snackbar actions and rest-clock actions.

### Named Rules
**The Anton Numbers Rule.** Titles and every number meant to be read at a glance are Anton capitals. Anton never sets a sentence, a caption or a label.

**The Tracked Label Rule.** Overline labels name data, units or state next to the thing they describe. They are never a decorative kicker stacked above a heading.

**The Heavy Capitals Rule.** Buttons speak in ExtraBold tracked capitals at 14 to 15sp; nothing else in the UI shouts in Inter capitals except overline labels.

Large numerals cap system font scaling at 1.25x and text at 1.6x so a big number never breaks its row; French labels run about 20% longer and must wrap, not clip.

## Layout

A single-column phone layout on a 20dp screen gutter (`gutter`). Vertical rhythm uses the 4-based scale (2, 4, 8, 12, 16, 24, 32, 48dp): sections sit 32dp apart with 12dp under their Anton title, list rows have 16dp side padding, related controls sit 8dp apart.

Screens open with a 64dp top bar over a large Anton title; on scroll the large title fades and lifts out over 48dp while the bar tints from ground to Graphite Low and the small title slides in. Tab screens reserve 104dp at the bottom for the floating nav bar; the volt camera FAB floats 16dp above it at the right edge.

Today reads top to bottom: the date line and two icon buttons, the full-width workout photo card, the week as story bars with its session count, then calories left in numHero with a volt line and eaten/target labels, then three macro columns.

The workout is a horizontal pager, one exercise per page. A black band at the top carries the story bars (one tappable segment per exercise, 24dp touch strip) and the session line; the demo photo takes 90% of the screen width in height and bleeds edge to edge; the set table follows on the gutter; a fixed dock on the ground holds a 64dp slot (Up next, or the rest clock while resting) above a 56dp full-width volt button that reads LOG SET, then NEXT EXERCISE, then FINISH WORKOUT.

**The Gutter Rule.** Content aligns to the 20dp gutter; only photography and the workout band are allowed to run past it.

## Elevation & Depth

Flat and tonal. Depth comes from stepping through the graphite ramp (ground, Graphite, Graphite High) and from photography fading into the ground, not from shadows. Sheets rise on Graphite High over a 72% black scrim. The only element that casts a shadow is the camera FAB, because it floats over scrolling content.

### Shadow Vocabulary
- **FAB lift** (black, offset 0 6dp, radius 14dp, opacity 0.45; Android elevation 8): the floating camera button only.

### Named Rules
**The Flat Black Rule.** Surfaces are flat; a raised thing is a lighter graphite, not a shadow. A second shadowed element needs a reason as strong as floating over scroll.

**The Fade-To-Ground Rule.** Photographs end in the ground color through a gradient so Anton text can sit on them: the workout card fades from clear to 94% black, the exercise page fades its lower 40% fully into the ground.

## Shapes

Actions are pills: buttons, chips, the segmented control and its indicator, the nav indicator, rest actions. Round things are fully round: icon buttons, steppers, the FAB, the stamp check, switch thumbs. Containers take 14dp corners (groups, fields, option tiles, the Up next card, the Why disclosure); photo cards take 20dp; skeletons and the snackbar take 8dp. Sheets round only their top corners. Lines are hairlines; progress lines and story segments have fully round ends.

**The Pill-For-Action Rule.** If it is pressed to do something, it is a pill or a circle; rectangles with soft corners are containers.

## Components

### Buttons
Heavy, short and certain: pill shapes with ExtraBold tracked capitals.
- **Shape:** full pill (999dp radius), 48dp high, 56dp for the decisive action of a screen (the workout dock, save sheets).
- **Filled:** volt with black capitals, 24dp side padding; pressed steps to Volt Pressed with a 0.97 spring scale.
- **Tonal:** Graphite High with white capitals; pressed to Pressed Graphite. Used for secondary actions and a session already done today.
- **Outlined:** transparent with a 1dp Border stroke (Finish in the workout band, cancel in sheets).
- **Text:** volt capitals with 12dp padding, for low-weight actions such as adding a set.
- **Disabled / inactive:** Graphite High with disabled ink, so a dead button never reads as a dim live one; inactive buttons still take the tap to explain what is missing.
- **Icon buttons:** 48dp circles; ghost, tonal (Graphite High) or filled volt; a disabled filled icon button turns Graphite High with tertiary ink rather than fading.

### Chips
- **Style:** 36dp pills on Graphite High with a hairline stroke and Inter SemiBold 14sp label.
- **State:** selected turns Inverted White with black text and a leading check, cross-faded over 220ms. Multiline chips (long suggested questions) wrap to three lines in a 20dp-radius shape. Read-only chips are labels with no press state.

### Segmented control
A 44dp Graphite pill with a 3dp inset; a white indicator springs under the chosen segment, whose label turns black. Unchosen labels are secondary ink.

### Cards / Containers
- **Corner Style:** 14dp for groups and tiles, 20dp for photo cards.
- **Background:** Graphite (#141414) for groups; Graphite High for raised sheets.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** none on groups; hairline dividers between rows, inset past a leading icon.
- **Internal Padding:** 16dp sides, 12dp vertical, rows at least 64dp (52dp dense).

### Inputs / Fields
- **Style:** 52dp fields on Graphite with a 1dp Border stroke and 14dp corners; label above in secondary Label type; unit trailing in tertiary.
- **Focus:** the stroke cross-fades to volt; cursor and selection are volt.
- **Set-table inputs:** borderless Anton 30sp numerals over a 1dp underline that turns volt on focus, with an overline unit beside them; the current set's numerals are volt, done sets white, pending sets secondary.
- **Option tiles:** 64dp rows; selected lifts to Graphite High with a white 1.5dp border and a white radio or box holding a black check.
- **Stepper and ruler:** 44dp round graphite steppers; the ruler shows its value in numHero with a 3dp volt indicator over graphite ticks.

### Navigation
- **Nav bar:** 80dp on the ground with a hairline top edge; destinations Today, Train, Food, Learn. The active destination gets a 64 by 32dp Graphite High pill behind a white 22dp icon and an Inter Bold 12sp label; inactive items are tertiary. The pill grows in over 220ms.
- **FAB:** a 60dp volt circle with a black camera icon, entering on a settle spring; it can extend to show an uppercase label.
- **Top bar:** 64dp, back arrow in a 48dp icon button, collapsing Anton title.

### Feedback
- **Stamp check:** a 44dp circle, hairline Border ring with a secondary check at rest; when done it fills volt with a black check and lands with a short scale and tilt plus a success haptic. Done states stay visible.
- **Snackbar:** inverted (white surface, black Label text, uppercase action), 8dp corners, rising 24dp above the nav.
- **Sheet:** Graphite High, top corners rounded, a 36 by 4dp Border handle, Anton title, slides up over 320ms.
- **Skeleton:** Graphite High blocks pulsing between 55% and 100% opacity.

### Workout Card (signature)
A 264dp full-width photo card, 20dp corners: the session's first exercise photo (end position) covers it, a gradient takes it to near-black at the bottom, and on that sits the session name in Display, a secondary line of exercises and minutes, and a filled START WORKOUT pill with a play icon. When the session is already done today a volt status tag with a check appears and the button turns tonal. Today and Train lead with it.

### Exercise Page (signature)
Story bars at the top, the demo photo bleeding full width with no frame or badges, the exercise name in Display on its fade beside a tonal info icon button, the prescription line in Overline, then the set table (60dp set column, two Anton number inputs, a stamp check per row). Logging a set stamps its row volt, fills its story segment, and puts the rest clock in the dock slot in numLarge with +30s and skip pills; once over time, the clock and its label turn volt.

### Story Bars (signature)
A row of slim round-ended segments 4dp apart, 4dp high in the workout band and 6dp for the week on Today. Each fills volt from the left over 320ms as its part completes; the current segment's empty track brightens to Border. Tappable segments get a 24dp touch strip.

### Data views
- **Macro columns:** three equal columns 16dp apart, each a numLarge value with a tertiary target, an overline label, and a 3dp progress line in its data ink.
- **Progress line:** 6dp round-ended volt fill on Track, growing over 500ms; turns danger past target.
- **Week bars:** past days in Border graphite, today in volt, over-target days in danger, with a dashed target line; bars grow in with a 40ms stagger.
- **Plan bars:** burn and eat on one scale as 14dp bars; burn split into graphite strata (tertiary ink, Border, Pressed, Graphite High) with a swatch legend, eat in volt; both grow from the left once.
- **Body map:** worked muscles in volt (primary) and Deep Volt (helpers) on a Graphite High body outlined in Border.

### Imagery
Exercise photos are real start and end photographs from free-exercise-db (public domain), loaded at runtime and cached; demos alternate between the two positions. The app icon and splash rasters (assets/images/) are generated from assets/images/icon-source.mjs with embedded provenance; the icon artwork (a warm figure and bowl on #12150F) is the owner's approved asset and keeps its own colors.

## Do's and Don'ts

### Do:
- **Do** read every color from useTokens(); screens never hold raw hex.
- **Do** keep one volt element as the obvious next action on each screen (START WORKOUT, LOG SET, the camera FAB).
- **Do** set titles and glance numbers in Anton capitals and everything else in Inter.
- **Do** fade photographs into the ground (#0A0A0A) before placing text on them.
- **Do** keep touch targets at 48dp or more, and 56dp for the action used mid-set.
- **Do** use exponential ease-out at 160, 220 or 320ms for state changes and swap to instant cuts or crossfades when animations are removed.
- **Do** show selection as a white pill with black ink.

### Don't:
- **Don't** use volt for selection, decoration, backgrounds or data series.
- **Don't** use coral, sky or lilac for anything but protein, carbs and fat.
- **Don't** add a light scheme; Kinetic Black is dark only.
- **Don't** add shadows to cards, sheets or buttons; only the floating FAB casts one.
- **Don't** set sentences, captions or labels in Anton, or buttons in mixed case.
- **Don't** stack an overline label above a heading as a decorative kicker.
- **Don't** recolor the owner's app icon to match the palette.
