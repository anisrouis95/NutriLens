import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * True inside the Expo Go app. Expo Go lacks third-party native modules
 * (Google Sign-In, Health Connect), and in development merely `require`-ing
 * one reports a fatal error before any try/catch can handle it, so callers
 * must not load those modules at all here.
 */
export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
