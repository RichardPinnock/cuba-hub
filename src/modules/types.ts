import type { LucideIcon } from 'lucide-react-native';
import type { ComponentType } from 'react';
import type { WidgetRepresentation } from 'react-native-android-widget';

export type Migration = { version: number; sql: string };

/** Línea de resumen que el módulo aporta a la pantalla de inicio. */
export type ModuleSummary = { title: string; subtitle?: string } | null;

export type ModuleWidget = {
  /** Debe coincidir con el nombre declarado en el plugin de app.json. */
  name: string;
  /** UI actual del widget (variantes clara y oscura). */
  render: () => Promise<WidgetRepresentation>;
  /** Clics con clickAction propio (distinto de OPEN_APP / OPEN_URI). */
  onAction?: (action: string, data: Record<string, unknown> | undefined) => Promise<void>;
};

export type ModuleDefinition = {
  /** Identificador estable (también namespace de migraciones). */
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Ilustración SVG del módulo para su tarjeta en el inicio. */
  Art: ComponentType<{ size?: number }>;
  /** Ruta de Expo Router a la que navega el módulo. */
  route: string;
  migrations: Migration[];
  /** Hook de resumen para el inicio (null = no muestra nada). */
  useSummary: () => ModuleSummary;
  /** Widget de pantalla de inicio de Android. */
  widget?: ModuleWidget;
  /** Se ejecuta al arrancar la app, con la base ya migrada (p. ej. reprogramar recordatorios). */
  onStart?: () => Promise<void>;
};
