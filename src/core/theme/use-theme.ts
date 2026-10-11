import { useColorScheme } from 'react-native';

import { palette, type ColorTokens } from './tokens';

/** Colores del tema activo (para props que no admiten className: iconos SVG, Reanimated, StatusBar). */
export function useTheme(): { isDark: boolean; colors: ColorTokens } {
  const isDark = useColorScheme() === 'dark';
  return { isDark, colors: isDark ? palette.dark : palette.light };
}
