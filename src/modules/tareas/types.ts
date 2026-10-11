/** 0 = baja, 1 = media, 2 = alta */
export type Priority = 0 | 1 | 2;
export type Repeat = 'none' | 'daily' | 'weekly';

export type Task = {
  id: number;
  title: string;
  note: string | null;
  /** "YYYY-MM-DD" (fecha local) */
  dueDate: string;
  /** "HH:mm" (24 h) o null si no tiene hora */
  dueTime: string | null;
  priority: Priority;
  repeat: Repeat;
  /** ISO 8601 o null si está pendiente */
  completedAt: string | null;
  /** Id de la notificación local programada, si la hay */
  notificationId: string | null;
  /** Siguiente repetición generada al completar (para poder deshacer) */
  spawnedId: number | null;
  createdAt: string;
};

export type TaskInput = {
  title: string;
  note: string | null;
  dueDate: string;
  dueTime: string | null;
  priority: Priority;
  repeat: Repeat;
};

export const PRIORITY_LABEL: Record<Priority, string> = { 0: 'Baja', 1: 'Media', 2: 'Alta' };
export const REPEAT_LABEL: Record<Repeat, string> = { none: 'No se repite', daily: 'Cada día', weekly: 'Cada semana' };
