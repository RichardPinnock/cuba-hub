export type ColorTokens = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  warning: string;
  border: string;
  input: string;
  ring: string;
};

export type TypeStyle = { size: number; lineHeight: number; weight: '400' | '500' | '600' | '700' };

export const palette: { light: ColorTokens; dark: ColorTokens };
export const radius: { sm: number; md: number; lg: number; card: number; xl: number; full: number };
export const spacing: { xs: number; sm: number; md: number; lg: number; xl: number; '2xl': number; '3xl': number };
export const typography: {
  display: TypeStyle;
  title: TypeStyle;
  heading: TypeStyle;
  body: TypeStyle;
  label: TypeStyle;
  caption: TypeStyle;
  amount: TypeStyle;
};
export const sizes: { touch: number; touchSm: number; headerLarge: number; headerSmall: number };
export const motion: {
  fast: number;
  base: number;
  slow: number;
  spring: { damping: number; stiffness: number; mass: number };
};
