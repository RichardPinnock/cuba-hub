// Tokens de diseño: ÚNICA fuente de verdad (colores, radios, espaciado, tipografía).
// CommonJS para que lo lea tailwind.config.js; los tipos están en tokens.d.ts.

/** Paleta base: azules claros y oscuros. */
const palette = {
  light: {
    background: '#EAF2FC',
    foreground: '#0A1A33',
    card: '#FFFFFF',
    cardForeground: '#0A1A33',
    popover: '#FFFFFF',
    popoverForeground: '#0A1A33',
    primary: '#1A64D6',
    primaryForeground: '#FFFFFF',
    secondary: '#D6E6FA',
    secondaryForeground: '#0F3A7A',
    muted: '#DDE9F8',
    mutedForeground: '#566A87',
    accent: '#C9DEF8',
    accentForeground: '#0F3A7A',
    destructive: '#D93B45',
    destructiveForeground: '#FFFFFF',
    success: '#168A5B',
    warning: '#C77A0A',
    border: '#D0DFF2',
    input: '#D0DFF2',
    ring: '#1A64D6',
  },
  dark: {
    background: '#060E1C',
    foreground: '#E6EFFC',
    card: '#0E1A2D',
    cardForeground: '#E6EFFC',
    popover: '#0E1A2D',
    popoverForeground: '#E6EFFC',
    primary: '#5CA3FF',
    primaryForeground: '#04132A',
    secondary: '#16283F',
    secondaryForeground: '#BFD8FA',
    muted: '#13233A',
    mutedForeground: '#8BA2C2',
    accent: '#1B3556',
    accentForeground: '#CFE2FB',
    destructive: '#FF6B73',
    destructiveForeground: '#2A0509',
    success: '#3DD598',
    warning: '#F5B04A',
    border: '#1C3050',
    input: '#1C3050',
    ring: '#5CA3FF',
  },
};

/** Radios (px). Tarjetas One UI ≈ 28. */
const radius = { sm: 12, md: 18, lg: 24, card: 28, xl: 32, full: 9999 };

/** Escala de espaciado (px). */
const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 };

/** Tipografía: tamaños con interlineado (px) y pesos. */
const typography = {
  display: { size: 40, lineHeight: 46, weight: '700' },
  title: { size: 28, lineHeight: 34, weight: '700' },
  heading: { size: 20, lineHeight: 26, weight: '600' },
  body: { size: 16, lineHeight: 22, weight: '400' },
  label: { size: 14, lineHeight: 18, weight: '500' },
  caption: { size: 12, lineHeight: 16, weight: '400' },
  /** Cifra grande del conversor. */
  amount: { size: 56, lineHeight: 62, weight: '700' },
};

/** Medidas de interacción. */
const sizes = { touch: 56, touchSm: 44, headerLarge: 132, headerSmall: 64 };

/** Duraciones y muelles de animación. */
const motion = {
  fast: 150,
  base: 250,
  slow: 400,
  spring: { damping: 18, stiffness: 220, mass: 0.9 },
};

module.exports = { palette, radius, spacing, typography, sizes, motion };
