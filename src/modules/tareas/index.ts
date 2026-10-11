import { CheckCheck } from 'lucide-react-native';

import type { ModuleDefinition } from '../types';
import { tareasWidget } from './widget';
import { TareasArt } from './components/TareasArt';
import { useTasks } from './hooks/use-tasks';
import { resyncAllReminders, TAREAS_MODULE_ID } from './services/task-service';

export const tareasModule: ModuleDefinition = {
  id: TAREAS_MODULE_ID,
  name: 'Pendientes',
  description: 'Lo que tienes por hacer, con avisos',
  icon: CheckCheck,
  Art: TareasArt,
  route: '/tareas',
  migrations: [
    {
      version: 1,
      sql: `
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          note TEXT,
          due_date TEXT NOT NULL,
          due_time TEXT,
          priority INTEGER NOT NULL DEFAULT 1,
          repeat TEXT NOT NULL DEFAULT 'none',
          completed_at TEXT,
          notification_id TEXT,
          spawned_id INTEGER,
          created_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks (due_date);
      `,
    },
  ],
  useSummary: () => {
    const { today, loading } = useTasks();
    if (loading) return { title: 'Pendientes' };
    if (today.total === 0) return { title: 'Pendientes', subtitle: 'Nada para hoy' };
    return {
      title: 'Pendientes',
      subtitle: `${today.done} de ${today.total} completados hoy${today.overdue ? ` · ${today.overdue} atrasados` : ''}`,
    };
  },
  widget: tareasWidget,
  onStart: resyncAllReminders,
};
