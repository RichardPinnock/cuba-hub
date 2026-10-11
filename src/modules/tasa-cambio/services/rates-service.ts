import { emitDataChanged } from '@/core/events';

import type { RateSource } from '../data/rate-source';
import { getRates, upsertRate } from '../data/rates-repo';
import type { ForeignCurrency } from '../types';
import { isValidRate } from './converter';

export const TASA_MODULE_ID = 'tasa-cambio';

/** Guarda la tasa editada por el usuario. Lanza si el valor no es válido. */
export async function saveRate(currency: ForeignCurrency, cupPerUnit: number | null): Promise<void> {
  if (!isValidRate(cupPerUnit)) throw new Error('Escribe una tasa mayor que 0.');
  await upsertRate(currency, cupPerUnit, new Date().toISOString());
  emitDataChanged(TASA_MODULE_ID);
}

/** Actualiza las tasas desde una fuente externa (aún no hay ninguna fiable conectada). */
export async function refreshFromSource(source: RateSource): Promise<number> {
  const fetched = await source.fetchRates();
  let updated = 0;
  for (const [currency, value] of Object.entries(fetched) as [ForeignCurrency, number][]) {
    if (isValidRate(value)) {
      await upsertRate(currency, value, new Date().toISOString());
      updated += 1;
    }
  }
  if (updated > 0) emitDataChanged(TASA_MODULE_ID);
  return updated;
}

export { getRates };
