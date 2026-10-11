import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { CalendarDays, Clock, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/core/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog';
import { Icon } from '@/core/components/ui/icon';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Textarea } from '@/core/components/ui/textarea';
import { Text } from '@/core/components/ui/text';
import { addDaysISO, formatLongDate, formatTime12, parseISODate, timeFromDate, toISODate } from '@/core/i18n/dates';
import { ChoiceChips } from '@/core/ui/ChoiceChips';
import { EmptyState } from '@/core/ui/EmptyState';
import { ScreenScaffold } from '@/core/ui/ScreenScaffold';
import { ListX } from 'lucide-react-native';

import { useTaskForm } from '../hooks/use-task-form';
import { PRIORITY_LABEL, REPEAT_LABEL, type Priority, type Repeat } from '../types';

const PRIORITIES = ([0, 1, 2] as Priority[]).map((value) => ({ value, label: PRIORITY_LABEL[value] }));
const REPEATS = (['none', 'daily', 'weekly'] as Repeat[]).map((value) => ({ value, label: REPEAT_LABEL[value] }));

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="gap-3 rounded-card border border-border bg-card p-5">
      <Label className="text-heading">{label}</Label>
      {children}
    </View>
  );
}

export function TaskFormScreen({ id }: { id?: number }) {
  const f = useTaskForm(id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const todayISO = toISODate(new Date());

  const pickDate = () =>
    DateTimePickerAndroid.open({
      value: parseISODate(f.form.dueDate),
      mode: 'date',
      onChange: (_e, date) => {
        if (date) f.patch({ dueDate: toISODate(date) });
      },
    });

  const pickTime = () => {
    const base = new Date();
    if (f.form.dueTime) {
      const [h, m] = f.form.dueTime.split(':').map(Number);
      base.setHours(h, m, 0, 0);
    } else {
      base.setHours(base.getHours() + 1, 0, 0, 0);
    }
    DateTimePickerAndroid.open({
      value: base,
      mode: 'time',
      is24Hour: false,
      onChange: (_e, date) => {
        if (date) f.patch({ dueTime: timeFromDate(date) });
      },
    });
  };

  const isToday = f.form.dueDate === todayISO;
  const isTomorrow = f.form.dueDate === addDaysISO(todayISO, 1);

  return (
    <ScreenScaffold
      title={f.isEditing ? 'Editar pendiente' : 'Nuevo pendiente'}
      back
      right={
        f.isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full"
            accessibilityLabel="Eliminar pendiente"
            onPress={() => setConfirmDelete(true)}>
            <Icon as={Trash2} size={22} className="text-destructive" />
          </Button>
        ) : null
      }
      footer={
        f.notFound || f.loading ? null : (
          <View className="px-4">
            <Button size="lg" className="h-16 rounded-full" disabled={f.saving} onPress={f.save}>
              <Text className="text-body">{f.isEditing ? 'Guardar cambios' : 'Crear pendiente'}</Text>
            </Button>
          </View>
        )
      }>
      {f.notFound ? (
        <EmptyState icon={ListX} title="Este pendiente ya no existe" message="Puede que la hayas eliminado." />
      ) : (
        <>
          <Field label="¿Qué hay que hacer?">
            <Input
              className="h-16 rounded-2xl px-5 text-body"
              placeholder="Ej.: Pagar la corriente"
              value={f.form.title}
              onChangeText={(title) => f.patch({ title })}
              returnKeyType="next"
              maxLength={120}
              autoFocus={!f.isEditing}
            />
            <Textarea
              className="min-h-24 rounded-2xl px-5 py-3 text-body"
              placeholder="Nota (opcional)"
              value={f.form.note ?? ''}
              onChangeText={(note) => f.patch({ note })}
            />
            {f.error ? <Text className="text-label text-destructive">{f.error}</Text> : null}
          </Field>

          <Field label="Fecha">
            <View className="flex-row flex-wrap gap-2">
              <Button
                variant={isToday ? 'default' : 'secondary'}
                className="h-12 rounded-full px-5"
                onPress={f.setToday}>
                <Text className="text-label">Hoy</Text>
              </Button>
              <Button
                variant={isTomorrow ? 'default' : 'secondary'}
                className="h-12 rounded-full px-5"
                onPress={f.setTomorrow}>
                <Text className="text-label">Mañana</Text>
              </Button>
              <Button
                variant={!isToday && !isTomorrow ? 'default' : 'secondary'}
                className="h-12 gap-2 rounded-full px-5"
                onPress={pickDate}>
                <Icon as={CalendarDays} size={18} className={!isToday && !isTomorrow ? 'text-primary-foreground' : ''} />
                <Text className="text-label">Elegir</Text>
              </Button>
            </View>
            <Text className="text-label text-muted-foreground">{formatLongDate(parseISODate(f.form.dueDate))}</Text>
          </Field>

          <Field label="Recordatorio">
            <View className="flex-row items-center gap-2">
              <Button variant="secondary" className="h-14 flex-1 justify-start gap-3 rounded-full px-5" onPress={pickTime}>
                <Icon as={Clock} size={20} className="text-primary" />
                <Text className="text-body">
                  {f.form.dueTime ? formatTime12(f.form.dueTime) : 'Sin hora · tocar para añadir'}
                </Text>
              </Button>
              {f.form.dueTime ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  accessibilityLabel="Quitar hora"
                  onPress={() => f.patch({ dueTime: null })}>
                  <Icon as={X} size={20} />
                </Button>
              ) : null}
            </View>
            <Text className="text-caption text-muted-foreground">
              Con hora, te avisamos con una notificación en ese momento.
            </Text>
          </Field>

          <Field label="Prioridad">
            <ChoiceChips options={PRIORITIES} value={f.form.priority} onChange={f.setPriority} />
          </Field>

          <Field label="Repetir">
            <ChoiceChips options={REPEATS} value={f.form.repeat} onChange={f.setRepeat} />
          </Field>
        </>
      )}

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar este pendiente?</DialogTitle>
            <DialogDescription>Se borrará también su recordatorio. No se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="h-12 rounded-full" onPress={() => setConfirmDelete(false)}>
              <Text>Cancelar</Text>
            </Button>
            <Button
              variant="destructive"
              className="h-12 rounded-full"
              onPress={() => {
                setConfirmDelete(false);
                f.remove();
              }}>
              <Text>Eliminar</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScreenScaffold>
  );
}
