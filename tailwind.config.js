const plugin = require('tailwindcss/plugin');
const { palette, radius, spacing, typography } = require('./src/core/theme/tokens');

const kebab = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** '#RRGGBB' -> 'H S% L%' (formato que usa hsl(var(--x)) en React Native Reusables). */
function hexToHslChannels(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return `${Math.round(h * 10) / 10} ${Math.round(s * 1000) / 10}% ${Math.round(l * 1000) / 10}%`;
}

const toVars = (colors) =>
  Object.fromEntries(Object.entries(colors).map(([k, v]) => [`--${kebab(k)}`, hexToHslChannels(v)]));

const colors = Object.fromEntries(
  Object.keys(palette.light).map((k) => [kebab(k), `hsl(var(--${kebab(k)}))`])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ...colors,
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: {
        sm: `${radius.sm}px`,
        md: `${radius.md}px`,
        lg: `${radius.lg}px`,
        card: `${radius.card}px`,
        xl: `${radius.xl}px`,
      },
      spacing: Object.fromEntries(Object.entries(spacing).map(([k, v]) => [`t-${k}`, `${v}px`])),
      fontSize: Object.fromEntries(
        Object.entries(typography).map(([k, t]) => [
          k,
          [`${t.size}px`, { lineHeight: `${t.lineHeight}px`, fontWeight: t.weight }],
        ])
      ),
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(({ addBase }) => {
      addBase({
        ':root': toVars(palette.light),
        '@media (prefers-color-scheme: dark)': { ':root': toVars(palette.dark) },
      });
    }),
  ],
};
