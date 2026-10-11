'use no memo';
// Los widgets se dibujan como funciones puras (sin hooks ni React Compiler).
import { FlexWidget, TextWidget } from 'react-native-android-widget';

import { formatNumber } from '@/core/i18n/numbers';
import type { WidgetColors } from '@/core/widgets/colors';

import { convert } from '../services/converter';
import type { Rate } from '../types';

type Hex = `#${string}`;
type Props = { rates: Rate[]; colors: Record<keyof WidgetColors, Hex> };

const QUICK_USD = [10, 50, 100];

export function TasaWidget({ rates, colors: c }: Props) {
  const usd = rates.find((r) => r.currency === 'USD')?.cupPerUnit ?? null;
  const hasAny = rates.some((r) => r.cupPerUnit !== null);

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'cubahub://tasa' }}
      accessibilityLabel="Abrir conversor de tasa de cambio"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'column',
        backgroundColor: c.bg,
        borderRadius: 28,
        padding: 16,
      }}>
      <TextWidget text="Tasa de cambio" style={{ fontSize: 14, color: c.muted }} />

      {!hasAny ? (
        <FlexWidget style={{ flex: 1, width: 'match_parent', justifyContent: 'center' }}>
          <TextWidget text="Toca para poner la tasa de hoy" style={{ fontSize: 16, color: c.text }} />
        </FlexWidget>
      ) : (
        <FlexWidget style={{ width: 'match_parent', flexDirection: 'column', marginTop: 4 }}>
          {rates.map((r) => (
            <FlexWidget
              key={r.currency}
              style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextWidget text={`1 ${r.currency}`} style={{ fontSize: 18, color: c.text }} />
              <TextWidget
                text={r.cupPerUnit === null ? '—' : `${formatNumber(r.cupPerUnit)} CUP`}
                style={{ fontSize: 18, fontWeight: 'bold', color: c.primary }}
              />
            </FlexWidget>
          ))}
          {usd !== null ? (
            <FlexWidget
              style={{
                width: 'match_parent',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                backgroundColor: c.card,
                borderRadius: 16,
                padding: 8,
              }}>
              {QUICK_USD.map((q) => (
                <FlexWidget key={q} style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <TextWidget text={`${q} USD`} style={{ fontSize: 11, color: c.muted }} />
                  <TextWidget
                    text={formatNumber(convert(q, usd, 'toCup'), 0)}
                    style={{ fontSize: 14, fontWeight: 'bold', color: c.text }}
                  />
                </FlexWidget>
              ))}
            </FlexWidget>
          ) : null}
        </FlexWidget>
      )}
    </FlexWidget>
  );
}
