import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, Image as ImageIcon, X, Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import FoodSearchBar from '@/components/track/FoodSearchBar';
import FoodRecognitionResults from '@/components/track/FoodRecognitionResults';
import { recognizeFood } from '@/services/foodRecognitionService';

export default function TrackScreen() {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const [recognizedFoods, setRecognizedFoods] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  const cameraRef = useRef<any>(null);

  const activateCamera = async () => {
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        return;
      }
    }
    setCameraActive(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo);
        setCameraActive(false);
        analyzeImage(photo);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const analyzeImage = async (photo: any) => {
    try {
      setIsAnalyzing(true);
      // In a real app, this would call a cloud vision API
      const results = await recognizeFood(photo.uri);
      setRecognizedFoods(results);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const cancelCapture = () => {
    setCapturedImage(null);
    setRecognizedFoods([]);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: 100 },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {t('trackMeal')}
          </Text>

          <FoodSearchBar />

          {capturedImage ? (
            <View
              style={[
                styles.previewContainer,
                { borderColor: colors.borderColor },
              ]}
            >
              <Image
                source={{ uri: capturedImage.uri }}
                style={styles.preview}
              />

              <View style={styles.previewActions}>
                <TouchableOpacity
                  style={[
                    styles.previewButton,
                    { backgroundColor: colors.errorColor },
                  ]}
                  onPress={cancelCapture}
                >
                  <X color="#FFFFFF" size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.previewButton,
                    { backgroundColor: colors.successColor },
                  ]}
                  onPress={() => {}}
                >
                  <Check color="#FFFFFF" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.cameraButton,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.borderColor,
                },
              ]}
              onPress={activateCamera}
            >
              <ImageIcon size={40} color={colors.primaryColor} />
              <Text style={[styles.cameraButtonText, { color: colors.text }]}>
                {t('takePhoto')}
              </Text>
            </TouchableOpacity>
          )}

          {isAnalyzing && (
            <Text
              style={[styles.analyzingText, { color: colors.secondaryColor }]}
            >
              {t('analyzing')}
            </Text>
          )}

          {recognizedFoods.length > 0 && (
            <FoodRecognitionResults foods={recognizedFoods} />
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Full-screen Camera Modal */}
      <Modal
        visible={cameraActive}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
            <SafeAreaView style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCameraActive(false)}
              >
                <X color="#FFFFFF" size={24} />
              </TouchableOpacity>

              <View style={styles.cameraButtons}>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={toggleCameraFacing}
                >
                  <Camera color="#FFFFFF" size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </CameraView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  cameraButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 16,
  },
  cameraButtonText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  closeButton: {
    margin: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 32,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  previewContainer: {
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  preview: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  previewButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});
