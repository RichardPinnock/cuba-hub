import { View } from 'react-native';

import { Text } from '@/core/components/ui/text';
import { formatRelative } from '@/core/i18n/dates';
import { formatNumber } from '@/core/i18n/numbers';

import { CURRENCY_LABEL, type Rate } from '../types';

const STALE_DAYS = 7;

function isStale(updatedAt: string | null): boolean {
  if (!updatedAt) return false;
  return Date.now() - new Date(updatedAt).getTime() > STALE_DAYS * 86_400_000;
}

/** Tasas guardadas con la fecha de última actualización (avisa si lleva más de una semana). */
export function RateSummary({ rates }: { rates: Rate[] }) {
  return (
    <View className="gap-3 rounded-card border border-border bg-card p-5">
      <Text className="text-heading text-foreground">Tus tasas</Text>
      {rates.map((r) => (
        <View key={r.currency} className="flex-row items-center justify-between">
          <View>
            <Text className="text-body text-foreground">{CURRENCY_LABEL[r.currency]}</Text>
            <Text className={isStale(r.updatedAt) ? 'text-caption text-warning' : 'text-caption text-muted-foreground'}>
              {r.updatedAt
                ? `Actualizada ${formatRelative(new Date(r.updatedAt))}${isStale(r.updatedAt) ? ' · revísala' : ''}`
                : 'Sin definir'}
            </Text>
          </View>
          <Text className="text-heading text-foreground">
            {r.cupPerUnit === null ? '—' : `${formatNumber(r.cupPerUnit)} CUP`}
          </Text>
        </View>
      ))}
    </View>
  );
}
