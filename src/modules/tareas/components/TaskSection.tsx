import { View } from 'react-native';

import { Text } from '@/core/components/ui/text';

import type { Task } from '../types';
import { TaskRow } from './TaskRow';

type Props = { title?: string; tasks: Task[]; todayISO: string; showDay?: boolean };

export function TaskSection({ title, tasks, todayISO, showDay }: Props) {
  if (tasks.length === 0) return null;
  return (
    <View className="gap-3">
      {title ? <Text className="px-2 pt-2 text-label uppercase tracking-wide text-muted-foreground">{title}</Text> : null}
      {tasks.map((t, i) => (
        <TaskRow key={t.id} task={t} todayISO={todayISO} index={i} showDay={showDay} />
      ))}
    </View>
  );
}
