import * as Haptics from 'expo-haptics';
import { usePathname } from 'expo-router';
import { RefreshCcw } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
import { Text } from '@/core/components/ui/text';
import { formatRelative } from '@/core/i18n/dates';
import { motion } from '@/core/theme/tokens';

import { useRateEditor } from '../hooks/use-rate-editor';
import { useRates } from '../hooks/use-rates';
import { CURRENCY_LABEL, FOREIGN_CURRENCIES } from '../types';

const SIZE = 56;
const MARGIN = 12;

/** Formulario rápido: dos campos y un botón. Se monta solo mientras el diálogo está abierto. */
function QuickRateForm({ onDone }: { onDone: () => void }) {
  const { rates } = useRates();
  const editor = useRateEditor(rates, onDone);
  const lastUpdate = rates
    .map((r) => r.updatedAt)
    .filter((d): d is string => d !== null)
    .sort()
    .pop();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Actualizar tasa</DialogTitle>
        <DialogDescription>
          {lastUpdate ? `Última vez ${formatRelative(new Date(lastUpdate))}.` : '¿A cuánto está hoy?'}
        </DialogDescription>
      </DialogHeader>
      <View className="gap-4">
        {FOREIGN_CURRENCIES.map((currency, i) => (
          <View key={currency} className="gap-1">
            <View className="flex-row items-center gap-2">
              <Text className="w-14 text-heading text-foreground">1 {currency}</Text>
              <Input
                className="h-16 min-w-0 flex-1 rounded-2xl px-3 text-center text-title"
                style={{ minWidth: 132 }}
                keyboardType="decimal-pad"
                placeholder="0"
                autoFocus={i === 0}
                selectTextOnFocus
                accessibilityLabel={`Tasa de ${CURRENCY_LABEL[currency]} en CUP`}
                value={editor.values[currency]}
                onChangeText={(t) => editor.setValue(currency, t)}
                onSubmitEditing={i === FOREIGN_CURRENCIES.length - 1 ? editor.save : undefined}
              />
              <Text className="w-11 text-label text-muted-foreground">CUP</Text>
            </View>
            {editor.errors[currency] ? (
              <Text className="text-label text-destructive">{editor.errors[currency]}</Text>
            ) : null}
          </View>
        ))}
      </View>
      <DialogFooter>
        <Button size="lg" className="h-14 rounded-full" disabled={editor.saving} onPress={editor.save}>
          <Text className="text-body">Guardar tasas</Text>
        </Button>
      </DialogFooter>
    </>
  );
}

/**
 * Botón flotante global para actualizar la tasa en dos toques desde cualquier pantalla.
 * Se puede arrastrar y se pega al borde izquierdo o derecho.
 */
export function QuickRateFab() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [open, setOpen] = useState(false);

  const minY = insets.top + MARGIN;
  const maxY = height - insets.bottom - SIZE - MARGIN;
  const x = useSharedValue(width - SIZE - MARGIN);
  const y = useSharedValue(minY);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = x.value;
      startY.value = y.value;
    })
    .onUpdate((e) => {
      x.value = startX.value + e.translationX;
      y.value = Math.min(maxY, Math.max(minY, startY.value + e.translationY));
    })
    .onEnd(() => {
      const toRight = x.value + SIZE / 2 > width / 2;
      x.value = withSpring(toRight ? width - SIZE - MARGIN : MARGIN, motion.spring);
    });

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { translateY: y.value }] }));

  // En la pantalla de edición de tasas el botón sobra.
  if (pathname.startsWith('/tasa/editar')) return null;

  return (
    <>
      <GestureDetector gesture={pan}>
        <Animated.View style={[{ position: 'absolute', top: 0, left: 0, width: SIZE, height: SIZE }, style]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Actualizar tasa de cambio"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              setOpen(true);
            }}
            className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/30 active:opacity-80">
            <Icon as={RefreshCcw} size={22} className="text-primary-foreground" />
          </Pressable>
        </Animated.View>
      </GestureDetector>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-full gap-5 rounded-card p-5">{open ? <QuickRateForm onDone={() => setOpen(false)} /> : null}</DialogContent>
      </Dialog>
    </>
  );
}
