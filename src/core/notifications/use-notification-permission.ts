import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';

import { getPermissionStatus, requestPermission, type PermissionStatus } from './scheduler';

/** Estado del permiso de notificaciones; se actualiza al volver desde los ajustes del sistema. */
export function useNotificationPermission() {
  const [status, setStatus] = useState<PermissionStatus | null>(null);

  const refresh = useCallback(() => {
    getPermissionStatus()
      .then(setStatus)
      .catch(() => setStatus('denied'));
  }, []);

  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  const request = useCallback(async () => {
    const next = await requestPermission();
    setStatus(next);
    // Si Android ya no deja preguntar, lo único posible es ir a los ajustes.
    if (next === 'denied') await Linking.openSettings();
  }, []);

  return { status, request };
}
