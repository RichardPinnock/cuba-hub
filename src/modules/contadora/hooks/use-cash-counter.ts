import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { clampQty, filledDenominations, piecesFor, totalFor } from '../services/money';
import { getCounts, loadHideEmpty, resetCurrency, setQty, storeHideEmpty } from '../services/cash-service';
import { countKey, type Counts, type Currency, DENOMINATIONS } from '../types';

/**
 * Estado de la contadora para una moneda. Los cambios se ven al instante (estado local)
 * y se guardan en SQLite en segundo plano.
 */
export function useCashCounter(currency: Currency) {
  const [counts, setCounts] = useState<Counts>({});
  const [hideEmpty, setHideEmptyState] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pinned, setPinned] = useState<Set<number>>(new Set());
  const countsRef = useRef(counts);
  countsRef.current = counts;

  useEffect(() => {
    Promise.all([getCounts(), loadHideEmpty()])
      .then(([c, h]) => {
        setCounts(c);
        setHideEmptyState(h);
      })
      .catch(() => setError('No se pudieron leer tus cantidades guardadas.'))
      .finally(() => setReady(true));
  }, []);

  // Al ocultar vacías (o cambiar de moneda) se fija qué filas se muestran: así una fila no desaparece
  // en el momento en que bajas su cantidad a 0, sino la próxima vez que abras la vista.
  useEffect(() => {
    if (ready) setPinned(new Set(filledDenominations(currency, countsRef.current)));
  }, [currency, hideEmpty, ready]);

  const persist = useCallback((cur: Currency, denomination: number, qty: number) => {
    setQty(cur, denomination, qty)
      .then(() => setError(null))
      .catch(() => setError('No se pudo guardar el último cambio.'));
  }, []);

  const setQuantity = useCallback(
    (denomination: number, value: number) => {
      const qty = clampQty(value);
      setCounts((c) => ({ ...c, [countKey(currency, denomination)]: qty }));
      persist(currency, denomination, qty);
    },
    [currency, persist]
  );

  const change = useCallback(
    (denomination: number, delta: number) => {
      Haptics.selectionAsync().catch(() => {});
      setQuantity(denomination, (countsRef.current[countKey(currency, denomination)] ?? 0) + delta);
    },
    [currency, setQuantity]
  );

  const setHideEmpty = useCallback((value: boolean) => {
    setHideEmptyState(value);
    storeHideEmpty(value).catch(() => {});
  }, []);

  const clear = useCallback(async () => {
    setCounts((c) => {
      const next = { ...c };
      for (const d of DENOMINATIONS[currency]) delete next[countKey(currency, d)];
      return next;
    });
    setPinned(new Set());
    try {
      await resetCurrency(currency);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch {
      setError('No se pudo limpiar.');
    }
  }, [currency]);

  const denominations = useMemo(
    () => (hideEmpty ? DENOMINATIONS[currency].filter((d) => pinned.has(d)) : DENOMINATIONS[currency]),
    [currency, hideEmpty, pinned]
  );

  return {
    ready,
    error,
    counts,
    denominations,
    hideEmpty,
    setHideEmpty,
    setQuantity,
    change,
    clear,
    total: totalFor(currency, counts),
    pieces: piecesFor(currency, counts),
  };
}
