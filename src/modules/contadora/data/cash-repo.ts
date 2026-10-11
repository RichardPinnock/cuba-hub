import { getDatabase } from '@/core/db/client';

import { countKey, type Counts, type Currency } from '../types';

export async function getCounts(): Promise<Counts> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ currency: Currency; denomination: number; qty: number }>(
    'SELECT currency, denomination, qty FROM cash_counts WHERE qty > 0'
  );
  const counts: Counts = {};
  for (const r of rows) counts[countKey(r.currency, r.denomination)] = r.qty;
  return counts;
}

export async function saveQty(currency: Currency, denomination: number, qty: number): Promise<void> {
  const db = await getDatabase();
  if (qty <= 0) {
    await db.runAsync('DELETE FROM cash_counts WHERE currency = ? AND denomination = ?', currency, denomination);
    return;
  }
  await db.runAsync(
    `INSERT INTO cash_counts (currency, denomination, qty) VALUES (?, ?, ?)
     ON CONFLICT(currency, denomination) DO UPDATE SET qty = excluded.qty`,
    currency,
    denomination,
    qty
  );
}

export async function clearCurrency(currency: Currency): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM cash_counts WHERE currency = ?', currency);
}

export async function getPref(key: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM cash_prefs WHERE key = ?', key);
  return row?.value ?? null;
}

export async function setPref(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO cash_prefs (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    value
  );
}
