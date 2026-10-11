import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { useTheme } from '@/core/theme/use-theme';

/** Ilustración del módulo Tareas: lista con checks y un lápiz. */
export function TareasArt({ size = 96 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" accessibilityElementsHidden>
      <Rect x={14} y={10} width={60} height={76} rx={14} fill={colors.card} stroke={colors.primary} strokeWidth={3} />
      <Rect x={30} y={4} width={28} height={14} rx={7} fill={colors.primary} />
      {[34, 50, 66].map((y, i) => (
        <Circle
          key={y}
          cx={29}
          cy={y}
          r={6}
          fill={i < 2 ? colors.primary : 'none'}
          stroke={colors.primary}
          strokeWidth={2.5}
        />
      ))}
      <Path d="M26 34l2.2 2.2L32.5 32" stroke={colors.primaryForeground} strokeWidth={2} strokeLinecap="round" fill="none" />
      <Path d="M26 50l2.2 2.2L32.5 48" stroke={colors.primaryForeground} strokeWidth={2} strokeLinecap="round" fill="none" />
      {[34, 50, 66].map((y, i) => (
        <Rect key={y} x={42} y={y - 3} width={i === 2 ? 18 : 24} height={6} rx={3} fill={colors.accent} />
      ))}
      <Path d="M62 78l4-14 18-18a5 5 0 017 7L73 71z" fill={colors.primary} />
      <Path d="M62 78l4-14 7 7z" fill={colors.secondaryForeground} opacity={0.5} />
    </Svg>
  );
}
