// The Google account backup block (Profile) and the sheet that asks which
// copy to keep when both this phone and the account already have data.

import { type ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FileUp, History, LogOut } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData, type AppDataSnapshot } from '@/contexts/AppDataContext';
import { Button, Sheet, Txt, useSnackbar } from '@/components/ds';
import { snapshotCounts, useGoogleSync, type SyncResult } from '@/hooks/useGoogleSync';
import { fileBackupSupported, pickBackupFile } from '@/lib/fileBackup';
import { space, useTokens } from '@/theme';

type Sync = ReturnType<typeof useGoogleSync>;

export function useSyncMessages() {
  const { L } = useLanguage();
  return (r: SyncResult | undefined) =>
    r === 'restored'
      ? L({
        en: 'Your data is back from your Google account',
        fr: 'Tes données sont revenues depuis ton compte Google',
        tn: 'الداتا متاعك رجعت من حساب Google متاعك',
        tnLatn: 'Les données mte3ek rej3ou mel compte Google mte3ek',
      })
      : r === 'uploaded'
        ? L({
          en: 'Linked: everything now backs up to your Google account',
          fr: 'Lié : tout est maintenant sauvegardé sur ton compte Google',
          tn: 'تربط: من توّا كل شي يتسجّل وحدو في حساب Google متاعك',
          tnLatn: 'Trabet: men taw kol chay yetsajjel wa7dou f compte Google mte3ek',
        })
        : undefined;
}

/** "12 workouts, 3 cardio, 140 foods logged, 20 weigh-ins" */
export function useCountsText() {
  const { L } = useLanguage();
  return (s: Pick<AppDataSnapshot, 'sessions' | 'foods' | 'cardio' | 'weights'>) => {
    const c = snapshotCounts(s);
    return L(
      {
        en: '{{w}} workouts, {{c}} cardio, {{f}} foods logged, {{k}} weigh-ins',
        fr: '{{w}} séances, {{c}} cardio, {{f}} aliments notés, {{k}} pesées',
        tn: '{{w}} حصص، {{c}} كارديو، {{f}} ماكلة مسجّلة، {{k}} وزن مسجّل',
        tnLatn: '{{w}} séances, {{c}} cardio, {{f}} makla msajla, {{k}} pesées',
      },
      { w: c.workouts, c: c.cardio, f: c.foods, k: c.weighIns },
    );
  };
}

