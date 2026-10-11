import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { cn } from '@/core/lib/utils';
import { motion } from '@/core/theme/tokens';

type Props = Omit<PressableProps, 'children'> & { className?: string; children: ReactNode };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Tarjeta pulsable (radio 28) con muelle al presionar y háptico suave. */
export function PressableCard({ className, children, onPressIn, onPressOut, onPress, ...rest }: Props) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      style={style}
      className={cn('rounded-card border border-border bg-card p-5 shadow-sm shadow-black/5', className)}
      onPressIn={(e) => {
        scale.value = withSpring(0.97, motion.spring);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, motion.spring);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.(e);
      }}
      {...rest}>
      {children}
    </AnimatedPressable>
  );
}
