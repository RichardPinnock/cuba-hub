import { Banknote, TriangleAlert } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/core/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { Text } from '@/core/components/ui/text';
import { EmptyState } from '@/core/ui/EmptyState';
import { ScreenScaffold } from '@/core/ui/ScreenScaffold';
import { useRates } from '@/modules/tasa-cambio/hooks/use-rates';

import { DenominationRow } from '../components/DenominationRow';
import { TotalCard } from '../components/TotalCard';
import { convertAmount } from '../services/money';
import { useCashCounter } from '../hooks/use-cash-counter';
import { countKey, CURRENCIES, type Currency } from '../types';

export function ContadoraScreen() {
  const [currency, setCurrency] = useState<Currency>('CUP');
  const [confirmClear, setConfirmClear] = useState(false);
  const counter = useCashCounter(currency);
  const { rates } = useRates();

  const cupPer = {
    USD: rates.find((r) => r.currency === 'USD')?.cupPerUnit ?? null,
    EUR: rates.find((r) => r.currency === 'EUR')?.cupPerUnit ?? null,
  };
  const others = CURRENCIES.filter((c) => c !== currency).flatMap((c) => {
    const amount = convertAmount(counter.total, currency, c, cupPer);
    return amount === null ? [] : [{ currency: c, amount }];
  });

  return (
    <ScreenScaffold title="Contadora" subtitle="Cuenta tu efectivo billete a billete" back>
      <Tabs value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
        <TabsList className="h-14 w-full rounded-full p-1">
          {CURRENCIES.map((c) => (
            <TabsTrigger key={c} value={c} className="h-full flex-1 rounded-full">
              <Text className="text-body">{c}</Text>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <TotalCard
        currency={currency}
        total={counter.total}
        pieces={counter.pieces}
        others={others}
        hideEmpty={counter.hideEmpty}
        onHideEmpty={counter.setHideEmpty}
        onClear={() => setConfirmClear(true)}
      />

      {counter.error ? (
        <View className="flex-row items-center gap-3 rounded-card bg-destructive/10 p-4">
          <TriangleAlert size={20} color="#D93B45" />
          <Text className="flex-1 text-label text-destructive">{counter.error}</Text>
        </View>
      ) : null}

      {!counter.ready ? null : counter.denominations.length === 0 ? (
        <EmptyState
          icon={Banknote}
          title="Nada que mostrar"
          message="No hay billetes contados en esta moneda. Apaga «Ocultar sin cantidad» para empezar a contar."
          actionLabel="Mostrar todas"
          onAction={() => counter.setHideEmpty(false)}
        />
      ) : (
        <View className="gap-3">
          {counter.denominations.map((d, i) => (
            <DenominationRow
              key={`${currency}-${d}`}
              currency={currency}
              denomination={d}
              qty={counter.counts[countKey(currency, d)] ?? 0}
              index={i}
              onChange={counter.change}
              onSet={counter.setQuantity}
            />
          ))}
        </View>
      )}

      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Limpiar {currency}?</DialogTitle>
            <DialogDescription>Se pondrán en cero todas las cantidades de esta moneda.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="h-12 rounded-full" onPress={() => setConfirmClear(false)}>
              <Text>Cancelar</Text>
            </Button>
            <Button
              variant="destructive"
              className="h-12 rounded-full"
              onPress={() => {
                setConfirmClear(false);
                counter.clear();
              }}>
              <Text>Limpiar</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScreenScaffold>
  );
}
