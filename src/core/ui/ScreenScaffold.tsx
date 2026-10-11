import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/core/components/ui/button';
import { Icon } from '@/core/components/ui/icon';
import { Text } from '@/core/components/ui/text';
import { sizes } from '@/core/theme/tokens';
import { useTheme } from '@/core/theme/use-theme';

type Props = {
  title: string;
  subtitle?: string;
  /** Muestra el botón de volver (pantallas secundarias). */
  back?: boolean;
  /** Acción a la derecha de la barra superior. */
  right?: ReactNode;
  /** Contenido fijo abajo (botón de guardar, FAB): al alcance del pulgar. */
  footer?: ReactNode;
  children: ReactNode;
};

const COLLAPSE = 72;
const FADE_START = COLLAPSE * 0.6;

/** Pantalla estilo One UI: título grande que se contrae a una barra compacta al hacer scroll. */
export function ScreenScaffold({ title, subtitle, back, right, footer, children }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const barBgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [FADE_START, COLLAPSE], [0, 1], Extrapolation.CLAMP),
  }));
  const smallTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [FADE_START, COLLAPSE], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(scrollY.value, [FADE_START, COLLAPSE], [8, 0], Extrapolation.CLAMP) }],
  }));
  const largeTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, COLLAPSE * 0.8], [1, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(scrollY.value, [0, COLLAPSE], [0, -10], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-60, 0, COLLAPSE], [1.06, 1, 0.94], Extrapolation.CLAMP) },
    ],
  }));

  const barHeight = insets.top + sizes.headerSmall;
  // Pantalla de primer nivel (sin volver ni acciones): el título sube al borde superior.
  const topLevel = !back && !right;

  return (
    <View className="flex-1 bg-background">
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        <View style={{ paddingTop: topLevel ? insets.top + 16 : barHeight }}>
          <Animated.View
            style={[topLevel ? null : { minHeight: sizes.headerLarge - sizes.headerSmall + 40 }, largeTitleStyle]}
            className={topLevel ? 'justify-end px-6 pb-3' : 'justify-end px-6 pb-4 pt-6'}>
            <Text className="text-display text-foreground" numberOfLines={2}>
              {title}
            </Text>
            {subtitle ? <Text className="mt-1 text-body text-muted-foreground">{subtitle}</Text> : null}
          </Animated.View>
        </View>
        <View className="gap-4 px-4 pt-2">{children}</View>
      </Animated.ScrollView>

      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: barHeight,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            borderBottomWidth: StyleSheet.hairlineWidth,
          },
          barBgStyle,
        ]}
      />
      <View
        style={{ position: 'absolute', top: insets.top, left: 0, right: 0, height: sizes.headerSmall }}
        className="flex-row items-center justify-between px-3">
        <View className="flex-row items-center gap-2" style={{ flexShrink: 1 }}>
          {back ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full"
              accessibilityLabel="Volver"
              onPress={() => router.back()}>
              <Icon as={ArrowLeft} size={24} />
            </Button>
          ) : (
            <View className="w-3" />
          )}
          <Animated.View style={smallTitleStyle} pointerEvents="none">
            <Text className="text-heading text-foreground" numberOfLines={1}>
              {title}
            </Text>
          </Animated.View>
        </View>
        {right}
      </View>
      {footer ? (
        <View
          pointerEvents="box-none"
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: insets.bottom + 16 }}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}
