import { getDatabase } from '@/core/db/client';

import type { Priority, Repeat, Task, TaskInput } from '../types';

type Row = {
  id: number;
  title: string;
  note: string | null;
  due_date: string;
  due_time: string | null;
  priority: number;
  repeat: string;
  completed_at: string | null;
  notification_id: string | null;
  spawned_id: number | null;
  created_at: string;
};

const toTask = (r: Row): Task => ({
  id: r.id,
  title: r.title,
  note: r.note,
  dueDate: r.due_date,
  dueTime: r.due_time,
  priority: r.priority as Priority,
  repeat: r.repeat as Repeat,
  completedAt: r.completed_at,
  notificationId: r.notification_id,
  spawnedId: r.spawned_id,
  createdAt: r.created_at,
});

export async function listTasks(): Promise<Task[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<Row>('SELECT * FROM tasks ORDER BY due_date, due_time, id');
  return rows.map(toTask);
}

export async function getTask(id: number): Promise<Task | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<Row>('SELECT * FROM tasks WHERE id = ?', id);
  return row ? toTask(row) : null;
}

export async function insertTask(input: TaskInput, createdAt: string): Promise<number> {
  const db = await getDatabase();
  const res = await db.runAsync(
    `INSERT INTO tasks (title, note, due_date, due_time, priority, repeat, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    input.title,
    input.note,
    input.dueDate,
    input.dueTime,
    input.priority,
    input.repeat,
    createdAt
  );
  return res.lastInsertRowId;
}

export async function updateTaskFields(id: number, input: TaskInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE tasks SET title = ?, note = ?, due_date = ?, due_time = ?, priority = ?, repeat = ? WHERE id = ?`,
    input.title,
    input.note,
    input.dueDate,
    input.dueTime,
    input.priority,
    input.repeat,
    id
  );
}

export async function setCompletion(id: number, completedAt: string | null, spawnedId: number | null): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE tasks SET completed_at = ?, spawned_id = ? WHERE id = ?', completedAt, spawnedId, id);
}

export async function setNotificationId(id: number, notificationId: string | null): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE tasks SET notification_id = ? WHERE id = ?', notificationId, id);
}

export async function removeTask(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
}
