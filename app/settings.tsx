import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { History, Info, RotateCcw, ShieldCheck, Upload } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData, type AppDataSnapshot } from '@/contexts/AppDataContext';
import { useBackupNow } from '@/hooks/useAutoBackup';
import { fileBackupSupported, pickBackupFile, pickBackupFolder } from '@/lib/fileBackup';
import { Button, Group, ListItem, Screen, Section, Sheet, Tap, Txt, useSnackbar } from '@/components/ds';
import { LanguagePicker } from '@/components/settings/LanguagePicker';
import { space, useTokens } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const { L, formatTime, formatDate } = useLanguage();
  const { exportSnapshot, importSnapshot, resetAll, settings, updateSettings } = useAppData();
  const backupNow = useBackupNow();
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [restore, setRestore] = useState<AppDataSnapshot | null>(null);
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const when = (iso: string) => {
    const d = new Date(iso);
    const time = formatTime(d);
    return d.toDateString() === new Date().toDateString()
      ? L({ en: 'today {{t}}', fr: 'aujourd’hui {{t}}', tn: 'اليوم {{t}}', tnLatn: 'lyoum {{t}}' }, { t: time })
      : `${formatDate(d, { day: 'numeric', month: 'short' })} ${time}`;
  };

  const chooseFolder = async () => {
    const picked = await pickBackupFolder();
    if (!picked) return;
    updateSettings({ fileBackupDirUri: picked.uri, fileBackupDirName: picked.name });
    try {
      backupNow(picked.uri);
      snackbar.show(L({
        en: 'Backup saved in “{{f}}”. It updates by itself from now on.',
        fr: 'Sauvegarde enregistrée dans « {{f}} ». Elle se met à jour toute seule.',
        tn: 'النسخة الاحتياطية تسجّلت في “{{f}}”. من توّا تتجدّد وحدها.',
        tnLatn: 'Sauvegarde tsajlet fi “{{f}}”. Men taw tetjadded wa7adha.',
      }, { f: picked.name }));
    } catch {
      snackbar.show(L({
        en: 'Couldn’t write to that folder. Pick another one.',
        fr: 'Impossible d’écrire dans ce dossier. Choisis-en un autre.',
        tn: 'ما نجّمناش نكتبو في الدوسي هذا. اختار واحد آخر.',
        tnLatn: 'Ma najjamnech nektbou fel dossier hedha. 5tar wa7ed e5er.',
      }));
    }
  };

  const backUp = async () => {
    if (Platform.OS === 'web') {
      // Web preview: download the same file instead.
      const url = URL.createObjectURL(new Blob([JSON.stringify(exportSnapshot())], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `TounsiFit-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    if (!settings.fileBackupDirUri) return chooseFolder();
    try {
      backupNow();
      snackbar.show(L({ en: 'Backup saved', fr: 'Sauvegarde enregistrée', tn: 'النسخة الاحتياطية تسجّلت', tnLatn: 'Sauvegarde tsajlet' }));
    } catch {
      snackbar.show(L({
        en: 'Couldn’t reach the backup folder.',
        fr: 'Dossier de sauvegarde introuvable.',
        tn: 'ما لقيناش الدوسي متاع النسخة الاحتياطية.',
        tnLatn: 'Ma l9inech el dossier mte3 el sauvegarde.',
      }), {
        label: L({ en: 'Choose again', fr: 'Rechoisir', tn: 'اختار من جديد', tnLatn: '5tar men jdid' }),
        onPress: chooseFolder,
      });
    }
  };

  const pickRestore = async () => {
    if (!fileBackupSupported) {
      snackbar.show(L({
        en: 'Restoring a file works in the Android app.',
        fr: 'La restauration d’un fichier marche dans l’app Android.',
        tn: 'ترجيع فيشي يخدم في تطبيق Android.',
        tnLatn: 'Tarji3 fichier ye5dem fel app Android.',
      }));
      return;
    }
    try {
      const snap = await pickBackupFile();
      if (snap) setRestore(snap);
    } catch {
      snackbar.show(L({
        en: 'That file isn’t a Tounsi Fit backup.',
        fr: 'Ce fichier n’est pas une sauvegarde Tounsi Fit.',
        tn: 'الفيشي هذا موش نسخة احتياطية متاع Tounsi Fit.',
        tnLatn: 'El fichier hedha mouch sauvegarde mte3 Tounsi Fit.',
      }));
    }
  };

  const confirmRestore = () => {
    if (!restore) return;
    importSnapshot(restore);
    setRestore(null);
    snackbar.show(L({ en: 'Backup restored', fr: 'Sauvegarde restaurée', tn: 'النسخة الاحتياطية رجعت', tnLatn: 'Sauvegarde rja3et' }));
  };

  const reset = async () => {
    setResetting(true);
    try {
      await resetAll();
      setResetOpen(false);
      router.replace('/onboarding');
    } finally {
      setResetting(false);
    }
  };

  return (
    <Screen back title={L({ en: 'Settings', fr: 'Réglages', tn: 'الإعدادات', tnLatn: 'Paramètres' })}>
      <Section title={L({ en: 'Language', fr: 'Langue', tn: 'اللغة', tnLatn: 'Lougha' })} first>
        <LanguagePicker />
      </Section>

      <Section title={L({ en: 'Your data', fr: 'Tes données', tn: 'الداتا متاعك', tnLatn: 'Les données mte3ek' })}>
        <Txt variant="caption" tone="secondary" style={{ marginBottom: space.md }}>
          {L({
            en: 'Updates keep everything: install the new Tounsi Fit APK over this one and never uninstall first. A backup file also protects you if you lose your phone or remove the app.',
            fr: 'Les mises à jour gardent tout : installe le nouvel APK Tounsi Fit par-dessus celui-ci, sans le désinstaller avant. Un fichier de sauvegarde te protège aussi si tu perds ton téléphone ou supprimes l’app.',
            tn: 'الميزاجور تخلّي كل شي: ركّب الـ APK الجديد متاع Tounsi Fit فوق هذا وما تنحّيهش قبل. وفيشي النسخة الاحتياطية يحميك زادة كان ضيّعت التليفون ولّا نحّيت التطبيق.',
            tnLatn: "Les mises à jour y5alliw kol chay: rakkeb el APK el jdid mte3 Tounsi Fit fou9 hedha w ma tna77ihech 9bal. W fichier el sauvegarde y7amik zeda ken dhaya3t el téléphone walla na77it l'app.",
          })}
        </Txt>
        <Group>
          <ListItem
            title={L({ en: 'Automatic backup', fr: 'Sauvegarde automatique', tn: 'نسخة احتياطية أوتوماتيك', tnLatn: 'Sauvegarde automatique' })}
            supporting={
              settings.fileBackupDirUri
                ? L(
                    {
                      en: 'On · folder “{{f}}”{{w}}',
                      fr: 'Activée · dossier « {{f}} »{{w}}',
                      tn: 'خدّامة · دوسي “{{f}}”{{w}}',
                      tnLatn: '5eddema · dossier “{{f}}”{{w}}',
                    },
                    {
                      f: settings.fileBackupDirName ?? 'Tounsi Fit',
                      w: settings.fileBackupAt ? ` · ${L({ en: 'last', fr: 'dernière', tn: 'آخر مرّة', tnLatn: 'ekher marra' })} ${when(settings.fileBackupAt)}` : '',
                    },
                  )
                : L({
                    en: 'Off · pick a folder, Tounsi Fit keeps a copy there',
                    fr: 'Désactivée · choisis un dossier, Tounsi Fit y garde une copie',
                    tn: 'مطفية · اختار دوسي، Tounsi Fit يخلّي فيه نسخة',
                    tnLatn: 'Mtafya · 5tar dossier, Tounsi Fit y5alli fih copie',
                  })
            }
            leading={(c) => <ShieldCheck size={22} color={c} />}
            trailing={
              <Txt variant="label" tone="accent">
                {settings.fileBackupDirUri ? L({
                  en: 'Change',
                  fr: 'Changer',
                  tn: 'بدّل',
                  tnLatn: 'Baddel',
                }) : L({
                  en: 'Turn on',
                  fr: 'Activer',
                  tn: 'شعّل',
                  tnLatn: 'Cha3el',
                })}
              </Txt>
            }
            onPress={Platform.OS === 'web' ? backUp : chooseFolder}
            divider
          />
          <ListItem
            title={L({ en: 'Back up now', fr: 'Sauvegarder maintenant', tn: 'اعمل نسخة توّا', tnLatn: 'A3mel sauvegarde taw' })}
            supporting={L({
              en: 'Workouts, cardio, meals, weigh-ins and plan in one file',
              fr: 'Séances, cardio, repas, pesées et plan dans un fichier',
              tn: 'الحصص، الكارديو، الماكلة، الوزن والبرنامج في فيشي واحد',
              tnLatn: 'Séances, cardio, makla, pesées w programme f fichier wa7ed',
            })}
            leading={(c) => <Upload size={22} color={c} />}
            onPress={backUp}
            chevron
            divider
          />
          <ListItem
            title={L({ en: 'Restore from a backup file', fr: 'Restaurer une sauvegarde', tn: 'رجّع من فيشي نسخة احتياطية', tnLatn: 'Rajja3 men fichier sauvegarde' })}
            supporting={L({
              en: 'After reinstalling or on a new phone: pick the TounsiFit-backup file',
              fr: 'Après une réinstallation ou sur un nouveau téléphone : choisis le fichier TounsiFit-backup',
              tn: 'بعد ما تعاود تركّب ولّا على تليفون جديد: اختار الفيشي TounsiFit-backup',
              tnLatn: 'Ba3d ma t3awed trakkeb walla 3la téléphone jdid: 5tar el fichier TounsiFit-backup',
            })}
            leading={(c) => <History size={22} color={c} />}
            onPress={pickRestore}
            chevron
            divider
          />
          <DangerRow
            title={L({ en: 'Reset all data', fr: 'Effacer toutes les données', tn: 'فسّخ الداتا الكل', tnLatn: 'Fasa5 les données lkol' })}
            supporting={L({
              en: 'Start again from the questionnaire',
              fr: 'Recommencer depuis le questionnaire',
              tn: 'ابدا من جديد من الأسئلة',
              tnLatn: 'Ebda men jdid mel questionnaire',
            })}
            onPress={() => setResetOpen(true)}
          />
        </Group>
      </Section>

      <Section title={L({ en: 'About', fr: 'À propos', tn: 'على التطبيق', tnLatn: 'À propos' })}>
        <Group>
          <ListItem
            title="Tounsi Fit"
            supporting={L(
              {
                en: 'Version {{v}} · plan, eat and train with your own numbers',
                fr: 'Version {{v}} · planifie, mange et entraîne-toi avec tes chiffres',
                tn: 'نسخة {{v}} · نظّم، كول وتمرّن بالأرقام متاعك',
                tnLatn: 'Version {{v}} · nadhem, koul w tmarren bel ar9am mte3ek',
              },
              { v: version },
            )}
            leading={(c) => <Info size={22} color={c} />}
          />
        </Group>
        <Txt variant="caption" tone="tertiary" style={{ marginTop: space.md }}>
          {L({
            en: 'Tounsi Fit gives general guidance, not medical advice. For a health condition, talk to a doctor.',
            fr: 'Tounsi Fit donne des repères généraux, pas un avis médical. En cas de problème de santé, parles-en à un médecin.',
            tn: 'Tounsi Fit يعطيك نصايح عامّة، موش رأي طبّي. كان عندك مشكل صحّي، احكي مع طبيب.',
            tnLatn: 'Tounsi Fit ya3tik nsaye7 3amma, mouch avis médical. Ken 3andek mochkla sa77iya, a7ki m3a tbib.',
          })}
        </Txt>
      </Section>

      <Sheet visible={resetOpen} onClose={() => setResetOpen(false)} title={L({
        en: 'Erase everything?',
        fr: 'Tout effacer ?',
        tn: 'تفسّخ كل شي؟',
        tnLatn: 'Tfasa5 kol chay?',
      })}>
        <Txt variant="body" tone="secondary">
          {L({
            en: 'This permanently deletes your answers, plan, food diary, weigh-ins, workouts, cardio and saved AI key from this phone. Backup files in your folder and a cloud backup in your Google account are not touched. This cannot be undone.',
            fr: 'Cela supprime définitivement tes réponses, ton plan, ton journal, tes pesées, tes séances, ton cardio et ta clé IA de ce téléphone. Les fichiers de sauvegarde dans ton dossier et une sauvegarde sur ton compte Google ne sont pas touchés. Impossible de revenir en arrière.',
            tn: 'هذا يفسّخ بالكلّ جواباتك، البرنامج، الماكلة اللي سجّلتها، الوزن، الحصص، الكارديو والـ API key المسجّلة من التليفون هذا. فيشيات النسخة الاحتياطية في الدوسي متاعك والنسخة اللي في حساب Google متاعك ما يتمسّوش. ما تنجّمش ترجع لتالي.',
            tnLatn: 'Hedha yfasa5 bel kol jwebek, el programme, el makla eli sajjelt-ha, les pesées, les séances, el cardio w el API key el msajla mel téléphone hedha. Les fichiers de sauvegarde fel dossier mte3ek w el sauvegarde eli f compte Google mte3ek ma yetmassouch. Ma tnajjemch terja3 lteli.',
          })}
        </Txt>
        <Button
          variant="danger"
          label={L({ en: 'Erase all data', fr: 'Effacer toutes les données', tn: 'فسّخ الداتا الكل', tnLatn: 'Fasa5 les données lkol' })}
          onPress={reset}
          loading={resetting}
          fill
          size="lg"
          style={{ marginTop: space.xl }}
        />
        <Button variant="text" label={L({
          en: 'Cancel',
          fr: 'Annuler',
          tn: 'بطّل',
          tnLatn: 'Batel',
        })} onPress={() => setResetOpen(false)} fill style={{ marginTop: space.sm }} />
      </Sheet>

      <Sheet visible={!!restore} onClose={() => setRestore(null)} title={L({
        en: 'Restore this backup?',
        fr: 'Restaurer cette sauvegarde ?',
        tn: 'ترجّع النسخة هاذي؟',
        tnLatn: 'Trajja3 el sauvegarde hedhi?',
      })}>
        {restore ? (
          <Txt tone="secondary">
            {L(
              {
                en: 'Backup from {{d}}: {{w}} workouts, {{c}} cardio, {{m}} foods logged, {{k}} weigh-ins. It replaces what is on this phone now.',
                fr: 'Sauvegarde du {{d}} : {{w}} séances, {{c}} cardio, {{m}} aliments notés, {{k}} pesées. Elle remplace ce qu’il y a sur ce téléphone.',
                tn: 'نسخة متاع {{d}}: {{w}} حصص، {{c}} كارديو، {{m}} ماكلة مسجّلة، {{k}} وزن مسجّل. تاخو بلاصة اللي في التليفون هذا توّا.',
                tnLatn: 'Sauvegarde mte3 {{d}}: {{w}} séances, {{c}} cardio, {{m}} makla msajla, {{k}} pesées. Te5ou blasset eli fel téléphone hedha taw.',
              },
              {
                d: when(restore.exportedAt),
                w: restore.sessions.filter((s) => s.sets.some((x) => x.done)).length,
                c: restore.cardio?.length ?? 0,
                m: restore.foods.length,
                k: restore.weights.length,
              },
            )}
          </Txt>
        ) : null}
        <View style={{ gap: space.sm, marginTop: space.xl }}>
          <Button label={L({ en: 'Restore', fr: 'Restaurer', tn: 'رجّع', tnLatn: 'Rajja3' })} onPress={confirmRestore} size="lg" fill haptic="medium" />
          <Button label={L({ en: 'Cancel', fr: 'Annuler', tn: 'بطّل', tnLatn: 'Batel' })} variant="outlined" onPress={() => setRestore(null)} size="lg" fill />
        </View>
      </Sheet>
    </Screen>
  );
}

/** A list row in the danger tone (ds ListItem has no tone). */
function DangerRow({ title, supporting, onPress }: { title: string; supporting: string; onPress: () => void }) {
  const t = useTokens();
  return (
    <Tap onPress={onPress} pressScale={1} pressedStyle={{ backgroundColor: t.pressed }} accessibilityLabel={title}>
      <View style={styles.row}>
        <View style={styles.leading}>
          <RotateCcw size={22} color={t.danger} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt variant="bodyStrong" tone="danger">
            {title}
          </Txt>
          <Txt variant="caption" tone="secondary" style={{ marginTop: 1 }}>
            {supporting}
          </Txt>
        </View>
      </View>
    </Tap>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    minHeight: 64,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  leading: { width: 24, alignItems: 'center' },
});
