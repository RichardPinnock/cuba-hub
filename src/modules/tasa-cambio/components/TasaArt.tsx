import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

import { useTheme } from '@/core/theme/use-theme';

/** Ilustración del módulo Tasa de cambio: dos monedas con flechas de intercambio. */
export function TasaArt({ size = 96 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" accessibilityElementsHidden>
      <Circle cx={34} cy={36} r={24} fill={colors.card} stroke={colors.primary} strokeWidth={3} />
      <Circle cx={34} cy={36} r={17} fill="none" stroke={colors.accent} strokeWidth={2} />
      <SvgText x={34} y={44} fontSize={24} fontWeight="bold" fill={colors.primary} textAnchor="middle">
        $
      </SvgText>
      <Circle cx={62} cy={62} r={24} fill={colors.primary} />
      <Circle cx={62} cy={62} r={17} fill="none" stroke={colors.primaryForeground} strokeOpacity={0.4} strokeWidth={2} />
      <SvgText x={62} y={70} fontSize={24} fontWeight="bold" fill={colors.primaryForeground} textAnchor="middle">
        €
      </SvgText>
      <Path d="M64 14h18m0 0l-6-6m6 6l-6 6" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M32 88H14m0 0l6-6m-6 6l6 6" stroke={colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}
