import { ScrollView } from 'react-native';

import { Button } from '@/core/components/ui/button';
import { Text } from '@/core/components/ui/text';
import { formatNumber } from '@/core/i18n/numbers';

type Props = { amounts: number[]; onPick: (value: number) => void };

/** Atajos de cantidades rápidas (10, 50, 100…). */
export function QuickAmounts({ amounts, onPick }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-1">
      {amounts.map((a) => (
        <Button
          key={a}
          variant="secondary"
          className="h-12 rounded-full px-5"
          accessibilityLabel={`Cantidad ${a}`}
          onPress={() => onPick(a)}>
          <Text className="text-label text-secondary-foreground">{formatNumber(a, 0)}</Text>
        </Button>
      ))}
    </ScrollView>
  );
}
