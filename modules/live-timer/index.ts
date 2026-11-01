// The lock-screen workout and the phone settings behind on-time reminders
// (Android only; see android/…/LiveWorkout.kt and LiveTimerModule.kt). Every
// call is a no-op on the web preview and on builds without the module.

import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo';
import type { Effort } from '@/types';

/** A set still to do, as the lock screen shows it. */
export interface LiveItem {
  /** "exerciseId#n": the n-th set of that exercise in the session (lib/liveEvents.ts). */
  key: string;
  name: string;
  /** "Set 2/3" */
  set: string;
  /** "30 kg × 10" */
  detail: string;
  restSec: number;
}

export type LivePhase = 'ready' | 'working' | 'resting' | 'finished';

export interface LiveLabels {
  start: string;
  logSet: string;
  done: string;
  easy: string;
  good: string;
  hard: string;
  working: string;
  rest: string;
  next: string;
  restOver: string;
  allDone: string;
  saveHint: string;
  /** "{{day}} · {{done}}/{{total}} sets" */
  progress: string;
}

export interface LiveState {
  dayId: string;
  day: string;
  done: number;
  total: number;
  phase: LivePhase;
  /** Next set first. */
  items: LiveItem[];
  setStartedAt?: number;
  restEndsAt?: number;
  /** The set waiting for Easy / Good / Hard. */
  ratingKey?: string;
  /** Start → Done (timed); off: one "Log set" button. */
  timeSets: boolean;
  /** Buzz when a rest ends. */
  buzz: boolean;
  channel: string;
  alertChannel: string;
  /** Android colour int (see `argb`). */
  color: number;
  labels: LiveLabels;
}

/** A lock-screen button press, waiting for the app to apply it. */
export interface LiveEvent {
  type: 'start' | 'done' | 'effort';
  key: string;
  at: number;
  startedAt?: number;
  effort?: Effort;
}

interface Subscription {
  remove(): void;
}

interface LiveTimerNative {
  update(json: string): boolean;
  stop(): void;
  drain(): string;
  peek(): string | null;
  addListener(event: 'onLiveEvent', listener: () => void): Subscription;
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
export function argb(hex: string): number {
  return (0xff000000 | parseInt(hex.replace('#', ''), 16)) | 0;
}

/** Shows or refreshes the lock-screen workout. False while unread button presses wait (drain first). */
export function updateLive(state: LiveState): boolean {
  return native?.update(JSON.stringify(state)) ?? false;
}

export function stopLive() {
  native?.stop();
}

/** Button presses since the last call, oldest first. */
export function drainLive(): LiveEvent[] {
  try {
    return native ? (JSON.parse(native.drain()) as LiveEvent[]) : [];
  } catch {
    return [];
  }
}

/** The lock-screen workout as last left (also after the app was closed), or null. */
export function peekLive(): LiveState | null {
  try {
    const json = native?.peek();
    return json ? (JSON.parse(json) as LiveState) : null;
  } catch {
    return null;
  }
}

/** Called when a button is pressed while the app runs. Returns the unsubscribe. */
export function onLiveEvent(listener: () => void): () => void {
  const sub = native?.addListener('onLiveEvent', listener);
  return () => sub?.remove();
}

export const canScheduleExactAlarms = () => native?.canScheduleExactAlarms() ?? true;
export const openExactAlarmSettings = () => native?.openExactAlarmSettings() ?? false;
export const isIgnoringBatteryOptimizations = () => native?.isIgnoringBatteryOptimizations() ?? true;
export const openBatterySettings = () => native?.openBatterySettings() ?? false;
export const openNotificationSettings = () => native?.openNotificationSettings() ?? false;
export const openAppSettings = () => native?.openAppSettings() ?? false;
