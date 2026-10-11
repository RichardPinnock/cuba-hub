import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { addDaysISO, toISODate } from '@/core/i18n/dates';

import { createTask, deleteTask, editTask, getTask } from '../services/task-service';
import type { Priority, Repeat, TaskInput } from '../types';

const blank = (): TaskInput => ({
  title: '',
  note: null,
  dueDate: toISODate(new Date()),
  dueTime: null,
  priority: 1,
  repeat: 'none',
});

/** Estado y acciones del formulario de tarea (nueva si `id` es undefined). */
export function useTaskForm(id?: number) {
  const router = useRouter();
  const [form, setForm] = useState<TaskInput>(blank);
  const [loading, setLoading] = useState(id !== undefined);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id === undefined) return;
    getTask(id)
      .then((t) => {
        if (!t) return setNotFound(true);
        setForm({
          title: t.title,
          note: t.note,
          dueDate: t.dueDate,
          dueTime: t.dueTime,
          priority: t.priority,
          repeat: t.repeat,
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const patch = useCallback((p: Partial<TaskInput>) => {
    setForm((f) => ({ ...f, ...p }));
    setError(null);
  }, []);

  const setPriority = useCallback((priority: Priority) => patch({ priority }), [patch]);
  const setRepeat = useCallback((repeat: Repeat) => patch({ repeat }), [patch]);
  const setToday = useCallback(() => patch({ dueDate: toISODate(new Date()) }), [patch]);
  const setTomorrow = useCallback(() => patch({ dueDate: addDaysISO(toISODate(new Date()), 1) }), [patch]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      if (id === undefined) await createTask(form);
      else await editTask(id, form);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.back();
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      setError(e instanceof Error ? e.message : 'No se pudo guardar el pendiente.');
    } finally {
      setSaving(false);
    }
  }, [form, id, router]);

  const remove = useCallback(async () => {
    if (id === undefined) return;
    try {
      await deleteTask(id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.back();
    } catch {
      setError('No se pudo eliminar el pendiente.');
    }
  }, [id, router]);

  return {
    form,
    patch,
    setPriority,
    setRepeat,
    setToday,
    setTomorrow,
    save,
    remove,
    saving,
    loading,
    notFound,
    error,
    isEditing: id !== undefined,
  };
}