/** Both sides have data: keep the account's backup or this phone's data. */
export function SyncChoiceSheet({ sync }: { sync: Sync }) {
  const { L, language, formatDateTime } = useLanguage();
  const snackbar = useSnackbar();
  const { exportSnapshot } = useAppData();
  const counts = useCountsText();
  const when = (iso: string) => formatDateTime(new Date(iso));
  const cloud = sync.choice?.cloud;
  return (
    <Sheet
      visible={!!cloud}
      onClose={sync.dismissChoice}
      title={L({ en: 'Which data do you keep?', fr: 'Quelles données garder ?', tn: 'شنوّة الداتا اللي تخلّيها؟', tnLatn: 'Chnowa les données eli t5alliha?' })}
    >
      {cloud ? (
        <>
          <Txt variant="label">{L({ en: 'In your Google account', fr: 'Sur ton compte Google', tn: 'في حساب Google متاعك', tnLatn: 'F compte Google mte3ek' })}</Txt>
          <Txt tone="secondary" style={styles.para}>
            {`${when(cloud.exportedAt)} · ${counts(cloud)}`}
          </Txt>
          <Txt variant="label" style={{ marginTop: space.md }}>
            {L({ en: 'On this phone', fr: 'Sur ce téléphone', tn: 'في التليفون هذا', tnLatn: 'Fel téléphone hedha' })}
          </Txt>
          <Txt tone="secondary" style={styles.para}>
            {counts(exportSnapshot())}
          </Txt>
          <Txt variant="caption" tone="tertiary" style={{ marginTop: space.md }}>
            {L({
              en: 'The one you don’t keep is replaced. If unsure, keep the one with more workouts.',
              fr: 'Celle que tu ne gardes pas est remplacée. Dans le doute, garde celle qui a le plus de séances.',
              tn: 'اللي ما تخلّيهاش تتعوّض. كان موش متأكّد، خلّي اللي فيها حصص أكثر.',
              tnLatn: 'Eli ma t5allihech tet3awedh. Ken mouch mtakked, 5alli eli fiha séances akther.',
            })}
          </Txt>
        </>
      ) : null}
      <View style={styles.actions}>
        <Button
          label={L({ en: 'Use my Google backup', fr: 'Utiliser ma sauvegarde Google', tn: 'استعمل نسخة Google متاعي', tnLatn: 'Esta3mel sauvegarde Google mte3i' })}
          onPress={() => {
            sync.keepCloud();
            snackbar.show(L({
              en: 'Restored from your Google account',
              fr: 'Restauré depuis ton compte Google',
              tn: 'رجعت من حساب Google متاعك',
              tnLatn: 'Rja3et mel compte Google mte3ek',
            }));
          }}
          size="lg"
          fill
        />
        <Button
          label={L({ en: 'Keep this phone’s data', fr: 'Garder les données du téléphone', tn: 'خلّي داتا التليفون هذا', tnLatn: '5alli les données mte3 el téléphone' })}
          variant="outlined"
          onPress={async () => {
            await sync.keepPhone();
            snackbar.show(L({
              en: 'Backed up to your Google account',
              fr: 'Sauvegardé sur ton compte Google',
              tn: 'تسجّلت في حساب Google متاعك',
              tnLatn: 'Tsajlet f compte Google mte3ek',
            }));
          }}
          loading={sync.busy === 'backup'}
          size="lg"
          fill
        />
      </View>
    </Sheet>
  );
}

