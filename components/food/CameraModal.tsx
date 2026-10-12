import { useRef, useState, type ReactNode } from 'react';
import { Linking, Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, RefreshCcw, X } from 'lucide-react-native';
import { Button, Tap, Txt } from '@/components/ds';
import { useLanguage } from '@/contexts/LanguageContext';
import { palette, radius, space, useTokens } from '@/theme';

interface Props {
  visible: boolean;
  mode: 'photo' | 'barcode';
  onClose: () => void;
  onPhoto?: (uri: string) => void;
  onBarcode?: (code: string) => void;
}

// The viewfinder is a night surface; its overlays read from the palette.
const night = palette;

export default function CameraModal({ visible, mode, onClose, onPhoto, onBarcode }: Props) {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const { L } = useLanguage();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [taking, setTaking] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const handled = useRef(false);

  const takePicture = async () => {
    if (taking) return;
    setTaking(true);
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) onPhoto?.(photo.uri);
    } finally {
      setTaking(false);
    }
  };

  const blocked = !!permission && !permission.granted && !permission.canAskAgain;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      navigationBarTranslucent
      onShow={() => (handled.current = false)}
      onRequestClose={onClose}
    >
      {!permission ? (
        // Permission status still loading.
        <View style={[styles.fill, { backgroundColor: t.ground }]} />
      ) : !permission.granted ? (
        <View
          style={[
            styles.permission,
            { backgroundColor: t.ground, paddingTop: insets.top + space.xl, paddingBottom: insets.bottom + space.xl },
          ]}
        >
          <Camera size={24} color={t.textSecondary} />
          <Txt variant="title" align="center" style={{ marginTop: space.md }}>
            {L({ en: 'Camera access', fr: 'Accès à la caméra' })}
          </Txt>
          <Txt variant="body" tone="secondary" align="center" style={{ marginTop: space.sm, marginBottom: space.xl }}>
            {blocked
              ? L({
                  en: 'Camera access is turned off for NutriLens. Turn it on in the system settings to photograph meals and scan barcodes.',
                  fr: 'L’accès à la caméra est désactivé pour NutriLens. Active-le dans les réglages du téléphone pour photographier les repas et scanner les codes-barres.',
                })
              : L({
                  en: 'NutriLens needs the camera to photograph meals and scan barcodes.',
                  fr: 'NutriLens a besoin de l’appareil photo pour photographier les repas et scanner les codes-barres.',
                })}
          </Txt>
          <Button
            label={blocked ? L({ en: 'Open settings', fr: 'Ouvrir les réglages' }) : L({ en: 'Allow camera', fr: 'Autoriser la caméra' })}
            onPress={blocked ? () => Linking.openSettings() : requestPermission}
            size="lg"
            fill
          />
          <Button
            label={L({ en: 'Cancel', fr: 'Annuler' })}
            variant="outlined"
            onPress={onClose}
            size="lg"
            fill
            style={{ marginTop: space.md }}
          />
        </View>
      ) : (
        <View style={[styles.fill, { backgroundColor: night.ground }]}>
          {/* The camera takes no children: overlays sit above it, absolutely positioned. */}
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            barcodeScannerSettings={mode === 'barcode' ? { barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] } : undefined}
            onBarcodeScanned={
              mode === 'barcode'
                ? ({ data }) => {
                    if (handled.current || !data) return;
                    handled.current = true;
                    onBarcode?.(data);
                  }
                : undefined
            }
          />

          <View
            pointerEvents="box-none"
            style={[StyleSheet.absoluteFill, { paddingTop: insets.top + space.md, paddingBottom: insets.bottom + space.xl }]}
          >
            <View style={styles.topBar} pointerEvents="box-none">
              <ScrimButton label={L({ en: 'Close camera', fr: 'Fermer la caméra' })} onPress={onClose}>
                <X size={24} color={night.text} />
              </ScrimButton>
              <View style={[styles.hint, { backgroundColor: night.scrim }]}>
                <Txt variant="label" color={night.text}>
                  {mode === 'barcode'
                    ? L({ en: 'Point at the barcode', fr: 'Vise le code-barres' })
                    : L({
                        en: 'Whole plate in frame, from above, good light',
                        fr: 'Toute l’assiette, vue de dessus, bonne lumière',
                      })}
                </Txt>
              </View>
            </View>

            <View style={styles.middle} pointerEvents="none">
              {mode === 'barcode' ? (
                <View style={styles.frame}>
                  <View style={[styles.corner, styles.topLeft, { borderColor: night.accent }]} />
                  <View style={[styles.corner, styles.topRight, { borderColor: night.accent }]} />
                  <View style={[styles.corner, styles.bottomLeft, { borderColor: night.accent }]} />
                  <View style={[styles.corner, styles.bottomRight, { borderColor: night.accent }]} />
                </View>
              ) : null}
            </View>

            {mode === 'photo' ? (
              <View style={styles.bottomBar}>
                <ScrimButton
                  label={L({ en: 'Switch camera', fr: 'Changer de caméra' })}
                  onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
                >
                  <RefreshCcw size={22} color={night.text} />
                </ScrimButton>
                <Tap
                  onPress={takePicture}
                  disabled={taking}
                  haptic="medium"
                  pressScale={0.92}
                  accessibilityLabel={L({ en: 'Take photo', fr: 'Prendre la photo' })}
                  style={[styles.capture, { borderColor: night.text }]}
                >
                  <View style={[styles.captureInner, { backgroundColor: night.text }]} />
                </Tap>
                <View style={{ width: 48 }} />
              </View>
            ) : null}
          </View>
        </View>
      )}
    </Modal>
  );
}

/** Round icon button on a dark scrim, legible over any camera image. */
function ScrimButton({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  return (
    <Tap
      onPress={onPress}
      accessibilityLabel={label}
      pressScale={0.92}
      hitSlop={4}
      style={[styles.scrimButton, { backgroundColor: night.scrim }]}
      pressedStyle={{ backgroundColor: night.pressed }}
    >
      {children}
    </Tap>
  );
}

const CORNER = 32;
const STROKE = 4;

const styles = StyleSheet.create({
  fill: { flex: 1 },
  permission: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: space.xl },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg },
  hint: {
    flexShrink: 1,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
  },
  scrimButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  middle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: { width: '80%', height: 160 },
  corner: { position: 'absolute', width: CORNER, height: CORNER },
  topLeft: { top: 0, left: 0, borderTopWidth: STROKE, borderLeftWidth: STROKE, borderTopLeftRadius: radius.md },
  topRight: { top: 0, right: 0, borderTopWidth: STROKE, borderRightWidth: STROKE, borderTopRightRadius: radius.md },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: STROKE, borderLeftWidth: STROKE, borderBottomLeftRadius: radius.md },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: STROKE, borderRightWidth: STROKE, borderBottomRightRadius: radius.md },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: space.lg,
  },
  capture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: { width: 62, height: 62, borderRadius: 31 },
});
