import { useRouter } from 'expo-router';
import { Bell, Repeat as RepeatIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { Icon } from '@/core/components/ui/icon';
import { Text } from '@/core/components/ui/text';
import { dayLabel, formatTime12 } from '@/core/i18n/dates';
import { cn } from '@/core/lib/utils';
import { AnimatedCheck } from '@/core/ui/AnimatedCheck';

import { toggleTask } from '../services/task-service';
import type { Priority, Task } from '../types';
import { PRIORITY_LABEL } from '../types';

const PRIORITY_DOT: Record<Priority, string> = {
  0: 'bg-muted-foreground',
  1: 'bg-warning',
  2: 'bg-destructive',
};

type Props = { task: Task; todayISO: string; index?: number; showDay?: boolean };

/** Fila de tarea: check animado, título tachado al completar y toque para editar. */
export function TaskRow({ task, todayISO, index = 0, showDay = false }: Props) {
  const router = useRouter();
  const done = !!task.completedAt;
  const overdue = !done && task.dueDate < todayISO;

  const meta = [
    showDay || overdue ? dayLabel(task.dueDate, todayISO) : null,
    task.dueTime ? formatTime12(task.dueTime) : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 40).duration(300)}
      layout={LinearTransition.springify().damping(18)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Editar pendiente ${task.title}`}
        onPress={() => router.push({ pathname: '/tareas/[id]', params: { id: String(task.id) } })}
        className="min-h-[72px] flex-row items-center gap-1 rounded-card border border-border bg-card py-2 pl-2 pr-5 active:opacity-80">
        <AnimatedCheck
          checked={done}
          label={done ? `Marcar como pendiente: ${task.title}` : `Completar: ${task.title}`}
          onToggle={() => {
            toggleTask(task.id).catch(() => {});
          }}
        />
        <View className="flex-1 gap-0.5 py-1">
          <Text
            numberOfLines={2}
            className={cn(
              'text-body',
              done ? 'text-muted-foreground line-through' : 'text-foreground'
            )}>
            {task.title}
          </Text>
          {meta || task.repeat !== 'none' ? (
            <View className="flex-row items-center gap-1.5">
              {task.dueTime ? <Icon as={Bell} size={12} className="text-muted-foreground" /> : null}
              {task.repeat !== 'none' ? <Icon as={RepeatIcon} size={12} className="text-muted-foreground" /> : null}
              <Text className={cn('text-caption', overdue ? 'text-destructive' : 'text-muted-foreground')}>
                {meta}
              </Text>
            </View>
          ) : null}
        </View>
        <View
          className={cn('h-3 w-3 rounded-full', PRIORITY_DOT[task.priority], done && 'opacity-30')}
          accessibilityLabel={`Prioridad ${PRIORITY_LABEL[task.priority].toLowerCase()}`}
        />
      </Pressable>
    </Animated.View>
  );
}