/** Profile → Google account & backup. */
export function GoogleBackupSection() {
  const t = useTokens();
  const { L, language, formatDateTime } = useLanguage();
  const snackbar = useSnackbar();
  const { settings } = useAppData();
  const sync = useGoogleSync();
  const message = useSyncMessages();
  const [restoreOpen, setRestoreOpen] = useState(false);
  const fmtDate = (iso?: string) => (iso ? formatDateTime(new Date(iso)) : '—');

  let body: ReactNode;
  if (sync.user) {
    body = (
      <>
        <View style={styles.status}>
          <View style={[styles.dot, { backgroundColor: sync.synced ? t.success : t.textTertiary }]} />
          <Txt variant="bodyStrong" style={{ flex: 1 }} numberOfLines={1}>
            {sync.user.email ?? L({ en: 'Signed in', fr: 'Connecté', tn: 'داخل', tnLatn: 'Connecté' })}
          </Txt>
        </View>
        <Txt variant="caption" tone="tertiary" style={styles.under}>
          {sync.synced
            ? L(
                {
                  en: 'Backs up by itself after every change · last {{d}}',
                  fr: 'Sauvegarde toute seule à chaque changement · dernière {{d}}',
                  tn: 'تتسجّل وحدها بعد كل تبديلة · آخر مرّة {{d}}',
                  tnLatn: 'Tetsajjel wa7adha ba3d kol tabdila · ekher marra {{d}}',
                },
                { d: fmtDate(settings.lastBackupAt) },
              )
            : L({
              en: 'Not linked yet: tap “Link this phone”.',
              fr: 'Pas encore lié : touche « Lier ce téléphone ».',
              tn: 'مازال موش مربوط: انزل على “اربط التليفون هذا”.',
              tnLatn: 'Mazel mouch marbout: enzel 3la “Orbot el téléphone hedha”.',
            })}
        </Txt>
        <View style={[styles.row, { marginTop: space.md }]}>
          {sync.synced ? (
            <Button
              variant="tonal"
              label={L({ en: 'Back up now', fr: 'Sauvegarder', tn: 'اعمل نسخة توّا', tnLatn: 'A3mel sauvegarde taw' })}
              onPress={async () => {
                await sync.backupNow();
                snackbar.show(L({ en: 'Backup saved', fr: 'Sauvegarde effectuée', tn: 'النسخة الاحتياطية تسجّلت', tnLatn: 'Sauvegarde tsajlet' }));
              }}
              loading={sync.busy === 'backup'}
              disabled={!!sync.busy && sync.busy !== 'backup'}
            />
          ) : (
            <Button
              label={L({ en: 'Link this phone', fr: 'Lier ce téléphone', tn: 'اربط التليفون هذا', tnLatn: 'Orbot el téléphone hedha' })}
              onPress={async () => {
                const m = message(await sync.relink());
                if (m) snackbar.show(m);
              }}
              loading={sync.busy === 'restore'}
            />
          )}
          <Button
            variant="outlined"
            label={L({ en: 'Restore', fr: 'Restaurer', tn: 'رجّع', tnLatn: 'Rajja3' })}
            onPress={() => setRestoreOpen(true)}
            loading={sync.busy === 'restore' && sync.synced}
            disabled={!!sync.busy && sync.busy !== 'restore'}
          />
        </View>
        <Button
          variant="text"
          label={L({ en: 'Sign out', fr: 'Se déconnecter', tn: 'اخرج', tnLatn: 'Déconnecti' })}
          icon={(c) => <LogOut size={20} color={c} />}
          onPress={sync.leave}
          loading={sync.busy === 'signout'}
          style={styles.inlineText}
        />
      </>
    );
  } else if (sync.availability === 'ready') {
    body = (
      <>
        <Txt tone="secondary">
          {L({
            en: 'Sign in and your workouts, cardio, meals, weigh-ins and plan back up to your own Google account by themselves (Firebase, free). On a new phone or after reinstalling, sign in to get everything back.',
            fr: 'Connecte-toi et tes séances, ton cardio, tes repas, tes pesées et ton plan se sauvegardent tout seuls sur ton propre compte Google (Firebase, gratuit). Sur un nouveau téléphone ou après une réinstallation, connecte-toi pour tout récupérer.',
            tn: 'ادخل وحصصك، الكارديو، الماكلة، الوزن والبرنامج يتسجّلو وحدهم في حساب Google متاعك (Firebase، بلاش). على تليفون جديد ولّا بعد ما تعاود تركّب، ادخل باش ترجّع كل شي.',
            tnLatn: 'Connecti w les séances, el cardio, el makla, les pesées w el programme yetsajlou wa7adhom f compte Google mte3ek (Firebase, blech). 3la téléphone jdid walla ba3d ma t3awed trakkeb, connecti bech trajja3 kol chay.',
          })}
        </Txt>
        <Button
          label={L({ en: 'Sign in with Google', fr: 'Se connecter avec Google', tn: 'ادخل بـ Google', tnLatn: 'Connecti b Google' })}
          onPress={async () => {
            const m = message(await sync.signIn());
            if (m) snackbar.show(m);
          }}
          loading={sync.busy === 'signin'}
          style={{ marginTop: space.lg }}
        />
      </>
    );
  } else {
    body = (
      <Txt variant="caption" tone="secondary">
        {sync.availability === 'needs_build'
          ? L({
              en: 'Google sign-in works in the installed Tounsi Fit app, not in Expo Go.',
              fr: 'La connexion Google fonctionne dans l’app Tounsi Fit installée, pas dans Expo Go.',
              tn: 'الدخول بـ Google يخدم في تطبيق Tounsi Fit المركّب، موش في Expo Go.',
              tnLatn: 'Connexion Google te5dem fel app Tounsi Fit el mrakba, mouch f Expo Go.',
            })
          : L({
              en: 'Google sign-in isn’t switched on in this version yet. Until it is, use the backup folder in Settings.',
              fr: 'La connexion Google n’est pas encore activée dans cette version. En attendant, utilise le dossier de sauvegarde dans Réglages.',
              tn: 'الدخول بـ Google مازال ما تشعلش في النسخة هاذي. لين يتشعل، استعمل دوسي النسخة الاحتياطية في الإعدادات.',
              tnLatn: 'Connexion Google mazelet ma tcha3letch fel version hedhi. Lin tetcha3el, esta3mel dossier el sauvegarde fel Paramètres.',
            })}
      </Txt>
    );
  }

  return (
    <>
      {body}
      {sync.error ? (
        <Txt variant="caption" tone="danger" style={{ marginTop: space.sm }} selectable>
          {sync.error}
        </Txt>
      ) : null}
      <SyncChoiceSheet sync={sync} />
      <Sheet visible={restoreOpen} onClose={() => setRestoreOpen(false)} title={L({
        en: 'Restore your backup?',
        fr: 'Restaurer ta sauvegarde ?',
        tn: 'ترجّع النسخة الاحتياطية متاعك؟',
        tnLatn: 'Trajja3 el sauvegarde mte3ek?',
      })}>
        <Txt tone="secondary">
          {L({
            en: 'This replaces everything on this phone with the copy saved in your Google account. Anything logged here since that backup is lost.',
            fr: 'Cela remplace tout sur ce téléphone par la copie enregistrée sur ton compte Google. Ce que tu as noté ici depuis cette sauvegarde est perdu.',
            tn: 'هذا يبدّل كل شي في التليفون هذا بالنسخة المسجّلة في حساب Google متاعك. أي حاجة سجّلتها هوني من بعد النسخة هاذيكا تمشي.',
            tnLatn: 'Hedha ybaddel kol chay fel téléphone hedha bel copie el msajla f compte Google mte3ek. Ay 7aja sajjelt-ha houni men ba3d el sauvegarde hedhika temchi.',
          })}
        </Txt>
        <View style={styles.actions}>
          <Button
            variant="danger"
            label={L({ en: 'Replace with my backup', fr: 'Remplacer par ma sauvegarde', tn: 'بدّل بالنسخة متاعي', tnLatn: 'Baddel bel sauvegarde mte3i' })}
            onPress={async () => {
              setRestoreOpen(false);
              const r = await sync.restoreNow();
              snackbar.show(
                r === 'restored'
                  ? L({
                    en: 'Restored from your Google account',
                    fr: 'Restauré depuis ton compte Google',
                    tn: 'رجعت من حساب Google متاعك',
                    tnLatn: 'Rja3et mel compte Google mte3ek',
                  })
                  : L({
                    en: 'No backup found for this account.',
                    fr: 'Aucune sauvegarde pour ce compte.',
                    tn: 'ما لقينا حتّى نسخة احتياطية للحساب هذا.',
                    tnLatn: 'Ma l9ina 7atta sauvegarde lel compte hedha.',
                  }),
              );
            }}
            size="lg"
            fill
          />
          <Button variant="outlined" label={L({ en: 'Cancel', fr: 'Annuler', tn: 'بطّل', tnLatn: 'Batel' })} onPress={() => setRestoreOpen(false)} size="lg" fill />
        </View>
      </Sheet>
    </>
  );
}

