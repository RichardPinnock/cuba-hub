import { BellOff } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/core/components/ui/button';
import { Icon } from '@/core/components/ui/icon';
import { Text } from '@/core/components/ui/text';
import type { PermissionStatus } from '@/core/notifications/scheduler';

type Props = { status: PermissionStatus | null; onRequest: () => void };

/** Aviso cuando los recordatorios no pueden sonar por falta de permiso. */
export function PermissionBanner({ status, onRequest }: Props) {
  if (status === null || status === 'granted') return null;
  const denied = status === 'denied';
  return (
    <View className="flex-row items-center gap-4 rounded-card bg-accent p-5">
      <Icon as={BellOff} size={28} className="text-primary" />
      <View className="flex-1 gap-2">
        <Text className="text-label text-accent-foreground">
          {denied
            ? 'Las notificaciones están desactivadas, así que los recordatorios no sonarán.'
            : 'Activa las notificaciones para que te avisemos a la hora de cada pendiente.'}
        </Text>
        <Button size="sm" className="h-11 self-start rounded-full px-5" onPress={onRequest}>
          <Text>{denied ? 'Abrir ajustes' : 'Activar'}</Text>
        </Button>
      </View>
    </View>
  );
}
