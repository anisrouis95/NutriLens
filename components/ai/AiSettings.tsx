// Profile → AI: one status for the whole chain (Gemini, then Groq, then
// OpenRouter, all on free plans), a test button that says who answered, and
// per provider the key in use (built into the app, or pasted on this phone).

import { useCallback, useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { ExternalLink, KeyRound } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button, Divider, Field, Group, ListItem, Txt, Why, useSnackbar } from '@/components/ds';
import { SECRET_KEYS, deleteSecret, getSecret, setSecret } from '@/lib/storage';
import { GeminiError, PROVIDERS, testAI, type AiAnswer, type ProviderId } from '@/services/ai';
import { clearRests } from '@/services/aiCooldown';
import { hasBuiltInGeminiKey } from '@/services/gemini';
import { hasBuiltInGroqKey } from '@/services/groq';
import { BUILT_IN_OPENROUTER_KEY } from '@/services/openrouter';
import { space, useTokens } from '@/theme';
import type { LocalizedText } from '@/lib/i18n';

const INFO: Record<ProviderId, { secret: string; builtIn: boolean; url: string; placeholder: string }> = {
  gemini: { secret: SECRET_KEYS.geminiApiKey, builtIn: hasBuiltInGeminiKey, url: 'https://aistudio.google.com/apikey', placeholder: 'AIza…' },
  groq: { secret: SECRET_KEYS.groqApiKey, builtIn: hasBuiltInGroqKey, url: 'https://console.groq.com/keys', placeholder: 'gsk_…' },
  openrouter: { secret: SECRET_KEYS.openRouterApiKey, builtIn: !!BUILT_IN_OPENROUTER_KEY, url: 'https://openrouter.ai/keys', placeholder: 'sk-or-…' },
};

type Result = { kind: 'ok'; answer: AiAnswer } | { kind: 'fail'; code: string; detail: string } | null;

