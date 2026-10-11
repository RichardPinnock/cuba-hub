import { useMemo } from 'react';

import { useModuleData } from '@/core/hooks/use-async-data';
import { toISODate } from '@/core/i18n/dates';

import { listTasks, TAREAS_MODULE_ID } from '../services/task-service';
import { buildAll, buildToday, buildWeek } from '../services/task-views';

/** Todas las tareas y sus vistas derivadas (Hoy, Semana, Todas). */
export function useTasks() {
  const { data, loading, error } = useModuleData(TAREAS_MODULE_ID, listTasks);
  const tasks = useMemo(() => data ?? [], [data]);
  const todayISO = toISODate(new Date());

  const today = useMemo(() => buildToday(tasks, todayISO), [tasks, todayISO]);
  const week = useMemo(() => buildWeek(tasks, todayISO), [tasks, todayISO]);
  const all = useMemo(() => buildAll(tasks), [tasks]);

  return { tasks, today, week, all, todayISO, loading, error };
}
