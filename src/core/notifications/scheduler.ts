import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const REMINDER_CHANNEL = 'recordatorios';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

/** Mostrar las notificaciones también con la app abierta. Llamar una vez al arrancar. */
export function configureNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL, {
    name: 'Recordatorios',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 200, 120, 200],
    lightColor: '#1A64D6',
  });
}

export async function getPermissionStatus(): Promise<PermissionStatus> {
  const res = await Notifications.getPermissionsAsync();
  if (res.granted) return 'granted';
  return res.canAskAgain ? 'undetermined' : 'denied';
}

/** Pide permiso si aún se puede; devuelve el estado final. */
export async function requestPermission(): Promise<PermissionStatus> {
  const current = await getPermissionStatus();
  if (current !== 'undetermined') return current;
  await ensureChannel();
  const res = await Notifications.requestPermissionsAsync();
  if (res.granted) return 'granted';
  return res.canAskAgain ? 'undetermined' : 'denied';
}

export type ReminderRequest = {
  title: string;
  body: string;
  date: Date;
  data?: Record<string, unknown>;
};

/** Programa un aviso puntual. Devuelve su id, o null si no hay permiso o la fecha ya pasó. */
export async function scheduleReminder(req: ReminderRequest): Promise<string | null> {
  if (req.date.getTime() <= Date.now()) return null;
  if ((await getPermissionStatus()) !== 'granted') return null;
  await ensureChannel();
  return Notifications.scheduleNotificationAsync({
    content: { title: req.title, body: req.body, data: req.data ?? {}, sound: true },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: req.date,
      channelId: REMINDER_CHANNEL,
    },
  });
}

export async function cancelReminder(id: string | null): Promise<void> {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // Ya no existía: nada que cancelar.
  }
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
