import { emitDataChanged } from '@/core/events';
import { toISODate } from '@/core/i18n/dates';
import { cancelAllReminders, requestPermission } from '@/core/notifications/scheduler';

import {
  getTask,
  insertTask,
  listTasks,
  removeTask,
  setCompletion,
  updateTaskFields,
} from '../data/tasks-repo';
import type { Task, TaskInput } from '../types';
import { clearReminder, syncReminder } from './reminders';
import { nextOccurrence } from './task-views';

export const TAREAS_MODULE_ID = 'tareas';

const changed = () => emitDataChanged(TAREAS_MODULE_ID);

export { getTask, listTasks };

export function validateTask(input: TaskInput): string | null {
  if (input.title.trim() === '') return 'Ponle un título al pendiente.';
  if (input.title.trim().length > 120) return 'El título es muy largo (máximo 120 caracteres).';
  return null;
}

async function syncById(id: number): Promise<void> {
  const task = await getTask(id);
  if (task) await syncReminder(task);
}

export async function createTask(input: TaskInput): Promise<number> {
  const error = validateTask(input);
  if (error) throw new Error(error);
  if (input.dueTime) await requestPermission().catch(() => 'denied');
  const id = await insertTask(clean(input), new Date().toISOString());
  await syncById(id);
  changed();
  return id;
}

export async function editTask(id: number, input: TaskInput): Promise<void> {
  const error = validateTask(input);
  if (error) throw new Error(error);
  if (input.dueTime) await requestPermission().catch(() => 'denied');
  await updateTaskFields(id, clean(input));
  await syncById(id);
  changed();
}

export async function deleteTask(id: number): Promise<void> {
  const task = await getTask(id);
  if (task) await clearReminder(task);
  await removeTask(id);
  changed();
}

/**
 * Completa o reabre una tarea. Al completar una repetitiva se crea la siguiente ocurrencia;
 * al reabrirla se elimina esa ocurrencia (si nadie la tocó) para poder deshacer.
 */
export async function toggleTask(id: number): Promise<void> {
  const task = await getTask(id);
  if (!task) return;

  if (!task.completedAt) {
    let spawnedId: number | null = null;
    if (task.repeat !== 'none') {
      const next = nextOccurrence(task, toISODate(new Date()));
      spawnedId = await insertTask(
        {
          title: task.title,
          note: task.note,
          dueDate: next,
          dueTime: task.dueTime,
          priority: task.priority,
          repeat: task.repeat,
        },
        new Date().toISOString()
      );
      await syncById(spawnedId);
    }
    await setCompletion(id, new Date().toISOString(), spawnedId);
  } else {
    if (task.spawnedId) {
      const spawned = await getTask(task.spawnedId);
      if (spawned && !spawned.completedAt) {
        await clearReminder(spawned);
        await removeTask(spawned.id);
      }
    }
    await setCompletion(id, null, null);
  }
  await syncById(id);
  changed();
}

/** Al arrancar: reconstruye los recordatorios de las tareas pendientes (reinicio, cambio de hora…). */
export async function resyncAllReminders(): Promise<void> {
  try {
    await cancelAllReminders();
    const tasks = await listTasks();
    for (const t of tasks) {
      if (!t.completedAt && t.dueTime) await syncReminder({ ...t, notificationId: null });
    }
  } catch {
    // Sin notificaciones la app sigue funcionando.
  }
}

function clean(input: TaskInput): TaskInput {
  const note = input.note?.trim() ?? '';
  return { ...input, title: input.title.trim(), note: note === '' ? null : note };
}
