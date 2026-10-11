import { useRouter } from 'expo-router';
import { Pencil, TriangleAlert } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/core/components/ui/button';
import { Icon } from '@/core/components/ui/icon';
import { Tabs, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { Text } from '@/core/components/ui/text';
import { EmptyState } from '@/core/ui/EmptyState';
import { ScreenScaffold } from '@/core/ui/ScreenScaffold';

import { ConverterCard } from '../components/ConverterCard';
import { Keypad } from '../components/Keypad';
import { QuickAmounts } from '../components/QuickAmounts';
import { RateSummary } from '../components/RateSummary';
import { useConverter } from '../hooks/use-converter';
import { useRates } from '../hooks/use-rates';
import { QUICK_AMOUNTS } from '../services/converter';
import { CURRENCY_LABEL, FOREIGN_CURRENCIES, type ForeignCurrency } from '../types';

export function TasaScreen() {
  const router = useRouter();
  const { rates, error } = useRates();
  const c = useConverter(rates);

  return (
    <ScreenScaffold
      title="Tasa de cambio"
      back
      right={
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full"
          accessibilityLabel="Editar tasas"
          onPress={() => router.push('/tasa/editar')}>
          <Icon as={Pencil} size={22} />
        </Button>
      }>
      {error ? (
        <EmptyState
          icon={TriangleAlert}
          title="No se pudieron leer las tasas"
          message="Tus datos están a salvo en el teléfono. Cierra y vuelve a abrir la app."
        />
      ) : (
        <>
          <Tabs value={c.currency} onValueChange={(v) => c.setCurrency(v as ForeignCurrency)}>
            <TabsList className="h-14 w-full rounded-full p-1">
              {FOREIGN_CURRENCIES.map((cur) => (
                <TabsTrigger key={cur} value={cur} className="h-full flex-1 rounded-full">
                  <Text className="text-body">
                    {cur} · {CURRENCY_LABEL[cur]}
                  </Text>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {!c.hasRate ? (
            <View className="gap-3 rounded-card border border-border bg-accent p-5">
              <Text className="text-heading text-accent-foreground">
                Define cuánto vale hoy 1 {c.currency} en CUP
              </Text>
              <Text className="text-body text-accent-foreground">
                La tasa cambia de un día a otro, así que la pones tú y se guarda en tu teléfono.
              </Text>
              <Button size="lg" className="h-14 rounded-full" onPress={() => router.push('/tasa/editar')}>
                <Text>Poner la tasa</Text>
              </Button>
            </View>
          ) : null}

          <ConverterCard
            currency={c.currency}
            direction={c.direction}
            text={c.text}
            result={c.result}
            onSwap={c.swap}
          />
          <QuickAmounts amounts={QUICK_AMOUNTS[c.direction]} onPick={c.setQuick} />
          <Keypad onKey={c.press} />
          <RateSummary rates={rates} />
        </>
      )}
    </ScreenScaffold>
  );
}
