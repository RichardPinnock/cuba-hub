import { Delete } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/core/components/ui/button';
import { Icon } from '@/core/components/ui/icon';
import { Text } from '@/core/components/ui/text';

import type { Key } from '../services/converter';

const ROWS: Key[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [',', '0', 'del'],
];

type Props = { onKey: (key: Key) => void };

/** Teclado numérico grande, pensado para una mano. Mantén pulsada la tecla borrar para limpiar. */
export function Keypad({ onKey }: Props) {
  return (
    <View className="gap-3">
      {ROWS.map((row) => (
        <View key={row.join('')} className="flex-row gap-3">
          {row.map((key) => (
            <Button
              key={key}
              variant="secondary"
              accessibilityLabel={key === 'del' ? 'Borrar' : key === ',' ? 'Coma decimal' : key}
              className="h-[68px] flex-1 rounded-full bg-card active:bg-accent"
              onPress={() => onKey(key)}
              onLongPress={key === 'del' ? () => onKey('clear') : undefined}>
              {key === 'del' ? (
                <Icon as={Delete} size={26} className="text-foreground" />
              ) : (
                <Text className="text-title text-foreground">{key}</Text>
              )}
            </Button>
          ))}
        </View>
      ))}
    </View>
  );
}