/**
 * First launch (onboarding): bring an existing Tounsi Fit history back instead
 * of answering the questions again, from the Google account or a backup file.
 */
export function RestoreEntry() {
  const router = useRouter();
  const { L } = useLanguage();
  const { importSnapshot } = useAppData();
  const sync = useGoogleSync();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const done = () => {
    setOpen(false);
    router.replace('/(tabs)');
  };
  return (
    <>
      <Button
        variant="text"
        label={L({ en: 'Restore my data', fr: 'Restaurer mes données', tn: 'رجّع الداتا متاعي', tnLatn: 'Rajja3 les données mte3i' })}
        icon={(c) => <History size={18} color={c} />}
        onPress={() => {
          setNote(null);
          setOpen(true);
        }}
        style={{ marginTop: space.lg, marginLeft: -space.md }}
      />
      <Sheet visible={open} onClose={() => setOpen(false)} title={L({
        en: 'Restore my data',
        fr: 'Restaurer mes données',
        tn: 'رجّع الداتا متاعي',
        tnLatn: 'Rajja3 les données mte3i',
      })}>
        <Txt tone="secondary">
          {L({
            en: 'Bring back your workouts, cardio, meals, weigh-ins and plan from your Google account or from a TounsiFit-backup file.',
            fr: 'Récupère tes séances, ton cardio, tes repas, tes pesées et ton plan depuis ton compte Google ou un fichier TounsiFit-backup.',
            tn: 'رجّع حصصك، الكارديو، الماكلة، الوزن والبرنامج من حساب Google متاعك ولّا من فيشي TounsiFit-backup.',
            tnLatn: 'Rajja3 les séances, el cardio, el makla, les pesées w el programme mel compte Google mte3ek walla men fichier TounsiFit-backup.',
          })}
        </Txt>
        <View style={styles.actions}>
          {sync.availability === 'ready' ? (
            <Button
              label={L({ en: 'From my Google account', fr: 'Depuis mon compte Google', tn: 'من حساب Google متاعي', tnLatn: 'Mel compte Google mte3i' })}
              onPress={async () => {
                const r = await sync.signIn();
                if (r === 'restored') done();
                else if (r === 'uploaded')
                  setNote(L({
                    en: 'This Google account has no Tounsi Fit backup yet.',
                    fr: 'Ce compte Google n’a pas encore de sauvegarde Tounsi Fit.',
                    tn: 'حساب Google هذا مازال ما فيهش نسخة احتياطية متاع Tounsi Fit.',
                    tnLatn: 'Compte Google hedha mazel ma fihech sauvegarde mte3 Tounsi Fit.',
                  }));
              }}
              loading={sync.busy === 'signin'}
              size="lg"
              fill
            />
          ) : null}
          {fileBackupSupported ? (
            <Button
              label={L({ en: 'From a backup file', fr: 'Depuis un fichier de sauvegarde', tn: 'من فيشي نسخة احتياطية', tnLatn: 'Men fichier sauvegarde' })}
              variant={sync.availability === 'ready' ? 'outlined' : 'filled'}
              icon={(c) => <FileUp size={20} color={c} />}
              onPress={async () => {
                try {
                  const snap = await pickBackupFile();
                  if (!snap) return;
                  if (!snap.profile) {
                    setNote(L({
                      en: 'That backup has no profile in it.',
                      fr: 'Cette sauvegarde ne contient pas de profil.',
                      tn: 'النسخة هاذي ما فيهاش بروفيل.',
                      tnLatn: 'El sauvegarde hedhi ma fihech profil.',
                    }));
                    return;
                  }
                  importSnapshot(snap);
                  done();
                } catch {
                  setNote(L({
                    en: 'That file isn’t a Tounsi Fit backup.',
                    fr: 'Ce fichier n’est pas une sauvegarde Tounsi Fit.',
                    tn: 'الفيشي هذا موش نسخة احتياطية متاع Tounsi Fit.',
                    tnLatn: 'El fichier hedha mouch sauvegarde mte3 Tounsi Fit.',
                  }));
                }
              }}
              size="lg"
              fill
            />
          ) : null}
        </View>
        {note || sync.error ? (
          <Txt variant="caption" tone={sync.error ? 'danger' : 'secondary'} style={{ marginTop: space.md }} selectable>
            {note ?? sync.error}
          </Txt>
        ) : null}
      </Sheet>
      <SyncChoiceSheet sync={sync} />
    </>
  );
}

const styles = StyleSheet.create({
  para: { marginTop: 2 },
  actions: { gap: space.sm, marginTop: space.xl },
  status: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
  under: { marginTop: space.xs, marginLeft: 20 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.sm },
  inlineText: { marginLeft: -space.md, marginTop: space.xs },
});
