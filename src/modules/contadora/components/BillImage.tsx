import { Image } from 'expo-image';
import { View } from 'react-native';

import { Text } from '@/core/components/ui/text';
import { formatNumber } from '@/core/i18n/numbers';

import { getBillImage } from '../data/bill-images';
import type { Currency } from '../types';

type Props = { currency: Currency; denomination: number; width?: number; height?: number };

/** Foto del billete (assets/bills/<moneda>/<valor>.png) o, si falta, un billete genérico dibujado. */
export function BillImage({ currency, denomination, width = 92, height = 46 }: Props) {
  const source = getBillImage(currency, denomination);

  if (source) {
    return (
      <Image
        source={source}
        contentFit="cover"
        style={{ width, height, borderRadius: 10 }}
        accessibilityLabel={`Billete de ${denomination} ${currency}`}
      />
    );
  }
  return (
    <View
      style={{ width, height }}
      className="items-center justify-center rounded-[10px] border border-primary/40 bg-accent"
      accessibilityLabel={`Billete de ${denomination} ${currency}`}>
      <View className="absolute inset-1 rounded-md border border-dashed border-primary/30" />
      <Text className="text-label font-bold text-primary" numberOfLines={1} adjustsFontSizeToFit>
        {formatNumber(denomination, 0)}
      </Text>
    </View>
  );
}
