import * as SQLite from 'expo-sqlite';

export const DB_NAME = 'cubahub.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Conexión única a SQLite (compartida con los widgets, que usan el mismo archivo). */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME).then(async (db) => {
      await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
      return db;
    });
  }
  return dbPromise;
}
