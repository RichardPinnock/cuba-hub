import { type Href, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/core/components/ui/icon';
import { Text } from '@/core/components/ui/text';
import { PressableCard } from '@/core/ui/PressableCard';
import type { ModuleDefinition } from '@/modules/types';

/** Tarjeta de módulo: ilustración SVG arriba, nombre en una sola línea y descripción corta. */
export function ModuleTile({ module }: { module: ModuleDefinition }) {
  const router = useRouter();
  const { Art } = module;

  return (
    <PressableCard
      accessibilityLabel={`${module.name}. ${module.description}`}
      className="gap-3 overflow-hidden p-3"
      onPress={() => router.push(module.route as Href)}>
      <View className="h-[104px] items-center justify-center rounded-[20px] bg-accent">
        <Art size={84} />
      </View>
      <View className="gap-0.5 px-1 pb-1">
        <View className="flex-row items-center justify-between gap-1">
          <Text
            className="flex-1 text-[15px] font-semibold leading-5 text-foreground"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}>
            {module.name}
          </Text>
          <Icon as={ChevronRight} size={16} className="text-muted-foreground" />
        </View>
        <Text className="text-caption text-muted-foreground" numberOfLines={2}>
          {module.description}
        </Text>
      </View>
    </PressableCard>
  );
}
