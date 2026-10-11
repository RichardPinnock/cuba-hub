import * as Haptics from 'expo-haptics';
import { View } from 'react-native';

import { Button } from '@/core/components/ui/button';
import { Text } from '@/core/components/ui/text';
import { cn } from '@/core/lib/utils';

type Option<T extends string | number> = { value: T; label: string };
type Props<T extends string | number> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Selector de una opción entre pocas, en botones grandes (prioridad, repetición…). */
export function ChoiceChips<T extends string | number>({ options, value, onChange }: Props<T>) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Button
            key={String(o.value)}
            variant={selected ? 'default' : 'secondary'}
            accessibilityState={{ selected }}
            className={cn('h-12 rounded-full px-5', !selected && 'bg-secondary')}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onChange(o.value);
            }}>
            <Text className={cn('text-label', selected ? 'text-primary-foreground' : 'text-secondary-foreground')}>
              {o.label}
            </Text>
          </Button>
        );
      })}
    </View>
  );
}
