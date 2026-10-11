const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DAYS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const pad = (n: number) => String(n).padStart(2, '0');

/** "Domingo, 11 de octubre" */
export function formatLongDate(date: Date): string {
  return `${capitalize(DAYS[date.getDay()])}, ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

/** "dom 11 oct" */
export function formatShortDate(date: Date): string {
  return `${DAYS_SHORT[date.getDay()]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

/** Saludo según la hora local. */
export function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

/** Fecha local -> "YYYY-MM-DD" (sin desfases de zona horaria). */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "YYYY-MM-DD" -> Date local a medianoche. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addDaysISO(iso: string, days: number): string {
  return toISODate(addDays(parseISODate(iso), days));
}

/** "HH:mm" -> "h:mm a. m./p. m." en 12 horas. */
export function formatTime12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'p. m.' : 'a. m.';
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${suffix}`;
}

export function timeFromDate(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Etiqueta amigable de un día: Hoy, Mañana, Ayer o "lun 12 oct". */
export function dayLabel(iso: string, todayISO: string): string {
  if (iso === todayISO) return 'Hoy';
  if (iso === addDaysISO(todayISO, 1)) return 'Mañana';
  if (iso === addDaysISO(todayISO, -1)) return 'Ayer';
  return capitalize(formatShortDate(parseISODate(iso)));
}

/** "hace 3 días", "hace 2 h", "hace un momento". */
export function formatRelative(from: Date, now: Date = new Date()): string {
  const diff = Math.max(0, now.getTime() - from.getTime());
  const min = Math.floor(diff / 60_000);
  if (min < 1) return 'hace un momento';
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'hace 1 día' : `hace ${d} días`;
}
