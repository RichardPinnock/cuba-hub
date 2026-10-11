import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useState } from 'react';

import { amountFromText, applyKey, convert, isValidRate, type Key } from '../services/converter';
import type { Direction, ForeignCurrency, Rate } from '../types';

export function useConverter(rates: Rate[]) {
  const [currency, setCurrency] = useState<ForeignCurrency>('USD');
  const [direction, setDirection] = useState<Direction>('toCup');
  const [text, setText] = useState('');

  const rate = rates.find((r) => r.currency === currency) ?? null;
  const cupPerUnit = rate?.cupPerUnit ?? null;
  const amount = amountFromText(text);
  const hasRate = isValidRate(cupPerUnit);

  const result = useMemo(
    () => (isValidRate(cupPerUnit) ? convert(amount, cupPerUnit, direction) : null),
    [amount, direction, cupPerUnit]
  );

  const press = useCallback((key: Key) => {
    Haptics.selectionAsync().catch(() => {});
    setText((t) => applyKey(t, key));
  }, []);

  const setQuick = useCallback((value: number) => {
    Haptics.selectionAsync().catch(() => {});
    setText(String(value));
  }, []);

  const swap = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setDirection((d) => (d === 'toCup' ? 'fromCup' : 'toCup'));
    setText('');
  }, []);

  return { currency, setCurrency, direction, swap, text, press, setQuick, amount, rate, hasRate, result };
}
