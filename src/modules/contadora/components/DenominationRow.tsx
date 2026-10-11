import { Minus, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { Button } from '@/core/components/ui/button';
import { Icon } from '@/core/components/ui/icon';
import { Input } from '@/core/components/ui/input';
import { Text } from '@/core/components/ui/text';
import { formatNumber } from '@/core/i18n/numbers';
import { cn } from '@/core/lib/utils';

import type { Currency } from '../types';
import { BillImage } from './BillImage';

type Props = {
  currency: Currency;
  denomination: number;
  qty: number;
  index: number;
  onChange: (denomination: number, delta: number) => void;
  onSet: (denomination: number, value: number) => void;
};

/** Una denominación: foto del billete, subtotal y control −/cantidad/+ (la cantidad también se escribe). */
export function DenominationRow({ currency, denomination, qty, index, onChange, onSet }: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  useEffect(() => setDraft(null), [qty]);

  const commit = () => {
    if (draft !== null) onSet(denomination, draft === '' ? 0 : Number(draft));
    setDraft(null);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 30).duration(280)}
      layout={LinearTransition.springify().damping(18)}
      className={cn(
        'flex-row items-center gap-3 rounded-card border bg-card p-3',
        qty > 0 ? 'border-primary/40' : 'border-border'
      )}>
      <BillImage currency={currency} denomination={denomination} />
      <View className="flex-1">
        <Text className="text-heading text-foreground" numberOfLines={1} adjustsFontSizeToFit>
          {formatNumber(denomination, 0)}
        </Text>
        <Text className={cn('text-caption', qty > 0 ? 'text-primary' : 'text-muted-foreground')} numberOfLines={1}>
          {qty > 0 ? `= ${formatNumber(denomination * qty, 0)}` : 'Sin billetes'}
        </Text>
      </View>
      <View className="flex-row items-center gap-1">
        <Button
          variant="secondary"
          size="icon"
          accessibilityLabel={`Quitar un billete de ${denomination}`}
          disabled={qty === 0}
          className="h-11 w-11 rounded-full"
          onPress={() => onChange(denomination, -1)}>
          <Icon as={Minus} size={18} />
        </Button>
        <Input
          className="h-11 w-14 rounded-xl px-1 text-center text-body"
          keyboardType="number-pad"
          selectTextOnFocus
          maxLength={5}
          accessibilityLabel={`Cantidad de billetes de ${denomination}`}
          value={draft ?? String(qty)}
          onChangeText={(t) => setDraft(t.replace(/\D/g, ''))}
          onEndEditing={commit}
          onBlur={commit}
        />
        <Button
          size="icon"
          accessibilityLabel={`Añadir un billete de ${denomination}`}
          className="h-11 w-11 rounded-full"
          onPress={() => onChange(denomination, 1)}>
          <Icon as={Plus} size={18} className="text-primary-foreground" />
        </Button>
      </View>
    </Animated.View>
  );
}
