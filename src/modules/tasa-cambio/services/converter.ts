import type { Direction } from '../types';

export type Key = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | ',' | 'del' | 'clear';

const MAX_INT_DIGITS = 9;
const MAX_DECIMALS = 2;

/** Aplica una tecla al texto actual del teclado numérico. */
export function applyKey(current: string, key: Key): string {
  if (key === 'clear') return '';
  if (key === 'del') return current.slice(0, -1);
  if (key === ',') {
    if (current.includes(',')) return current;
    return current === '' ? '0,' : `${current},`;
  }
  const [intPart, decPart] = current.split(',');
  if (decPart !== undefined) {
    return decPart.length >= MAX_DECIMALS ? current : current + key;
  }
  if (intPart.length >= MAX_INT_DIGITS) return current;
  if (intPart === '0') return key === '0' ? current : key;
  return current + key;
}

/** Texto del teclado ("1250,5") -> número. */
export function amountFromText(text: string): number {
  if (text === '') return 0;
  const n = Number(text.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function convert(amount: number, cupPerUnit: number, direction: Direction): number {
  return direction === 'toCup' ? amount * cupPerUnit : amount / cupPerUnit;
}

export function isValidRate(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value) && value > 0 && value <= 1_000_000;
}

/** Atajos de cantidad: en CUP las cifras son mayores que en divisa. */
export const QUICK_AMOUNTS: Record<Direction, number[]> = {
  toCup: [5, 10, 20, 50, 100, 500],
  fromCup: [500, 1000, 2000, 5000, 10000, 25000],
};
