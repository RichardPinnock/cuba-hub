export const CURRENCIES = ['USD', 'EUR', 'CUP'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_NAME: Record<Currency, string> = {
  USD: 'Dólar',
  EUR: 'Euro',
  CUP: 'Peso cubano',
};

/** Denominaciones de billetes por moneda, de menor a mayor. */
export const DENOMINATIONS: Record<Currency, number[]> = {
  USD: [1, 5, 10, 20, 50, 100],
  EUR: [5, 10, 20, 50, 100, 200, 500],
  CUP: [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000],
};

/** Cantidades por denominación. Clave: "USD:100". */
export type Counts = Record<string, number>;

export const countKey = (currency: Currency, denomination: number) => `${currency}:${denomination}`;

export const MAX_QTY = 99_999;
