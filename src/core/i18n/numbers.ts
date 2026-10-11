/** Formato español: espacio fino para miles y coma decimal. No depende de Intl (Hermes). */
export function formatNumber(value: number, maxDecimals = 2): string {
  if (!Number.isFinite(value)) return '0';
  const fixed = value.toFixed(maxDecimals);
  const [intPart, decPart] = fixed.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const dec = decPart?.replace(/0+$/, '');
  return dec ? `${grouped},${dec}` : grouped;
}

/** Texto escrito por el usuario ("1250,5" o "1250.5") -> número, o null si no es válido. */
export function parseDecimal(text: string): number | null {
  const normalized = text.trim().replace(/\s/g, '').replace(',', '.');
  if (normalized === '' || !/^\d*\.?\d*$/.test(normalized)) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
