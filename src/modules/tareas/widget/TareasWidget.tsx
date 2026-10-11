'use no memo';
// Los widgets se dibujan como funciones puras (sin hooks ni React Compiler).
import { FlexWidget, TextWidget } from 'react-native-android-widget';

import { formatTime12 } from '@/core/i18n/dates';
import type { WidgetColors } from '@/core/widgets/colors';

import type { TodayView } from '../services/task-views';

type Hex = `#${string}`;
type Props = { today: TodayView; todayISO: string; colors: Record<keyof WidgetColors, Hex> };

const MAX_ROWS = 4;

export function TareasWidget({ today, todayISO, colors: c }: Props) {
  const pending = today.tasks.filter((t) => !t.completedAt);
  const shown = pending.slice(0, MAX_ROWS);
  const extra = pending.length - shown.length;

  return (
    <FlexWidget
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'column',
        backgroundColor: c.bg,
        borderRadius: 28,
        padding: 14,
      }}>
      <FlexWidget
        style={{ width: 'match_parent', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <FlexWidget
          clickAction="OPEN_URI"
          clickActionData={{ uri: 'cubahub://tareas' }}
          accessibilityLabel="Abrir pendientes"
          style={{ flexDirection: 'column', flex: 1 }}>
          <TextWidget text="Pendientes" style={{ fontSize: 20, fontWeight: 'bold', color: c.text }} />
          <TextWidget
            text={today.total === 0 ? 'Sin pendientes' : `${today.done} de ${today.total} completados`}
            style={{ fontSize: 12, color: c.muted }}
          />
        </FlexWidget>
        <FlexWidget
          clickAction="OPEN_URI"
          clickActionData={{ uri: 'cubahub://tareas/nueva' }}
          accessibilityLabel="Nuevo pendiente"
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: c.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TextWidget text="+" style={{ fontSize: 26, fontWeight: 'bold', color: c.onPrimary }} />
        </FlexWidget>
      </FlexWidget>

      {shown.length === 0 ? (
        <FlexWidget
          clickAction="OPEN_APP"
          style={{ width: 'match_parent', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TextWidget
            text={today.total > 0 ? '¡Todo hecho por hoy!' : 'Nada pendiente. Toca para abrir.'}
            style={{ fontSize: 14, color: c.muted }}
          />
        </FlexWidget>
      ) : (
        <FlexWidget style={{ width: 'match_parent', flexDirection: 'column', marginTop: 8 }}>
          {shown.map((t) => (
            <FlexWidget
              key={t.id}
              style={{
                width: 'match_parent',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: c.card,
                borderRadius: 18,
                paddingVertical: 6,
                paddingHorizontal: 8,
                marginBottom: 6,
              }}>
              <FlexWidget
                clickAction="COMPLETE_TASK"
                clickActionData={{ id: t.id }}
                accessibilityLabel={`Completar ${t.title}`}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FlexWidget
                  style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: c.primary }}
                />
              </FlexWidget>
              <FlexWidget
                clickAction="OPEN_URI"
                clickActionData={{ uri: `cubahub://tareas/${t.id}` }}
                style={{ flexDirection: 'column', flex: 1, marginLeft: 4 }}>
                <TextWidget
                  text={t.title}
                  maxLines={1}
                  truncate="END"
                  style={{ fontSize: 14, color: c.text }}
                />
                {t.dueTime ? (
                  <TextWidget
                    text={formatTime12(t.dueTime)}
                    style={{ fontSize: 11, color: t.dueDate < todayISO ? c.danger : c.muted }}
                  />
                ) : null}
              </FlexWidget>
            </FlexWidget>
          ))}
          {extra > 0 ? (
            <TextWidget
              text={`+${extra} más`}
              clickAction="OPEN_URI"
              clickActionData={{ uri: 'cubahub://tareas' }}
              style={{ fontSize: 12, color: c.primary, marginLeft: 8 }}
            />
          ) : null}
        </FlexWidget>
      )}
    </FlexWidget>
  );
}
