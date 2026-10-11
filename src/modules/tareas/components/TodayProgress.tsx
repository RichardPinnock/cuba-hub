import { View } from 'react-native';

import { Text } from '@/core/components/ui/text';
import { ProgressRing } from '@/core/ui/ProgressRing';

import type { TodayView } from '../services/task-views';

function message(v: TodayView): string {
  if (v.total === 0) return 'Día libre: nada pendiente.';
  if (v.done === v.total) return '¡Día completo! Buen trabajo.';
  const left = v.total - v.done;
  return left === 1 ? 'Te queda 1 por hacer.' : `Te quedan ${left} por hacer.`;
}

/** Progreso del día: anillo "3 de 5 completadas". */
export function TodayProgress({ today }: { today: TodayView }) {
  const ratio = today.total === 0 ? 0 : today.done / today.total;
  return (
    <View
      className="flex-row items-center gap-5 rounded-card border border-border bg-card p-5"
      accessible
      accessibilityLabel={`${today.done} de ${today.total} pendientes completados hoy`}>
      <ProgressRing value={ratio}>
        <Text className="text-title text-foreground">{today.done}</Text>
        <Text className="-mt-1 text-caption text-muted-foreground">de {today.total}</Text>
      </ProgressRing>
      <View className="flex-1 gap-1">
        <Text className="text-heading text-foreground">
          {today.done} de {today.total} completados
        </Text>
        <Text className="text-body text-muted-foreground">{message(today)}</Text>
        {today.overdue > 0 ? (
          <Text className="text-label text-destructive">
            {today.overdue === 1 ? '1 pendiente atrasado' : `${today.overdue} pendientes atrasados`}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
