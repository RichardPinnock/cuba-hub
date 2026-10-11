import type { ImageSourcePropType } from 'react-native';

import type { Currency } from '../types';

/**
 * Imágenes de billetes: assets/bills/<moneda>/<valor>.<png|jpg|webp>
 * (p. ej. assets/bills/usd/100.png). Se detectan solas; si falta alguna, la app dibuja un billete genérico.
 */
type RequireContext = {
  keys(): string[];
  (id: string): ImageSourcePropType;
};
declare const require: { context(path: string, deep: boolean, filter: RegExp): RequireContext };

const context = require.context('../../../../assets/bills', true, /\.(png|jpe?g|webp)$/i);

const IMAGES = new Map<string, ImageSourcePropType>();
for (const key of context.keys()) {
  // key: "./usd/100.png"
  const match = /^\.\/([^/]+)\/(\d+)\.[a-z]+$/i.exec(key);
  if (match) IMAGES.set(`${match[1].toLowerCase()}/${match[2]}`, context(key));
}

export function getBillImage(currency: Currency, denomination: number): ImageSourcePropType | null {
  return IMAGES.get(`${currency.toLowerCase()}/${denomination}`) ?? null;
}
