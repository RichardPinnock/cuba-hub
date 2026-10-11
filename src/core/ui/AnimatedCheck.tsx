import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { motion } from '@/core/theme/tokens';
import { useTheme } from '@/core/theme/use-theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const CHECK_LENGTH = 22;

type Props = { checked: boolean; onToggle: () => void; label: string; size?: number };

/** Casilla circular: se rellena con un muelle y el check se dibuja trazo a trazo. */
export function AnimatedCheck({ checked, onToggle, label, size = 32 }: Props) {
  const { colors } = useTheme();
  const progress = useSharedValue(checked ? 1 : 0);
  const pop = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: motion.base });
    if (checked) pop.value = withSequence(withSpring(1.18, motion.spring), withSpring(1, motion.spring));
  }, [checked, progress, pop]);

  const circleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['transparent', colors.primary]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.mutedForeground, colors.primary]),
    transform: [{ scale: pop.value }],
  }));
  const pathProps = useAnimatedProps(() => ({ strokeDashoffset: CHECK_LENGTH * (1 - progress.value) }));

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      hitSlop={8}
      onPress={() => {
        Haptics.impactAsync(
          checked ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
        ).catch(() => {});
        onToggle();
      }}
      style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
          },
          circleStyle,
        ]}>
        <Svg width={size - 12} height={size - 12} viewBox="0 0 24 24">
          <AnimatedPath
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke={colors.primaryForeground}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={CHECK_LENGTH}
            animatedProps={pathProps}
          />
        </Svg>
      </Animated.View>
    </Pressable>
  );
}
