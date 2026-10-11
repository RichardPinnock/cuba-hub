import { useCallback, useEffect, useState } from 'react';

import { getPref, setPref } from '@/core/db/prefs';

const KEY = 'home.day';

type DayPrefs = { collapsed: boolean; hidden: string[] };
const DEFAULTS: DayPrefs = { collapsed: false, hidden: [] };

/** Estado de la sección "Tu día": plegada o no, y qué módulos están ocultos. Se guarda en SQLite. */
export function useDayPrefs() {
  const [prefs, setPrefs] = useState<DayPrefs>(DEFAULTS);

  useEffect(() => {
    getPref(KEY)
      .then((raw) => {
        if (!raw) return;
        const parsed = JSON.parse(raw) as Partial<DayPrefs>;
        setPrefs({
          collapsed: parsed.collapsed === true,
          hidden: Array.isArray(parsed.hidden) ? parsed.hidden.filter((h) => typeof h === 'string') : [],
        });
      })
      .catch(() => {});
  }, []);

  const update = useCallback((patch: (p: DayPrefs) => DayPrefs) => {
    setPrefs((current) => {
      const next = patch(current);
      setPref(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const toggleCollapsed = useCallback(() => update((p) => ({ ...p, collapsed: !p.collapsed })), [update]);
  const toggleHidden = useCallback(
    (moduleId: string) =>
      update((p) => ({
        ...p,
        hidden: p.hidden.includes(moduleId) ? p.hidden.filter((h) => h !== moduleId) : [...p.hidden, moduleId],
      })),
    [update]
  );

  return { ...prefs, toggleCollapsed, toggleHidden };
}
