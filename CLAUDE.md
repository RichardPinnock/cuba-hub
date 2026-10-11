# CubaKit

App Android nativa (hub de módulos) para el día a día en Cuba. Offline-first, sin backend. **Toda la UI en español.**

## Stack
- Expo SDK 57 + TypeScript estricto + Expo Router (rutas en `src/app`, alias `@/*` → `src/*`)
- UI: **React Native Reusables** sobre NativeWind 4 (Tailwind 3)
- Animaciones: `react-native-reanimated`
- Datos: `expo-sqlite` · Notificaciones: `expo-notifications` (locales) · Widgets: `react-native-android-widget`
- Build: **EAS Build en la nube** (no hay Android Studio local). Development build con `expo-dev-client`; NO sirve Expo Go (widgets).
  - `npx eas build -p android --profile development` → instalar el APK y luego `npx expo start --dev-client`.
- Verificación local sin dispositivo: `npx tsc --noEmit` y `npx expo export --platform android`.

## Publicación (Google Play)
- Nombre público: **CubaKit**. Paquete `com.richardpinnock.cubahub` (inmutable tras la primera subida). Solo Android.
- Permisos bloqueados en `app.json` (`blockedPermissions`): alarmas exactas, almacenamiento y overlay. No añadir permisos sensibles sin actualizar `store/play-console-answers.md` y la política de privacidad.
- `store/` contiene ficha, política de privacidad, respuestas de Play Console y la guía paso a paso (`GUIA-PUBLICAR.md`).
- Build de tienda: `npx eas-cli build -p android --profile production` (genera .aab). APK para repartir: perfil `preview`.

## Regla de oro: React Native Reusables para nativo
Todo componente base (botón, tarjeta, diálogo, switch, checkbox, progreso, tabs, input…) viene de React Native Reusables.
Añadir con `npx @react-native-reusables/cli@latest add -y --styling-library nativewind <componente>` → `src/core/components/ui/`.
No reescribir a mano lo que Reusables ya ofrece. Los componentes propios (`src/core/ui/`) componen sobre ellos.

## Estructura
```
index.ts                 Entrada: expo-router + registro del manejador de widgets
src/app/                 Rutas Expo Router (finas: solo reexportan pantallas de módulos)
src/core/components/ui/  Componentes Reusables (generados por CLI)
src/core/ui/             Componentes propios del hub (ScreenScaffold, EmptyState, AnimatedCheck, ProgressRing…)
src/core/theme/          tokens.js (fuente única), tokens.d.ts, use-theme.ts
src/core/db/             Conexión SQLite (client.ts) + migraciones por módulo (bootstrap.ts)
src/core/events.ts       emitDataChanged/onDataChanged: refresca hooks y widgets
src/core/notifications/  Programación de avisos y permiso
src/core/widgets/        Manejador y sincronización de widgets
src/core/i18n/           Fechas y números en español (sin depender de Intl)
src/core/lib/utils.ts    helper cn()
src/modules/<nombre>/    screens/ components/ hooks/ services/ data/ widget/ index.ts
src/modules/registry.ts  ÚNICO registro de módulos (añadir módulo = carpeta + una línea)
```

## Módulos de esta versión
- **Tareas** (`src/modules/tareas`): vistas Hoy/Semana/Todas, CRUD, prioridad, repetición diaria/semanal, anillo de progreso, recordatorios locales.
  - Cada ocurrencia de una tarea repetida es su propia fila: al completarla se crea la siguiente (`spawned_id` permite deshacer).
  - Recordatorios: `services/reminders.ts` (un aviso puntual por tarea con hora, solo si hay permiso). `resyncAllReminders` los reconstruye al arrancar. El permiso se gestiona con `useNotificationPermission`.
- **Tasa de cambio** (`src/modules/tasa-cambio`): USD/EUR → CUP editables (tabla `rates`, con fecha), conversor bidireccional offline. `data/rate-source.ts` define `RateSource` para conectar una API en el futuro.

