import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/core/components/ui/button';
import { Icon } from '@/core/components/ui/icon';
import { Text } from '@/core/components/ui/text';

type Props = {
  icon: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Estado vacío / de error reutilizable. */
export function EmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <Animated.View entering={FadeInDown.duration(300)} className="items-center gap-3 px-8 py-12">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-accent">
        <Icon as={icon} size={36} className="text-primary" />
      </View>
      <Text className="text-center text-heading text-foreground">{title}</Text>
      {message ? <Text className="text-center text-body text-muted-foreground">{message}</Text> : null}
      {actionLabel && onAction ? (
        <Button size="lg" className="mt-2 h-14 rounded-full px-8" onPress={onAction}>
          <Text>{actionLabel}</Text>
        </Button>
      ) : null}
    </Animated.View>
  );
}
