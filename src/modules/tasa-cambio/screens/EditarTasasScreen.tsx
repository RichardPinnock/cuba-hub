import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Text } from '@/core/components/ui/text';
import { ScreenScaffold } from '@/core/ui/ScreenScaffold';

import { useRateEditor } from '../hooks/use-rate-editor';
import { useRates } from '../hooks/use-rates';
import { CURRENCY_LABEL, FOREIGN_CURRENCIES } from '../types';

export function EditarTasasScreen() {
  const { rates } = useRates();
  const router = useRouter();
  const editor = useRateEditor(rates, () => router.back());

  return (
    <ScreenScaffold
      title="Editar tasas"
      subtitle="¿A cuántos CUP equivale 1 unidad?"
      back
      footer={
        <View className="px-4">
          <Button size="lg" className="h-16 rounded-full" disabled={editor.saving} onPress={editor.save}>
            <Text className="text-body">Guardar tasas</Text>
          </Button>
        </View>
      }>
      {FOREIGN_CURRENCIES.map((currency) => (
        <View key={currency} className="gap-2 rounded-card border border-border bg-card p-5">
          <Label nativeID={`rate-${currency}`} className="text-heading">
            1 {currency} · {CURRENCY_LABEL[currency]}
          </Label>
          <View className="flex-row items-center gap-3">
            <Input
              className="h-16 flex-1 rounded-2xl px-5 text-title"
              keyboardType="decimal-pad"
              placeholder="Ej.: 320"
              accessibilityLabelledBy={`rate-${currency}`}
              value={editor.values[currency]}
              onChangeText={(t) => editor.setValue(currency, t)}
            />
            <Text className="text-heading text-primary">CUP</Text>
          </View>
          {editor.errors[currency] ? (
            <Text className="text-label text-destructive">{editor.errors[currency]}</Text>
          ) : null}
        </View>
      ))}
      <Text className="px-2 text-label text-muted-foreground">
        Usa la tasa que te sirva a ti (la de la calle, la del banco…). Se guarda con la fecha de hoy y funciona sin
        internet.
      </Text>
    </ScreenScaffold>
  );
}
