export const FOREIGN_CURRENCIES = ['USD', 'EUR'] as const;
export type ForeignCurrency = (typeof FOREIGN_CURRENCIES)[number];

/** 'toCup': divisa → CUP · 'fromCup': CUP → divisa. */
export type Direction = 'toCup' | 'fromCup';

export type Rate = {
  currency: ForeignCurrency;
  /** CUP por 1 unidad de la divisa; null si el usuario aún no la ha definido. */
  cupPerUnit: number | null;
  /** ISO 8601 de la última edición; null si nunca se ha definido. */
  updatedAt: string | null;
};

export const CURRENCY_LABEL: Record<ForeignCurrency, string> = {
  USD: 'Dólar',
  EUR: 'Euro',
};
