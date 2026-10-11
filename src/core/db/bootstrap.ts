import type { SQLiteDatabase } from 'expo-sqlite';

import { MODULES } from '@/modules/registry';

import { getDatabase } from './client';

/** Aplica las migraciones pendientes de cada módulo (versionadas por módulo). */
async function migrate(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS _migrations (module TEXT NOT NULL, version INTEGER NOT NULL, PRIMARY KEY (module, version))'
  );
  await db.execAsync('CREATE TABLE IF NOT EXISTS _prefs (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)');
  for (const mod of MODULES) {
    const rows = await db.getAllAsync<{ version: number }>(
      'SELECT version FROM _migrations WHERE module = ?',
      mod.id
    );
    const applied = new Set(rows.map((r) => r.version));
    const pending = [...mod.migrations].sort((a, b) => a.version - b.version).filter((m) => !applied.has(m.version));
    for (const m of pending) {
      await db.withTransactionAsync(async () => {
        await db.execAsync(m.sql);
        await db.runAsync('INSERT INTO _migrations (module, version) VALUES (?, ?)', mod.id, m.version);
      });
    }
  }
}

let initPromise: Promise<void> | null = null;

/** Abre la base de datos y migra. Idempotente: llamar al arrancar la app. */
export function initDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = getDatabase().then(migrate);
  }
  return initPromise;
}
