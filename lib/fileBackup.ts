// Backup files in a folder the user picks once (Android storage access). The
// folder lives outside the app, so the files survive an uninstall; app
// updates keep the folder permission. Layout in that folder:
//   TounsiFit-backup.json             always the latest copy
//   TounsiFit-backup-YYYY-MM-DD.json  one per day (updated through the day), the newest 7 kept

import { Platform } from 'react-native';
import { Directory, File } from 'expo-file-system';
import type { AppDataSnapshot } from '@/contexts/AppDataContext';

const LATEST = 'TounsiFit-backup.json';
/** The app was called NutriLens before 1.1; its old latest copy is removed so one file is obviously the newest. */
const LEGACY_LATEST = 'NutriLens-backup.json';
const DAILY = /^(?:TounsiFit|NutriLens)-backup-(\d{4}-\d{2}-\d{2})\.json$/;
const dayOf = (f: File) => DAILY.exec(displayName(f.uri))?.[1] ?? '';
const KEEP_DAILY = 7;

export const fileBackupSupported = Platform.OS === 'android';

/**
 * Readable name from a storage-access URI. Those URIs end in an encoded
 * document id such as "primary%3ADocuments%2FTounsiFit-backup.json", so the
 * plain basename isn't the file's name.
 */
export function displayName(uri: string) {
  let decoded = uri.replace(/\/+$/, '');
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // keep the raw string
  }
  const tail = decoded.split('/').pop() ?? '';
  return tail.split(':').pop() || tail;
}

/** Opens the system folder picker; the app keeps write access to the chosen folder. */
export async function pickBackupFolder(): Promise<{ uri: string; name: string } | null> {
  try {
    const dir = await Directory.pickDirectoryAsync();
    return dir?.uri ? { uri: dir.uri, name: displayName(dir.uri) || 'Tounsi Fit' } : null;
  } catch {
    return null; // cancelled
  }
}

/**
 * Replaces a file with fresh content. The old file is deleted rather than
 * overwritten: on Android 10+ the storage provider's "w" mode doesn't always
 * truncate, so a shorter backup would keep the old tail and break the JSON.
 * (Deleting also stops createFile from making "name (1).json".)
 */
function writeNamed(dir: Directory, name: string, json: string) {
  for (const f of dir.list()) {
    if (f instanceof File && displayName(f.uri) === name) f.delete();
  }
  dir.createFile(name, 'application/json').write(json);
}

/** Writes today's copy, then the latest copy, then prunes old daily copies. */
export function writeBackup(dirUri: string, snapshot: AppDataSnapshot, today: string) {
  const dir = new Directory(dirUri);
  const json = JSON.stringify(snapshot);
  // Today's copy first: if writing the latest copy fails halfway, a whole one already exists.
  writeNamed(dir, `TounsiFit-backup-${today}.json`, json);
  writeNamed(dir, LATEST, json);
  const files = dir.list().filter((f): f is File => f instanceof File);
  const daily = files.filter((f) => DAILY.test(displayName(f.uri))).sort((a, b) => dayOf(b).localeCompare(dayOf(a)));
  const legacy = files.filter((f) => displayName(f.uri) === LEGACY_LATEST);
  for (const old of [...daily.slice(KEEP_DAILY), ...legacy]) {
    try {
      old.delete();
    } catch {
      // A file another app holds open is skipped; the next backup retries.
    }
  }
}

/** Checks that a parsed file is a Tounsi Fit backup; returns it typed, or null. */
export function asSnapshot(data: unknown): AppDataSnapshot | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Partial<AppDataSnapshot>;
  if ((d.version !== 1 && d.version !== 2) || typeof d.exportedAt !== 'string') return null;
  if (!Array.isArray(d.foods) || !Array.isArray(d.sessions) || !Array.isArray(d.weights)) return null;
  if (d.cardio !== undefined && !Array.isArray(d.cardio)) return null;
  return d as AppDataSnapshot;
}

/** Opens the system file picker and reads a backup. Throws "invalid" for a file that isn't one. */
export async function pickBackupFile(): Promise<AppDataSnapshot | null> {
  const picked = await File.pickFileAsync({ mimeTypes: ['application/json', 'text/plain', '*/*'] });
  if (picked.canceled || !picked.result) return null;
  const text = await picked.result.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('invalid');
  }
  const snap = asSnapshot(parsed);
  if (!snap) throw new Error('invalid');
  return snap;
}
