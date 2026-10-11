import { palette, type ColorTokens } from '@/core/theme/tokens';

export type WidgetColors = { bg: string; card: string; text: string; muted: string; primary: string; onPrimary: string; border: string; danger: string };
type Hex = `#${string}`;

const pick = (c: ColorTokens): WidgetColors => ({
  bg: c.background,
  card: c.card,
  text: c.foreground,
  muted: c.mutedForeground,
  primary: c.primary,
  onPrimary: c.primaryForeground,
  border: c.border,
  danger: c.destructive,
});

/** Colores de widget (hex) derivados de los mismos tokens que la app. */
export const WIDGET_COLORS: { light: Record<keyof WidgetColors, Hex>; dark: Record<keyof WidgetColors, Hex> } = {
  light: pick(palette.light) as Record<keyof WidgetColors, Hex>,
  dark: pick(palette.dark) as Record<keyof WidgetColors, Hex>,
};
