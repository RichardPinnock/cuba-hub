import { getDatabase } from './client';

/** Preferencias sencillas clave/valor de la app (tabla `_prefs`, creada en bootstrap). */
export async function getPref(key: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM _prefs WHERE key = ?', key);
  return row?.value ?? null;
}

export async function setPref(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO _prefs (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    value
  );
}
