// Google sign-in → Firebase Auth (free). On Android this needs the native
// Google Sign-In module, so it only works in a development/production build,
// not in Expo Go. The web preview uses Firebase's popup flow instead.

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithCredential,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/utils/firebaseConfig';
import { isExpoGo } from '@/lib/runtime';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

type GoogleSigninModule = typeof import('@react-native-google-signin/google-signin');

let googleModule: GoogleSigninModule | null | undefined;

/** Loads the native module lazily so Expo Go doesn't crash on import. */
function loadGoogleSignin(): GoogleSigninModule | null {
  if (googleModule !== undefined) return googleModule;
  if (isExpoGo) return (googleModule = null); // not in Expo Go; requiring it would be a fatal error
  try {
    googleModule = require('@react-native-google-signin/google-signin') as GoogleSigninModule;
    googleModule.GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });
  } catch {
    googleModule = null;
  }
  return googleModule;
}

export type SignInAvailability = 'ready' | 'needs_build' | 'needs_client_id';

export function googleSignInAvailability(): SignInAvailability {
  if (Platform.OS === 'web') return 'ready';
  if (!loadGoogleSignin()) return 'needs_build';
  if (!WEB_CLIENT_ID) return 'needs_client_id';
  return 'ready';
}

export async function signInWithGoogle(): Promise<User | null> {
  if (Platform.OS === 'web') {
    const result = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
    return result.user;
  }
  const mod = loadGoogleSignin();
  if (!mod) throw new Error('needs_build');
  if (!WEB_CLIENT_ID) throw new Error('needs_client_id');

  await mod.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await mod.GoogleSignin.signIn();
  if (!mod.isSuccessResponse(response)) return null; // user cancelled
  const idToken = response.data.idToken;
  if (!idToken) throw new Error('No ID token returned by Google');
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(getFirebaseAuth(), credential);
  return result.user;
}

export async function signOut(): Promise<void> {
  if (Platform.OS !== 'web') {
    try {
      await loadGoogleSignin()?.GoogleSignin.signOut();
    } catch {
      // Ignore — Firebase sign-out below is what matters.
    }
  }
  await firebaseSignOut(getFirebaseAuth());
}

export function useAuthUser(): User | null {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return getFirebaseAuth().currentUser;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    try {
      return onAuthStateChanged(getFirebaseAuth(), setUser);
    } catch {
      return undefined; // Firebase unavailable: stay signed out.
    }
  }, []);
  return user;
}
