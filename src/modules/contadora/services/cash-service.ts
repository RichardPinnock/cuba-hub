import { emitDataChanged } from '@/core/events';

import { clearCurrency, getCounts, getPref, saveQty, setPref } from '../data/cash-repo';
import type { Currency } from '../types';
import { clampQty } from './money';

export const CONTADORA_MODULE_ID = 'contadora';

const HIDE_EMPTY_KEY = 'hide_empty';

export { getCounts };

export async function setQty(currency: Currency, denomination: number, qty: number): Promise<void> {
  await saveQty(currency, denomination, clampQty(qty));
  emitDataChanged(CONTADORA_MODULE_ID);
}

export async function resetCurrency(currency: Currency): Promise<void> {
  await clearCurrency(currency);
  emitDataChanged(CONTADORA_MODULE_ID);
}

export async function loadHideEmpty(): Promise<boolean> {
  return (await getPref(HIDE_EMPTY_KEY)) === '1';
}

export async function storeHideEmpty(value: boolean): Promise<void> {
  await setPref(HIDE_EMPTY_KEY, value ? '1' : '0');
}
