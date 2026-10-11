import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { motion } from '@/core/theme/tokens';
import { useTheme } from '@/core/theme/use-theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = { value: number; size?: number; stroke?: number; children?: ReactNode };

/** Anillo de progreso (0..1) con animación al cambiar. El contenido se centra dentro. */
export function ProgressRing({ value, size = 104, stroke = 11, children }: Props) {
  const { colors } = useTheme();
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.min(1, Math.max(0, value)), {
      duration: motion.slow + 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, progress]);

  const props = useAnimatedProps(() => ({ strokeDashoffset: circumference * (1 - progress.value) }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.accent} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.primary}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={props}
        />
      </Svg>
      {children}
    </View>
  );
}
