import { getDatabase } from '@/core/db/client';

import { FOREIGN_CURRENCIES, type ForeignCurrency, type Rate } from '../types';

type Row = { currency: string; cup_per_unit: number | null; updated_at: string | null };

export async function getRates(): Promise<Rate[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Row>('SELECT currency, cup_per_unit, updated_at FROM rates');
  return FOREIGN_CURRENCIES.map((currency) => {
    const row = rows.find((r) => r.currency === currency);
    return { currency, cupPerUnit: row?.cup_per_unit ?? null, updatedAt: row?.updated_at ?? null };
  });
}

export async function upsertRate(currency: ForeignCurrency, cupPerUnit: number, updatedAt: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO rates (currency, cup_per_unit, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(currency) DO UPDATE SET cup_per_unit = excluded.cup_per_unit, updated_at = excluded.updated_at`,
    currency,
    cupPerUnit,
    updatedAt
  );
}