const T = {
  ready: { en: 'Ready · {{list}}', fr: 'Prêt · {{list}}', tn: 'واجد · {{list}}', tnLatn: 'Wejed · {{list}}' },
  notSet: { en: 'Not set up', fr: 'Non configuré', tn: 'مازال ما تحطّش', tnLatn: 'Mazel ma t7attech' },
  testing: { en: 'Testing…', fr: 'Test en cours…', tn: 'نجرّبو…', tnLatn: 'Njarbou…' },
  ok: {
    en: 'Working · answered by {{p}} ({{m}})',
    fr: 'Fonctionne · réponse de {{p}} ({{m}})',
    tn: 'يخدم · جاوب {{p}} ({{m}})',
    tnLatn: 'Ye5dem · jéweb {{p}} ({{m}})',
  },
  quota: {
    en: 'Free limits reached for now; try again later',
    fr: 'Limites gratuites atteintes pour le moment ; réessaie plus tard',
    tn: 'الحدود المجانية وفات توّا؛ عاود بعد شويّة',
    tnLatn: 'Les limites gratuites wfet taw; 3awed ba3d chwaya',
  },
  offline: { en: 'No internet connection', fr: 'Pas de connexion internet', tn: 'ما فماش انترنت', tnLatn: 'Ma famech internet' },
  badKey: { en: 'Key rejected — check it', fr: 'Clé refusée — vérifie-la', tn: 'الـ key ما تقبلتش — ثبّت فيها', tnLatn: 'El key ma t9ebletch — thabbet fiha' },
  failed: { en: 'No AI answered', fr: 'Aucune IA n’a répondu', tn: 'حتى IA ما جاوبت', tnLatn: '7atta IA ma jewbet' },
  how: {
    en: 'Tounsi Fit tries Gemini, then Groq, then OpenRouter, all on free plans. When one runs out of free requests for the day, the next one answers.',
    fr: 'Tounsi Fit essaie Gemini, puis Groq, puis OpenRouter, tous en offre gratuite. Quand l’un n’a plus de requêtes gratuites pour la journée, le suivant répond.',
    tn: 'Tounsi Fit يجرّب Gemini، من بعد Groq، من بعد OpenRouter، الكل بلاش. كي واحد يوفالو الحد المجاني متاع النهار، اللي بعدو يجاوب.',
    tnLatn: 'Tounsi Fit yjarreb Gemini, ba3d Groq, ba3d OpenRouter, el kol blech. Ki wa7ed youfalou el limite gratuite mta3 nhar, eli ba3dou yjéweb.',
  },
  test: { en: 'Test AI', fr: 'Tester l’IA', tn: 'جرّب الـ IA', tnLatn: 'Jarreb el IA' },
  builtIn: { en: 'Built into the app', fr: 'Intégrée à l’app', tn: 'مدموجة في التطبيق', tnLatn: 'Mdamja fel app' },
  yours: { en: 'Your key, on this phone', fr: 'Ta clé, sur ce téléphone', tn: 'الـ key متاعك، على التليفون هذا', tnLatn: 'El key mte3ek, 3al téléphone hedha' },
  none: { en: 'No key', fr: 'Pas de clé', tn: 'ما فماش key', tnLatn: 'Ma famech key' },
  works: { en: '{{s}} · works', fr: '{{s}} · fonctionne', tn: '{{s}} · يخدم', tnLatn: '{{s}} · ye5dem' },
  useOwn: { en: 'Use my own key', fr: 'Utiliser ma propre clé', tn: 'استعمل الـ key متاعي', tnLatn: 'Esta3mel el key mte3i' },
  getKey: { en: 'Get a free key', fr: 'Obtenir une clé gratuite', tn: 'خوذ key بلاش', tnLatn: '5oudh key blech' },
  keyLabel: { en: 'Your {{p}} key', fr: 'Ta clé {{p}}', tn: 'الـ {{p}} key متاعك', tnLatn: 'El {{p}} key mte3ek' },
  save: { en: 'Save & test', fr: 'Enregistrer et tester', tn: 'سجّل وجرّب', tnLatn: 'Sajjel w jarreb' },
  remove: { en: 'Remove my key', fr: 'Supprimer ma clé', tn: 'نحّي الـ key متاعي', tnLatn: 'Na77i el key mte3i' },
  removed: { en: 'Key removed from this phone', fr: 'Clé supprimée de ce téléphone', tn: 'الـ key تنحّات من التليفون', tnLatn: 'El key tna77at mel téléphone' },
  whyTitle: { en: 'Is it really free? What about privacy?', fr: 'C’est vraiment gratuit ? Et la vie privée ?', tn: 'بلاش بالحق؟ والخصوصية؟', tnLatn: 'Blech bel 7a9? W el confidentialité?' },
  whyBody: {
    en: 'All three run on free plans with no payment method, so nothing can ever be charged. Each one allows a limited number of requests per minute and per day; together that is plenty for logging your own meals.\n\nOn free plans, these companies may use what you send (meal photos, questions) to improve their models, so don’t send anything private.',
    fr: 'Les trois fonctionnent en offre gratuite, sans moyen de paiement : rien ne peut jamais être facturé. Chacun autorise un nombre limité de requêtes par minute et par jour ; ensemble, c’est largement assez pour noter tes repas.\n\nEn offre gratuite, ces entreprises peuvent utiliser ce que tu envoies (photos de repas, questions) pour améliorer leurs modèles : n’envoie rien de privé.',
    tn: 'الثلاثة يخدمو بالعرض المجاني ومن غير حتى طريقة خلاص، يعني حتى شي ما يتخلّص. كل واحد يسمح بعدد محدود متاع طلبات في الدقيقة وفي النهار؛ مع بعضهم يكفيو وزيادة باش تسجّل ماكلتك.\n\nفي العرض المجاني، الشركات هاذم ينجّمو يستعملو اللي تبعثو (تصاور الماكلة، الأسئلة) باش يحسّنو الموديلات متاعهم، ما تبعث حتى شي خاص.',
    tnLatn: 'Ethlatha ye5dmou bel offre gratuite w men 8ir 7atta moyen de paiement, ya3ni 7atta chay ma yet5allas. Kol wa7ed yesma7 b nombre m7doud mta3 requêtes fel d9i9a w fi nhar; m3a ba3dhhom yekfiw w zyeda bech tsajjel maklek.\n\nFel offre gratuite, les sociétés hedhom ynajjmou yesta3mlou eli tab3thou (tsawer el makla, les questions) bech y7assnou les modèles mte3hom, ma tab3ath 7atta chay privé.',
  },
} satisfies Record<string, LocalizedText>;

