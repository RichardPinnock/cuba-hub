import { addDaysISO } from '@/core/i18n/dates';

import type { Task } from '../types';

/** Pendientes primero; luego por fecha, hora (sin hora al final) y prioridad alta antes. */
export function compareTasks(a: Task, b: Task): number {
  if (!!a.completedAt !== !!b.completedAt) return a.completedAt ? 1 : -1;
  if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
  if (a.dueTime !== b.dueTime) {
    if (a.dueTime === null) return 1;
    if (b.dueTime === null) return -1;
    return a.dueTime < b.dueTime ? -1 : 1;
  }
  return b.priority - a.priority || a.id - b.id;
}

export type TodayView = { tasks: Task[]; done: number; total: number; overdue: number };

/** Hoy = lo que vence hoy (hecho o no) + lo atrasado sin completar. */
export function buildToday(tasks: Task[], todayISO: string): TodayView {
  const list = tasks
    .filter((t) => t.dueDate === todayISO || (!t.completedAt && t.dueDate < todayISO))
    .sort(compareTasks);
  return {
    tasks: list,
    done: list.filter((t) => t.completedAt).length,
    total: list.length,
    overdue: list.filter((t) => !t.completedAt && t.dueDate < todayISO).length,
  };
}

export type DayGroup = { date: string; tasks: Task[] };

/** Semana = atrasadas + los próximos 7 días (hoy incluido), agrupadas por día. */
export function buildWeek(tasks: Task[], todayISO: string): { overdue: Task[]; days: DayGroup[] } {
  const overdue = tasks.filter((t) => !t.completedAt && t.dueDate < todayISO).sort(compareTasks);
  const days: DayGroup[] = [];
  for (let i = 0; i < 7; i++) {
    const date = addDaysISO(todayISO, i);
    days.push({ date, tasks: tasks.filter((t) => t.dueDate === date).sort(compareTasks) });
  }
  return { overdue, days };
}

export type AllView = { pending: Task[]; completed: Task[] };

export function buildAll(tasks: Task[]): AllView {
  const pending = tasks.filter((t) => !t.completedAt).sort(compareTasks);
  const completed = tasks
    .filter((t) => t.completedAt)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    .slice(0, 30);
  return { pending, completed };
}

/** Siguiente fecha de una tarea repetida: nunca en el pasado. */
export function nextOccurrence(task: Pick<Task, 'dueDate' | 'repeat'>, todayISO: string): string {
  const step = task.repeat === 'weekly' ? 7 : 1;
  let next = addDaysISO(task.dueDate, step);
  while (next < todayISO) next = addDaysISO(next, step);
  return next;
}
