# Tunisian Darija in Tounsi Fit

Every text object in the app carries `en` and `fr`, plus two Darija keys:

| key      | what                                   | direction |
|----------|----------------------------------------|-----------|
| `tn`     | Tunisian Darija in Arabic letters       | right to left |
| `tnLatn` | Tunisian Darija in Latin letters (the way Tunisians text: "3aslema", "9addech", "barcha") | left to right |

A missing Darija key falls back to French (`lib/i18n.ts → pick`). Translate from the English, using the French for nuance.

## Who we write for

Tunisian gym-goers, mostly beginners, 18–40, who speak Darija every day and read French. The voice is a friendly coach at the gym: direct, warm, encouraging, never preachy, never formal. Address the reader as one person with the informal "you". Tunisian uses one form for both genders (تاكل، تتمرّن، تنجّم / takel, tetmarren, tnajjem): use it everywhere.

## Rules

1. **Darija, not Modern Standard Arabic.** Write the way a Tunisian says it.

   | avoid (MSA)        | write (`tn`)       | write (`tnLatn`) |
   |--------------------|--------------------|------------------|
   | لديك               | عندك               | 3andek |
   | يجب عليك           | لازمك / يلزمك      | lazmek / yelzmek |
   | الخاص بك           | متاعك              | mte3ek |
   | سوف تـ…            | باش تـ…            | bech t… |
   | لا تفعل            | ما تعملش           | ma ta3melch |
   | ماذا / ما هو       | شنوّة              | chnowa |
   | كيف                | كيفاش              | kifech |
   | لماذا              | علاش               | 3lech |
   | كم                 | قدّاش              | 9addech |
   | متى                | وقتاش              | wa9tech |
   | أين                | وين                | win |
   | الآن               | توّا               | taw |
   | كثيرا              | برشا               | barcha |
   | قليلا              | شويّة              | chwaya |
   | جيد                | باهي               | behi |
   | نعم / لا           | إي / لا            | ey / le |
   | أيضا               | زادة               | zeda |
   | لكن                | أما                | ama |
   | لأن                | خاطر               | 5ater |
   | إذا                | كان                | ken |
   | مع / بدون          | مع / بلاش          | m3a / blech |

   Some written words are fine because Tunisians use them as-is: صحّة، تمرين، برنامج، هدف، نتيجة، وزن، مستوى.

2. **French loanwords are normal Tunisian.**
   - `tn`: write everyday loans in Arabic letters as people say them (سبور، ريجيم، كارديو، بروتين، كالوري، سيري، فيتامين، سالة، كوتش). Keep brand and tech names in Latin letters: Google, Gemini, OpenRouter, Health Connect, Garmin, Xiaomi, Amazfit, Expo Go, APK, Android, Open Food Facts.
   - `tnLatn`: write Darija words in Arabizi and gym and nutrition words in plain French spelling: séance, série, répétitions (or reps), repos, échauffement, calories, protéines, glucides, lipides, fibres, poids, régime, cardio, squat, haltère, barre, objectif, programme. That mix is how Tunisians actually text.

3. **Arabizi spelling (`tnLatn`).**
   - Letters: 3 = ع, 7 = ح, 9 = ق, 5 = خ, 8 = غ, ch = ش, th = ث, dh = ذ/ظ/ض, w/ou = و, y/i = ي.
   - Write "ch", never "sh". Drop the hamza (no "2").
   - Capitalise the first letter of a sentence, title or button.
   - Examples: "9addech men calorie lazmek lyoum?", "Ya3tik e sa77a!", "Bech nfasserlek kol 7aja."

4. **Keep these exactly as they are.**
   - `{{placeholders}}`: same names, unchanged.
   - Markdown: `**bold**`, `- ` bullets, line breaks. Keep the same number of paragraphs and bullets, in the same order.
   - Every number. Units in Latin letters even inside `tn`: kg, g, kcal, km, km/h, min, s, h, %, L, ml, cm, bpm.
   - Brand names.
   - Exercise names in text: use the French name, the one Tunisian gyms use.

5. **Length.** Stay about as long as the English. Buttons, tabs, chips and labels are 1–3 words. Never add explanations that aren't in the source.

6. **Punctuation in `tn`.** Use the Arabic comma "،" and question mark "؟". Keep the source's "·", "—", "→" and "…". Don't use « » in `tn`.

7. **Digits.** Western digits (0–9) only, as Tunisians write them. Never ٠١٢٣.