export function AiSettings() {
  const t = useTokens();
  const snackbar = useSnackbar();
  const { L } = useLanguage();
  const [ownKey, setOwnKey] = useState<Record<ProviderId, boolean>>({ gemini: false, groq: false, openrouter: false });
  const [open, setOpen] = useState<ProviderId | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState<ProviderId | 'all' | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [providerOk, setProviderOk] = useState<Partial<Record<ProviderId, boolean>>>({});

  const refresh = useCallback(async () => {
    const entries = await Promise.all(PROVIDERS.map(async (p) => [p.id, !!(await getSecret(INFO[p.id].secret))] as const));
    setOwnKey(Object.fromEntries(entries) as Record<ProviderId, boolean>);
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const available = PROVIDERS.filter((p) => ownKey[p.id] || INFO[p.id].builtIn);

  const run = async (only?: ProviderId) => {
    setBusy(only ?? 'all');
    try {
      const answer = await testAI(only);
      setResult({ kind: 'ok', answer });
      setProviderOk((s) => ({ ...s, [answer.provider]: true }));
    } catch (e) {
      const err = e instanceof GeminiError ? e : new GeminiError('server', String(e));
      setResult({ kind: 'fail', code: err.code, detail: err.message.replace(/sk-[A-Za-z0-9-]{8,}|gsk_[A-Za-z0-9]{8,}|AIza[\w-]{8,}/g, '…') });
      if (only) setProviderOk((s) => ({ ...s, [only]: false }));
    } finally {
      setBusy(null);
    }
  };

  const save = async (id: ProviderId) => {
    const key = input.trim();
    if (!key) return;
    await setSecret(INFO[id].secret, key);
    await clearRests(`${id}:`);
    setInput('');
    setOpen(null);
    await refresh();
    await run(id);
  };
  const remove = async (id: ProviderId) => {
    await deleteSecret(INFO[id].secret);
    await clearRests(`${id}:`);
    setOpen(null);
    await refresh();
    snackbar.show(L(T.removed));
  };

  const name = (id: ProviderId) => PROVIDERS.find((p) => p.id === id)!.name;
  const status: { text: string; color: string } =
    busy === 'all'
      ? { text: L(T.testing), color: t.textTertiary }
      : result?.kind === 'ok'
        ? { text: L(T.ok, { p: name(result.answer.provider), m: result.answer.model }), color: t.success }
        : result?.kind === 'fail'
          ? {
              text: L(result.code === 'quota' ? T.quota : result.code === 'network' ? T.offline : result.code === 'invalid_key' ? T.badKey : T.failed),
              color: result.code === 'quota' || result.code === 'network' ? t.textTertiary : t.danger,
            }
          : available.length
            ? { text: L(T.ready, { list: available.map((p) => p.name).join(', ') }), color: t.textTertiary }
            : { text: L(T.notSet), color: t.textDisabled };

  return (
    <View>
      <View style={styles.status}>
        <View style={[styles.dot, { backgroundColor: status.color }]} />
        <Txt variant="bodyStrong" style={{ flex: 1 }}>
          {status.text}
        </Txt>
      </View>
      {result?.kind === 'fail' && result.detail ? (
        <Txt variant="caption" tone="tertiary" selectable style={{ marginTop: space.xs, marginStart: 20 }}>
          {result.detail}
        </Txt>
      ) : null}
      <Txt variant="caption" tone="secondary" style={{ marginTop: space.md }}>
        {L(T.how)}
      </Txt>
      <Button variant="tonal" label={L(T.test)} onPress={() => run()} loading={busy === 'all'} style={{ marginTop: space.md, alignSelf: 'flex-start' }} />

      <Group style={{ marginTop: space.lg }}>
        {PROVIDERS.map((p, i) => {
          const source = ownKey[p.id] ? L(T.yours) : INFO[p.id].builtIn ? L(T.builtIn) : L(T.none);
          const supporting = providerOk[p.id] ? L(T.works, { s: source }) : source;
          return (
            <View key={p.id}>
              {i > 0 ? <Divider inset={space.lg} /> : null}
              <ListItem
                title={p.name}
                supporting={supporting}
                leading={(c) => <KeyRound size={20} color={c} />}
                onPress={() => {
                  setInput('');
                  setOpen(open === p.id ? null : p.id);
                }}
                chevron
              />
              {open === p.id ? (
                <View style={styles.editor}>
                  <Field
                    label={L(T.keyLabel, { p: p.name })}
                    value={input}
                    onChangeText={setInput}
                    placeholder={INFO[p.id].placeholder}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                  />
                  <View style={styles.buttons}>
                    <Button label={L(T.save)} onPress={() => save(p.id)} disabled={!input.trim()} loading={busy === p.id} />
                    {ownKey[p.id] ? <Button variant="text" label={L(T.remove)} onPress={() => remove(p.id)} /> : null}
                    <Button
                      variant="text"
                      label={L(T.getKey)}
                      icon={(c) => <ExternalLink size={18} color={c} />}
                      onPress={() => Linking.openURL(INFO[p.id].url)}
                    />
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </Group>

      <Why title={L(T.whyTitle)} style={{ marginTop: space.lg }}>
        <Txt variant="body" tone="secondary">
          {L(T.whyBody)}
        </Txt>
      </Why>
    </View>
  );
}

const styles = StyleSheet.create({
  status: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
  editor: { paddingHorizontal: space.lg, paddingBottom: space.lg, gap: space.md },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.sm },
});
