// The workout's lock-screen notification and the phone settings behind
// on-time reminders (Android only; see android/…/LiveTimerModule.kt). Every
// call is a no-op on the web preview and on builds without the module.

import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo';

interface LiveTimerNative {
  showRest(endAtMs: number, title: string, body: string, channelId: string, color: number): void;
  showSession(title: string, body: string, channelId: string, color: number): void;
  clear(): void;
  canScheduleExactAlarms(): boolean;
  openExactAlarmSettings(): boolean;
  isIgnoringBatteryOptimizations(): boolean;
  openBatterySettings(): boolean;
  openNotificationSettings(): boolean;
  openAppSettings(): boolean;
}

const native = Platform.OS === 'android' ? requireOptionalNativeModule<LiveTimerNative>('LiveTimer') : null;

/** True when the native module is in this build (not the web preview, not Expo Go). */
export const liveTimerAvailable = !!native;

/** "#D9FF3D" → the signed 32-bit ARGB int Android expects. */
function argb(hex: string): number {
  return (0xff000000 | parseInt(hex.replace('#', ''), 16)) | 0;
}

export function showRest(endAt: number, title: string, body: string, channelId: string, color: string) {
  native?.showRest(endAt, title, body, channelId, argb(color));
}

export function showSession(title: string, body: string, channelId: string, color: string) {
  native?.showSession(title, body, channelId, argb(color));
}

export function clearLive() {
  native?.clear();
}

export const canScheduleExactAlarms = () => native?.canScheduleExactAlarms() ?? true;
export const openExactAlarmSettings = () => native?.openExactAlarmSettings() ?? false;
export const isIgnoringBatteryOptimizations = () => native?.isIgnoringBatteryOptimizations() ?? true;
export const openBatterySettings = () => native?.openBatterySettings() ?? false;
export const openNotificationSettings = () => native?.openNotificationSettings() ?? false;
export const openAppSettings = () => native?.openAppSettings() ?? false;
