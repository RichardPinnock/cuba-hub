import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';

import { parseDecimal } from '@/core/i18n/numbers';

import { isValidRate } from '../services/converter';
import { saveRate } from '../services/rates-service';
import { FOREIGN_CURRENCIES, type ForeignCurrency, type Rate } from '../types';

type Values = Record<ForeignCurrency, string>;
const EMPTY: Values = { USD: '', EUR: '' };

/** Edición de las tasas. `onSaved` se llama tras guardar con éxito (cerrar pantalla o diálogo). */
export function useRateEditor(rates: Rate[], onSaved: () => void) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<ForeignCurrency, string>>>({});
  const [saving, setSaving] = useState(false);
  const initialized = useRef(false);

  // Rellena una sola vez con las tasas guardadas.
  useEffect(() => {
    if (initialized.current || rates.length === 0) return;
    initialized.current = true;
    const next = { ...EMPTY };
    for (const r of rates) next[r.currency] = r.cupPerUnit === null ? '' : String(r.cupPerUnit).replace('.', ',');
    setValues(next);
  }, [rates]);

  const setValue = (currency: ForeignCurrency, text: string) => {
    setValues((v) => ({ ...v, [currency]: text }));
    setErrors((e) => ({ ...e, [currency]: undefined }));
  };

  const save = async () => {
    const nextErrors: Partial<Record<ForeignCurrency, string>> = {};
    const toSave: [ForeignCurrency, number][] = [];
    for (const currency of FOREIGN_CURRENCIES) {
      const text = values[currency].trim();
      const current = rates.find((r) => r.currency === currency)?.cupPerUnit ?? null;
      if (text === '') {
        if (current !== null) nextErrors[currency] = 'Escribe la tasa o déjala como estaba.';
        continue;
      }
      const n = parseDecimal(text);
      if (!isValidRate(n)) {
        nextErrors[currency] = 'Escribe un número mayor que 0.';
      } else if (n !== current) {
        toSave.push([currency, n]);
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      return;
    }
    setSaving(true);
    try {
      for (const [currency, n] of toSave) await saveRate(currency, n);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      onSaved();
    } catch {
      setErrors({ USD: 'No se pudo guardar. Inténtalo otra vez.' });
    } finally {
      setSaving(false);
    }
  };

  return { values, errors, saving, setValue, save };
}