8. **Food.** Use the Tunisian name.

   | food | `tn` | `tnLatn` |
   |------|------|----------|
   | lablabi | لبلابي | lablebi |
   | brik | بريك | brik |
   | ojja | عجّة | 3ejja |
   | kafteji | كفتاجي | kafteji |
   | chorba | شربة | chorba |
   | couscous | كسكسي | kosksi |
   | mloukhia | ملوخية | mloukhia |
   | makroudh | مقروض | makroudh |
   | bsissa | بسيسة | bsissa |
   | lben | لبن | lben |
   | rayeb | رايب | rayeb |
   | chakchouka | شكشوكة | chakchouka |
   | mermez | مرمز | mermez |
   | jelbana | جلبانة | jelbana |
   | tabouna bread | خبز طابونة | khobz tabouna |
   | baguette | خبزة | khobza |
   | mlawi | ملاوي | mlewi |
   | fricassé | فريكاسي | fricassé |
   | harissa | هريسة | harissa |
   | tuna | تن | ton |
   | chicken | دجاج | djej |
   | eggs | عظم | 3dham |
   | dates | تمر | tmar |
   | olive oil | زيت زيتون | zit zitoun |
   | semolina | سميد | smid |
   | pasta | مقرونة | ma9rouna |

## Glossary

| English | `tn` | `tnLatn` |
|---|---|---|
| Today / Yesterday / Tomorrow | اليوم / البارح / غدوة | Lyoum / Lbera7 / 8odwa |
| This week / week / month | الجمعة هاذي / جمعة / شهر | El jem3a hedhi / jem3a / chhar |
| Now | توّا | Taw |
| Save | سجّل | Sajjel |
| Cancel | بطّل | Batel |
| Delete | فسّخ | Fasa5 |
| Edit / Change | بدّل | Baddel |
| Add | زيد | Zid |
| Done | تمّ | Tamm |
| Next | اللي بعدو | Eli ba3dou |
| Back | ارجع | Erja3 |
| Start | ابدا | Ebda |
| Finish (a workout) | كمّل | Kammel |
| Skip | فوّت | Fawwet |
| Try again | عاود | 3awed |
| Close | سكّر | Sakker |
| Search | لوّج | Lawwej |
| Settings | الإعدادات | Paramètres |
| Profile | البروفيل | Profil |
| Language | اللغة | Lougha |
| Backup / Back up | نسخة احتياطية / اعمل نسخة | Sauvegarde / A3mel sauvegarde |
| Restore | رجّع | Rajja3 |
| Workout / session | حصّة | Séance |
| Training (activity) | تمرين / سبور | Sport / entraînement |
| Exercise | تمرين (تمارين) | Exercice (exercices) |
| Set | سيري (سيريات) | Série (séries) |
| Rep | مرّة (مرّات), e.g. "8–12 مرّة" | Rep (reps), e.g. "8–12 reps" |
| Rest | راحة | Repos |
| Warm-up | تسخين | Échauffement |
| Load on the bar | الثقل | Charge |
| Body weight | الوزن | Poids |
| Muscle | عضلة (عضلات) | Muscle (muscles) |
| Strength | قوّة | 9owwa |
| Body fat | الشحم | Gras |
| Calories | كالوري | Calories |
| Protein / Carbs / Fat / Fiber | بروتين / نشويات / دهون / ألياف | Protéines / glucides / lipides / fibres |
| Water | ماء | Mé |
| Meal / food | ماكلة | Makla |
| Breakfast | فطور الصباح | Ftour sbe7 |
| Lunch | الغدا | 8de |
| Dinner | العشا | 3cha |
| Snack | لمجة | Lemja |
| Iftar (Ramadan) | الفطور | Ftour |
| Suhoor | السحور | S7our |
| Fasting | صيام | Siyem |
| Ramadan | رمضان | Romdhan |
| Goal | هدف | Objectif |
| Plan / program | البرنامج | Programme |
| Progress | التقدّم | Progrès |
| Steps (walking) | خطوات | Pas |
| Sleep | نوم | Noum |
| Tip | نصيحة | Nasi7a |
| Coach | الكوتش | Coach |
| Learn | تعلّم | Ta3allem |
| Why? | علاش؟ | 3lech? |

## Examples

| English | `tn` | `tnLatn` |
|---|---|---|
| Log set 1 | سجّل السيري 1 | Sajjel série 1 |
| Next exercise | التمرين اللي بعدو | Exercice eli ba3dou |
| Finish workout | كمّل الحصّة | Kammel séance |
| kcal left | كالوري باقية | calories b9aw |
| Beat last time by one rep on at least one set. | زيد مرّة على المرّة اللي فاتت في سيري وحدة على الأقل. | Zid rep wa7da 3al marra eli fetet f série wa7da 3al a9al. |
| You hit the top last time — go up to {{kg}} kg today. | المرّة اللي فاتت وصلت للفوق — طلّع لـ {{kg}} kg اليوم. | L marra eli fetet wsolt lel fou9 — tala3 l {{kg}} kg lyoum. |
| Couldn’t translate right now. | ما نجّمناش نترجمو توّا. | Ma najjamnech netarjmou taw. |