- **Contadora** (`src/modules/contadora`): cuenta billetes por moneda (USD/EUR/CUP) con tabs, denominaciones en `types.ts`, opción de ocultar las que no tienen cantidad. Tablas `cash_counts` y `cash_prefs`. Usa las tasas de Tasa de cambio solo para mostrar el equivalente en CUP.
  - Fotos de billetes: `assets/bills/<usd|eur|cup>/<valor>.png` (p. ej. `assets/bills/cup/1000.png`). Se detectan con `require.context`; si falta una, se dibuja un billete genérico.
- **Botón flotante de tasa** (`tasa-cambio/components/QuickRateFab.tsx`): montado en `_layout.tsx`, visible en toda la app, arrastrable; abre un diálogo para actualizar USD y EUR al instante.

## Widgets (Android)
- Declarados en `app.json` (plugin `react-native-android-widget`) y en `ModuleDefinition.widget` (`name`, `render`, `onAction`).
- Los componentes de widget son funciones puras: **sin hooks** y con `'use no memo'` arriba (React Compiler).
- Leen la misma SQLite (`cubahub.db`). `core/widgets/task-handler.ts` atiende al sistema en segundo plano; `sync.ts` los redibuja cuando un servicio llama `emitDataChanged(moduleId)`.
- Deep links: `cubahub://tareas`, `cubahub://tareas/nueva`, `cubahub://tasa`.
- Para añadir un widget: crear `widget/` en el módulo, declararlo en `app.json` y en el módulo (requiere nuevo development build).

## Convenciones
- Sin lógica en pantallas: hooks (`hooks/`) y servicios (`services/`); acceso a SQLite solo en `data/`.
- La lógica pura (vistas, conversión, fechas) no importa módulos de Expo, para poder probarla en Node.
- TypeScript `strict`, sin `any`. Componentes pequeños y reutilizables. Estilos con `className` (NativeWind).
- Colores en JS (iconos, Reanimated, StatusBar) vía `useTheme()`; nunca hex sueltos.
- Textos de ejemplo cercanos a la realidad local, sin clichés.
- Cada módulo declara su `ModuleDefinition` (id, nombre, icono, ruta, migraciones, resumen, widget, onStart).
- Clases propias de tokens (`text-body`, `rounded-card`…) están registradas en `cn()` (tailwind-merge) en `core/lib/utils.ts`.

## Tokens de diseño (`src/core/theme/tokens.js`, ÚNICA fuente)
Tailwind y las variables CSS (`--background`, `--primary`…) se generan desde este archivo en `tailwind.config.js`; claro/oscuro sigue el sistema.
- **Paleta** (claro/oscuro): azules. Claro: fondo `#EAF2FC`, tarjeta `#FFFFFF`, primario `#1A64D6`, texto `#0A1A33`. Oscuro: fondo `#060E1C`, tarjeta `#0E1A2D`, primario `#5CA3FF`, texto `#E6EFFC`. También `success`, `warning`, `destructive`, `muted`, `accent`, `border`.
- **Radios**: sm 12 · md 18 · lg 24 · **card 28** · xl 32 · full. Clases: `rounded-card`, etc.
- **Espaciado**: xs 4 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 32 · 3xl 48 (generoso).
- **Tipografía** (clases `text-*`): display 40 · title 28 · heading 20 · body 16 · label 14 · caption 12 · amount 56.
- **Tamaños**: zona táctil mínima 56 (`touch`), 44 secundaria; cabecera grande 132 → compacta 64.
- **Movimiento**: fast 150ms · base 250ms · slow 400ms; muelle `{damping 18, stiffness 220, mass .9}`. Háptico en acciones clave (`expo-haptics`).
- Estilo Samsung One UI: cabeceras grandes que se contraen, tarjetas muy redondeadas, uso cómodo a una mano (acciones abajo: `footer` de `ScreenScaffold`).
