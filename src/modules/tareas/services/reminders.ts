import { formatTime12, parseISODate } from '@/core/i18n/dates';
import { cancelReminder, scheduleReminder } from '@/core/notifications/scheduler';

import { setNotificationId } from '../data/tasks-repo';
import type { Task } from '../types';

/** Fecha y hora exactas del recordatorio, o null si la tarea no tiene hora. */
export function reminderDate(task: Pick<Task, 'dueDate' | 'dueTime'>): Date | null {
  if (!task.dueTime) return null;
  const [h, m] = task.dueTime.split(':').map(Number);
  const d = parseISODate(task.dueDate);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Deja el recordatorio de la tarea en el estado correcto: cancela el anterior y programa uno nuevo
 * solo si está pendiente, tiene hora, esa hora no ha pasado y hay permiso.
 */
export async function syncReminder(task: Task): Promise<void> {
  try {
    await cancelReminder(task.notificationId);
    const date = task.completedAt ? null : reminderDate(task);
    const id = date
      ? await scheduleReminder({
          title: task.title,
          body: `Pendiente para las ${formatTime12(task.dueTime ?? '')}`,
          date,
          data: { taskId: task.id },
        })
      : null;
    if (id !== task.notificationId) await setNotificationId(task.id, id);
  } catch {
    // Un fallo de notificaciones nunca debe impedir guardar la tarea.
  }
}

export async function clearReminder(task: Task): Promise<void> {
  await cancelReminder(task.notificationId);
}
