import { Eye, EyeOff, RotateCcw } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/core/components/ui/button';
import { Icon } from '@/core/components/ui/icon';
import { Text } from '@/core/components/ui/text';
import { formatNumber } from '@/core/i18n/numbers';
import { cn } from '@/core/lib/utils';

import type { Currency } from '../types';

type Props = {
  currency: Currency;
  total: number;
  pieces: number;
  /** Total expresado en las demás monedas (solo las que tienen tasa). */
  others: { currency: Currency; amount: number }[];
  hideEmpty: boolean;
  onHideEmpty: (value: boolean) => void;
  onClear: () => void;
};

export function TotalCard({ currency, total, pieces, others, hideEmpty, onHideEmpty, onClear }: Props) {
  return (
    <View className="gap-4 rounded-card bg-primary p-6">
      <View className="gap-1">
        <Text className="text-label text-primary-foreground/80">
          Total en {currency} · {pieces} {pieces === 1 ? 'billete' : 'billetes'}
        </Text>
        <Text className="text-amount text-primary-foreground" numberOfLines={1} adjustsFontSizeToFit>
          {formatNumber(total, 0)}
        </Text>
        {others.length > 0 ? (
          <View className="flex-row flex-wrap gap-x-4">
            {others.map((o) => (
              <Text key={o.currency} className="text-label text-primary-foreground/80">
                ≈ {formatNumber(o.amount, o.currency === 'CUP' ? 0 : 2)} {o.currency}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      <View className="flex-row gap-3">
        <Button
          variant="ghost"
          accessibilityRole="switch"
          accessibilityState={{ checked: hideEmpty }}
          accessibilityLabel="Ocultar sin cantidad"
          className={cn(
            'h-11 flex-1 gap-2 rounded-full',
            hideEmpty ? 'bg-primary-foreground' : 'bg-primary-foreground/15'
          )}
          onPress={() => onHideEmpty(!hideEmpty)}>
          <Icon
            as={hideEmpty ? EyeOff : Eye}
            size={18}
            className={hideEmpty ? 'text-primary' : 'text-primary-foreground'}
          />
          <Text className={cn('text-label', hideEmpty ? 'text-primary' : 'text-primary-foreground')}>
            Ocultar vacías
          </Text>
        </Button>
        <Button
          variant="ghost"
          disabled={pieces === 0}
          accessibilityLabel={`Poner en cero ${currency}`}
          className="h-11 flex-1 gap-2 rounded-full bg-primary-foreground/15"
          onPress={onClear}>
          <Icon as={RotateCcw} size={18} className="text-primary-foreground" />
          <Text className="text-label text-primary-foreground">Poner en cero</Text>
        </Button>
      </View>
    </View>
  );
}
