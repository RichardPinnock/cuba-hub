import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';

import { onDataChanged } from '@/core/events';
import { MODULES } from '@/modules/registry';
import type { ModuleDefinition } from '@/modules/types';

async function refresh(module: ModuleDefinition): Promise<void> {
  const widget = module.widget;
  if (!widget) return;
  try {
    await requestWidgetUpdate({ widgetName: widget.name, renderWidget: () => widget.render() });
  } catch {
    // Los widgets son opcionales: nunca deben romper la app.
  }
}

/** Redibuja los widgets al arrancar y cada vez que un módulo emite un cambio de datos. */
export function startWidgetSync(): () => void {
  if (Platform.OS !== 'android') return () => {};
  MODULES.forEach(refresh);
  return onDataChanged((moduleId) => {
    const module = MODULES.find((m) => m.id === moduleId);
    if (module) refresh(module);
  });
}
