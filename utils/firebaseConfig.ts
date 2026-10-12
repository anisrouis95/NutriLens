// Firebase (free Spark plan): Google sign-in + Firestore backup.
// Analytics is intentionally not used — the JS SDK's analytics only works in
// browsers and crashes on Android.

import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Web config values are public identifiers (security comes from Firestore
// rules + Auth), so they can live in the repo.
const firebaseConfig = {
  apiKey: 'AIzaSyAm8LfjQPj4fpoFkiakYBmxU1U_eOpv1HE',
  authDomain: 'nutrilens-5b5ba.firebaseapp.com',
  projectId: 'nutrilens-5b5ba',
  storageBucket: 'nutrilens-5b5ba.firebasestorage.app',
  messagingSenderId: '182754163246',
  appId: '1:182754163246:web:39a8278c0bbecae58a7dbf',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function createAuth(): Auth {
  if (Platform.OS === 'web') return getAuth(app);
  // getReactNativePersistence only exists in the React Native build of
  // @firebase/auth, which Metro picks via the "react-native" export condition.
  const { getReactNativePersistence } = require('@firebase/auth') as {
    getReactNativePersistence: (storage: typeof AsyncStorage) => never;
  };
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Already initialised (fast refresh).
    return getAuth(app);
  }
}

// Created on first use (sign-in, backup), not at import: a Firebase problem
// then surfaces as a failed action instead of breaking the screens that
// import this module.
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

export function getFirebaseAuth(): Auth {
  return (authInstance ??= createAuth());
}

export function getDb(): Firestore {
  return (dbInstance ??= getFirestore(app));
}

export { app };
