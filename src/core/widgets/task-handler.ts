import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { initDatabase } from '@/core/db/bootstrap';
import { MODULES } from '@/modules/registry';

/** Atiende al sistema (añadir, actualizar, redimensionar, clics) para cualquier widget registrado. */
export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  const widget = MODULES.find((m) => m.widget?.name === props.widgetInfo.widgetName)?.widget;
  if (!widget || props.widgetAction === 'WIDGET_DELETED') return;

  try {
    await initDatabase();
    if (props.widgetAction === 'WIDGET_CLICK' && props.clickAction) {
      await widget.onAction?.(props.clickAction, props.clickActionData);
    }
    props.renderWidget(await widget.render());
  } catch {
    // Si falla, el widget conserva el último dibujo válido.
  }
}
