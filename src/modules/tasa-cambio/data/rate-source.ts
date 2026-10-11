import type { ForeignCurrency } from '../types';

/**
 * Punto de extensión para obtener tasas de una fuente externa.
 * Hoy solo existe la fuente manual (el usuario edita sus tasas); cuando haya una fuente fiable,
 * implementa esta interfaz y pásala a `refreshFromSource`.
 */
export interface RateSource {
  id: string;
  name: string;
  /** CUP por unidad de cada divisa que la fuente sepa resolver. */
  fetchRates(): Promise<Partial<Record<ForeignCurrency, number>>>;
}

/** Fuente por defecto: no consulta nada, las tasas son las que escribió el usuario. */
export const manualSource: RateSource = {
  id: 'manual',
  name: 'Manual',
  fetchRates: async () => ({}),
};
