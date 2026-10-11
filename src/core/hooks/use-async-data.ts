import { useCallback, useEffect, useRef, useState } from 'react';

import { onDataChanged } from '@/core/events';

type State<T> = { data: T | null; loading: boolean; error: Error | null };

/** Carga datos de un módulo y los recarga cuando el módulo emite un cambio. */
export function useModuleData<T>(moduleId: string, load: () => Promise<T>) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const loadRef = useRef(load);
  loadRef.current = load;

  const reload = useCallback(async () => {
    try {
      const data = await loadRef.current();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState((s) => ({ data: s.data, loading: false, error: e instanceof Error ? e : new Error(String(e)) }));
    }
  }, []);

  useEffect(() => {
    reload();
    return onDataChanged((id) => {
      if (id === moduleId) reload();
    });
  }, [moduleId, reload]);

  return { ...state, reload };
}
