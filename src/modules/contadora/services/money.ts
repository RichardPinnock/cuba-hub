import { countKey, type Counts, type Currency, DENOMINATIONS, MAX_QTY } from '../types';

export function totalFor(currency: Currency, counts: Counts): number {
  return DENOMINATIONS[currency].reduce((sum, d) => sum + d * (counts[countKey(currency, d)] ?? 0), 0);
}

export function piecesFor(currency: Currency, counts: Counts): number {
  return DENOMINATIONS[currency].reduce((sum, d) => sum + (counts[countKey(currency, d)] ?? 0), 0);
}

/** Cantidad válida: entero entre 0 y MAX_QTY; cualquier otra cosa cuenta como 0. */
export function clampQty(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_QTY, Math.max(0, Math.trunc(value)));
}

/** Denominaciones con cantidad > 0. */
export function filledDenominations(currency: Currency, counts: Counts): number[] {
  return DENOMINATIONS[currency].filter((d) => (counts[countKey(currency, d)] ?? 0) > 0);
}

export type RateMap = Partial<Record<Currency, number | null>>;

/** Convierte entre monedas usando CUP por unidad de cada una (CUP = 1). Null si falta alguna tasa. */
export function convertAmount(amount: number, from: Currency, to: Currency, cupPer: RateMap): number | null {
  const fromRate = from === 'CUP' ? 1 : cupPer[from];
  const toRate = to === 'CUP' ? 1 : cupPer[to];
  if (!fromRate || !toRate) return null;
  return (amount * fromRate) / toRate;
}
