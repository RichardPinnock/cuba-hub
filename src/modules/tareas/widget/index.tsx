import { toISODate } from '@/core/i18n/dates';
import { WIDGET_COLORS } from '@/core/widgets/colors';

import type { ModuleWidget } from '../../types';
import { listTasks, toggleTask } from '../services/task-service';
import { buildToday } from '../services/task-views';
import { TareasWidget } from './TareasWidget';

export const tareasWidget: ModuleWidget = {
  name: 'TareasWidget',
  render: async () => {
    const todayISO = toISODate(new Date());
    const today = buildToday(await listTasks(), todayISO);
    return {
      light: <TareasWidget today={today} todayISO={todayISO} colors={WIDGET_COLORS.light} />,
      dark: <TareasWidget today={today} todayISO={todayISO} colors={WIDGET_COLORS.dark} />,
    };
  },
  onAction: async (action, data) => {
    if (action === 'COMPLETE_TASK' && typeof data?.id === 'number') {
      await toggleTask(data.id);
    }
  },
};
