import '../global.css';

import { PortalHost } from '@rn-primitives/portal';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { TriangleAlert } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initDatabase } from '@/core/db/bootstrap';
import { configureNotifications, ensureChannel } from '@/core/notifications/scheduler';
import { useTheme } from '@/core/theme/use-theme';
import { EmptyState } from '@/core/ui/EmptyState';
import { startWidgetSync } from '@/core/widgets/sync';
import { MODULES } from '@/modules/registry';
import { QuickRateFab } from '@/modules/tasa-cambio/components/QuickRateFab';

SplashScreen.preventAutoHideAsync().catch(() => {});
configureNotifications();

type DbState = 'loading' | 'ready' | 'error';

/** Al tocar una notificación de tarea, abre su edición. */
function useNotificationTaps(enabled: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (!enabled) return;
    const open = (data: Record<string, unknown> | undefined) => {
      if (typeof data?.taskId === 'number') {
        router.push({ pathname: '/tareas/[id]', params: { id: String(data.taskId) } });
      }
    };
    Notifications.getLastNotificationResponseAsync()
      .then((r) => open(r?.notification.request.content.data))
      .catch(() => {});
    const sub = Notifications.addNotificationResponseReceivedListener((r) =>
      open(r.notification.request.content.data)
    );
    return () => sub.remove();
  }, [enabled, router]);
}

export default function RootLayout() {
  const { isDark, colors } = useTheme();
  const [db, setDb] = useState<DbState>('loading');

  useEffect(() => {
    initDatabase()
      .then(() => {
        setDb('ready');
        ensureChannel().catch(() => {});
        MODULES.forEach((m) => m.onStart?.().catch(() => {}));
      })
      .catch(() => setDb('error'))
      .finally(() => SplashScreen.hideAsync().catch(() => {}));
  }, []);

  useEffect(() => (db === 'ready' ? startWidgetSync() : undefined), [db]);
  useNotificationTaps(db === 'ready');

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        {db === 'ready' ? (
          <>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: colors.background },
              }}
            />
            <QuickRateFab />
          </>
        ) : db === 'error' ? (
          <EmptyState
            icon={TriangleAlert}
            title="No se pudo abrir tus datos"
            message="Cierra la app y vuelve a abrirla. Si sigue igual, reinstálala."
          />
        ) : null}
        <PortalHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
