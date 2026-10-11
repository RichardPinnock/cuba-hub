import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Text } from '@/core/components/ui/text';
import { ScreenScaffold } from '@/core/ui/ScreenScaffold';
import { MODULES } from '@/modules/registry';

import { DaySummaryCard } from './DaySummaryCard';
import { ModuleTile } from './ModuleTile';
import { useGreeting } from './use-greeting';

export function HomeScreen() {
  const { greeting, dateLabel } = useGreeting();

  return (
    <ScreenScaffold title={greeting} subtitle={dateLabel}>
      <Animated.View entering={FadeInDown.delay(50).duration(350)}>
        <DaySummaryCard />
      </Animated.View>

      <Text className="mt-2 px-2 text-heading text-foreground">Módulos</Text>
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {MODULES.map((m, i) => (
          <Animated.View key={m.id} entering={FadeInDown.delay(120 + i * 70).duration(350)} style={{ width: '48%' }}>
            <ModuleTile module={m} />
          </Animated.View>
        ))}
      </View>
    </ScreenScaffold>
  );
}
