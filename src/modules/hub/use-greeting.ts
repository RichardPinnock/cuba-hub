import { useEffect, useState } from 'react';

import { formatLongDate, greetingFor } from '@/core/i18n/dates';

const MINUTE = 60_000;

/** Saludo y fecha en español; se refresca cada minuto (cambio de franja horaria o de día). */
export function useGreeting() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), MINUTE);
    return () => clearInterval(id);
  }, []);

  return { greeting: greetingFor(now), dateLabel: formatLongDate(now) };
}
