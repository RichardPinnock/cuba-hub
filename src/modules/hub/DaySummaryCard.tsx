import { ChevronDown, Eye, EyeOff, SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/core/components/ui/button';
import { Icon } from '@/core/components/ui/icon';
import { Text } from '@/core/components/ui/text';
import { cn } from '@/core/lib/utils';
import { motion } from '@/core/theme/tokens';
import { MODULES } from '@/modules/registry';
import type { ModuleDefinition } from '@/modules/types';

import { useDayPrefs } from './use-day-prefs';

type LineProps = { module: ModuleDefinition; editing: boolean; hidden: boolean; onToggle: () => void };

function SummaryLine({ module, editing, hidden, onToggle }: LineProps) {
  const summary = module.useSummary();
  if (!summary) return null;
  return (
    <View className={cn('flex-row items-center gap-3', hidden && 'opacity-50')}>
      <View className="h-9 w-9 items-center justify-center rounded-full bg-accent">
        <Icon as={module.icon} size={17} className="text-primary" />
      </View>
      <View className="flex-1">
        <Text className="text-label text-foreground" numberOfLines={1}>
          {summary.title}
        </Text>
        {summary.subtitle ? (
          <Text className="text-caption text-muted-foreground" numberOfLines={2}>
            {summary.subtitle}
          </Text>
        ) : null}
      </View>
      {editing ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-full"
          accessibilityLabel={hidden ? `Mostrar ${module.name}` : `Ocultar ${module.name}`}
          onPress={onToggle}>
          <Icon as={hidden ? EyeOff : Eye} size={20} className="text-muted-foreground" />
        </Button>
      ) : null}
    </View>
  );
}

/** "Tu día": resumen de los módulos. Se puede plegar entera o ocultar módulos concretos. */
export function DaySummaryCard() {
  const prefs = useDayPrefs();
  const [editing, setEditing] = useState(false);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(prefs.collapsed ? -90 : 0, { duration: motion.base });
    if (prefs.collapsed) setEditing(false);
  }, [prefs.collapsed, rotation]);

  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  const visible = MODULES.filter((m) => editing || !prefs.hidden.includes(m.id));

  return (
    <Animated.View layout={LinearTransition.duration(motion.base)} className="rounded-card border border-border bg-card">
      <View className="flex-row items-center pl-5 pr-2">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: !prefs.collapsed }}
          accessibilityLabel={prefs.collapsed ? 'Mostrar Tu día' : 'Plegar Tu día'}
          className="h-14 flex-1 flex-row items-center gap-2"
          onPress={prefs.toggleCollapsed}>
          <Text className="text-heading text-foreground">Tu día</Text>
          <Animated.View style={chevron}>
            <Icon as={ChevronDown} size={20} className="text-muted-foreground" />
          </Animated.View>
        </Pressable>
        {!prefs.collapsed ? (
          <Button
            variant={editing ? 'secondary' : 'ghost'}
            size="icon"
            className="h-11 w-11 rounded-full"
            accessibilityLabel={editing ? 'Terminar de personalizar' : 'Elegir qué mostrar'}
            onPress={() => setEditing((e) => !e)}>
            <Icon as={SlidersHorizontal} size={19} className={editing ? 'text-primary' : 'text-muted-foreground'} />
          </Button>
        ) : null}
      </View>

      {!prefs.collapsed ? (
        <Animated.View
          entering={FadeIn.duration(motion.base)}
          exiting={FadeOut.duration(motion.fast)}
          className="gap-4 px-5 pb-5">
          {visible.length === 0 ? (
            <Text className="text-label text-muted-foreground">
              Tienes todo oculto. Toca el ajuste de arriba para volver a mostrar algo.
            </Text>
          ) : (
            visible.map((m) => (
              <SummaryLine
                key={m.id}
                module={m}
                editing={editing}
                hidden={prefs.hidden.includes(m.id)}
                onToggle={() => prefs.toggleHidden(m.id)}
              />
            ))
          )}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
