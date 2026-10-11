import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { CalendarCheck, ListTodo, Plus, TriangleAlert } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/core/components/ui/button';
import { Icon } from '@/core/components/ui/icon';
import { Skeleton } from '@/core/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { Text } from '@/core/components/ui/text';
import { dayLabel } from '@/core/i18n/dates';
import { useNotificationPermission } from '@/core/notifications/use-notification-permission';
import { EmptyState } from '@/core/ui/EmptyState';
import { ScreenScaffold } from '@/core/ui/ScreenScaffold';

import { PermissionBanner } from '../components/PermissionBanner';
import { TaskSection } from '../components/TaskSection';
import { TodayProgress } from '../components/TodayProgress';
import { useTasks } from '../hooks/use-tasks';

type TaskView = 'hoy' | 'semana' | 'todas';
const VIEWS: { value: TaskView; label: string }[] = [
  { value: 'hoy', label: 'Hoy' },
  { value: 'semana', label: 'Semana' },
  { value: 'todas', label: 'Todas' },
];

export function TareasScreen() {
  const router = useRouter();
  const [view, setView] = useState<TaskView>('hoy');
  const { today, week, all, todayISO, loading, error } = useTasks();
  const permission = useNotificationPermission();

  const openNew = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push('/tareas/nueva');
  };

  const weekIsEmpty = week.overdue.length === 0 && week.days.every((d) => d.tasks.length === 0);

  return (
    <ScreenScaffold
      title="Pendientes"
      back
      footer={
        <View className="items-end px-5" pointerEvents="box-none">
          <Button
            size="lg"
            accessibilityLabel="Nuevo pendiente"
            className="h-16 gap-2 rounded-full px-7 shadow-lg shadow-black/20"
            onPress={openNew}>
            <Icon as={Plus} size={24} className="text-primary-foreground" />
            <Text className="text-body">Nuevo pendiente</Text>
          </Button>
        </View>
      }>
      <Tabs value={view} onValueChange={(v) => setView(v as TaskView)}>
        <TabsList className="h-14 w-full rounded-full p-1">
          {VIEWS.map((v) => (
            <TabsTrigger key={v.value} value={v.value} className="h-full flex-1 rounded-full">
              <Text className="text-body">{v.label}</Text>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <PermissionBanner status={permission.status} onRequest={permission.request} />

      {error ? (
        <EmptyState
          icon={TriangleAlert}
          title="No se pudieron cargar los pendientes"
          message="Cierra la app y vuelve a abrirla."
        />
      ) : loading ? (
        <View className="gap-3">
          <Skeleton className="h-28 rounded-card" />
          <Skeleton className="h-[72px] rounded-card" />
          <Skeleton className="h-[72px] rounded-card" />
        </View>
      ) : view === 'hoy' ? (
        <>
          <TodayProgress today={today} />
          {today.total === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="Nada para hoy"
              message="Aprovecha el día, o añade algo: pagar la corriente, comprar el pan, llamar a la familia."
              actionLabel="Nuevo pendiente"
              onAction={openNew}
            />
          ) : (
            <TaskSection tasks={today.tasks} todayISO={todayISO} />
          )}
        </>
      ) : view === 'semana' ? (
        weekIsEmpty ? (
          <EmptyState
            icon={CalendarCheck}
            title="Semana tranquila"
            message="No tienes nada programado en los próximos 7 días."
            actionLabel="Nuevo pendiente"
            onAction={openNew}
          />
        ) : (
          <>
            <TaskSection title="Atrasados" tasks={week.overdue} todayISO={todayISO} showDay />
            {week.days.map((d) => (
              <TaskSection key={d.date} title={dayLabel(d.date, todayISO)} tasks={d.tasks} todayISO={todayISO} />
            ))}
          </>
        )
      ) : all.pending.length === 0 && all.completed.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="Aún no hay pendientes"
          message="Crea el primero y organiza tu día."
          actionLabel="Nuevo pendiente"
          onAction={openNew}
        />
      ) : (
        <>
          <TaskSection title="Por hacer" tasks={all.pending} todayISO={todayISO} showDay />
          <TaskSection title="Hechos" tasks={all.completed} todayISO={todayISO} showDay />
        </>
      )}
    </ScreenScaffold>
  );
}
