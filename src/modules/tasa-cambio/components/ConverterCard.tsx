import { ArrowUpDown } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Button } from '@/core/components/ui/button';
import { Icon } from '@/core/components/ui/icon';
import { Text } from '@/core/components/ui/text';
import { formatNumber } from '@/core/i18n/numbers';
import { motion } from '@/core/theme/tokens';

import type { Direction, ForeignCurrency } from '../types';

type Props = {
  currency: ForeignCurrency;
  direction: Direction;
  /** Texto tal como lo escribe el usuario ("1250,5"). */
  text: string;
  result: number | null;
  onSwap: () => void;
};

/** "1250,5" -> "1 250,5" (agrupa miles sin perder la coma pendiente). */
function groupInput(text: string): string {
  if (text === '') return '0';
  const [int, dec] = text.split(',');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return dec === undefined ? grouped : `${grouped},${dec}`;
}

export function ConverterCard({ currency, direction, text, result, onSwap }: Props) {
  const from = direction === 'toCup' ? currency : 'CUP';
  const to = direction === 'toCup' ? 'CUP' : currency;
  const rotation = useSharedValue(0);
  const swapStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <View className="rounded-card border border-border bg-card p-6">
      <Text className="text-label text-muted-foreground">Tienes</Text>
      <View className="flex-row items-baseline justify-between gap-3">
        <Text
          className="flex-1 text-title text-foreground"
          numberOfLines={1}
          adjustsFontSizeToFit
          accessibilityLabel={`Cantidad en ${from}`}>
          {groupInput(text)}
        </Text>
        <Text className="text-heading text-primary">{from}</Text>
      </View>

      <View className="my-3 flex-row items-center">
        <View className="h-px flex-1 bg-border" />
        <Animated.View style={swapStyle}>
          <Button
            variant="secondary"
            size="icon"
            accessibilityLabel="Invertir dirección"
            className="mx-3 h-14 w-14 rounded-full bg-accent"
            onPress={() => {
              rotation.value = withSpring(rotation.value + 180, motion.spring);
              onSwap();
            }}>
            <Icon as={ArrowUpDown} size={26} className="text-primary" />
          </Button>
        </Animated.View>
        <View className="h-px flex-1 bg-border" />
      </View>

      <Text className="text-label text-muted-foreground">Recibes</Text>
      <View className="flex-row items-baseline justify-between gap-3">
        <Text
          className="flex-1 text-amount text-foreground"
          numberOfLines={1}
          adjustsFontSizeToFit
          accessibilityLabel={`Resultado en ${to}`}>
          {result === null ? '—' : formatNumber(result, 2)}
        </Text>
        <Text className="text-heading text-primary">{to}</Text>
      </View>
    </View>
  );
}
