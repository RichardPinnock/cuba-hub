import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/core/theme/use-theme';

/** Ilustración del módulo Contadora: abanico de billetes con una moneda. */
export function ContadoraArt({ size = 96 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" accessibilityElementsHidden>
      <Rect x={10} y={30} width={62} height={34} rx={7} fill={colors.secondary} stroke={colors.primary} strokeWidth={2.5} transform="rotate(-14 41 47)" />
      <Rect x={16} y={34} width={62} height={34} rx={7} fill={colors.accent} stroke={colors.primary} strokeWidth={2.5} transform="rotate(-4 47 51)" />
      <Rect x={22} y={40} width={62} height={34} rx={7} fill={colors.card} stroke={colors.primary} strokeWidth={3} transform="rotate(6 53 57)" />
      <Circle cx={53} cy={57} r={9} fill="none" stroke={colors.primary} strokeWidth={2.5} />
      <Path d="M30 50h6M70 64h6" stroke={colors.primary} strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx={72} cy={26} r={14} fill={colors.primary} />
      <SvgText x={72} y={32} fontSize={17} fontWeight="bold" fill={colors.primaryForeground} textAnchor="middle">
        $
      </SvgText>
    </Svg>
  );
}
