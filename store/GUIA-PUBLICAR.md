# Guía para publicar CubaKit en Google Play

## 0. Antes de empezar
- Cuenta de **Google Play Console**: pago único de **25 USD** y verificación de identidad (puede tardar días). https://play.google.com/console
- **Regla para cuentas personales nuevas:** antes de pasar a producción necesitas una **prueba cerrada con al menos 12 testers que se mantengan 14 días seguidos**. Planea ese tiempo desde ya. Las cuentas de organización no tienen este requisito.
- El **nombre del paquete** `com.richardpinnock.cubahub` queda fijado para siempre en cuanto subas el primer archivo. Si quieres otro (por ejemplo `com.alamano.app`), cámbialo en `app.json` (`android.package`) **antes** de la primera subida.
- La versión de Android que exige Google (API objetivo) la gestiona Expo SDK 57; no tienes que tocarla.

## 1. Logo e imágenes (lo único que falta de mi lado)
1. El logo ya está generado e instalado en `assets/images/` (fuentes en `assets/branding/`).
2. Para la ficha ya tienes en `store/graphics/` el icono 512×512 y el gráfico de funciones 1024×500. Solo faltan las capturas (2 a 8) del teléfono.
   Las capturas las sacas con la app abierta en tu teléfono (encender + bajar volumen).

## 2. Publica la política de privacidad
Google exige una **URL pública**. Usa `store/privacy-policy.html`:
1. Abre el archivo y cambia `[TU_CORREO@EJEMPLO.COM]` por tu correo real.
2. Súbelo a un sitio público. Opciones gratis o baratas: GitHub Pages, Google Sites (pega el texto) o tu hosting.
3. Comprueba que la URL abre en el navegador sin iniciar sesión. Guarda la URL.

## 3. Genera el archivo para Google Play (.aab)
En la carpeta del proyecto:
```bash
npx eas-cli login
npx eas-cli build -p android --profile production
```
- Tarda unos 10–20 minutos. Al terminar te da un enlace para descargar el **.aab**.
- EAS gestiona la clave de firma. **Guarda una copia:** `npx eas-cli credentials` → Android → descargar keystore. Sin ella no podrías actualizar la app si Google te pidiera la clave de subida.
- Cada build de producción sube el `versionCode` automáticamente.

## 4. Crea la app en Play Console
1. **Crear app** → nombre `CubaKit: pendientes y tasa`, idioma español, **App**, **Gratuita**, acepta las declaraciones.
2. Rellena todo **«Contenido de la app»** con `store/play-console-answers.md`: política de privacidad, anuncios, acceso, clasificación, público objetivo, seguridad de los datos y declaraciones.
3. **Ficha de Play Store principal** → pega los textos de `store/listing-es.md`, sube icono, gráfico y capturas.
4. Elige la categoría **Productividad** y añade tu correo de contacto.

## 5. Primera subida: prueba interna
1. **Pruebas → Pruebas internas → Crear versión.**
2. Activa **Play App Signing** si te lo pide (recomendado) y sube el `.aab`.
3. Notas de la versión: copia las de `store/listing-es.md`. Guarda y despliega.
4. Añade tu propio correo como tester y abre el enlace de invitación desde tu teléfono para instalarla desde Play y comprobar que todo funciona (notificaciones, widgets, base de datos).

## 6. Prueba cerrada (obligatoria en cuentas personales nuevas)
1. **Pruebas → Pruebas cerradas → Crear pista → Crear versión.** Sube el mismo `.aab` (o uno más reciente).
2. Crea una **lista de testers** con **12 o más correos de Gmail** (o un Grupo de Google) y comparte el enlace de participación.
3. Los testers deben **aceptar la invitación e instalar la app**, y mantenerse inscritos **14 días seguidos**.
4. Mientras tanto, pide que la abran de vez en cuando y que te den opiniones. Corrige lo que salga.

## 7. Solicita el acceso a producción
1. Pasados los 14 días: **Panel → Solicitar acceso a producción** y responde el cuestionario sobre tu prueba (qué probaron, qué cambiaste).
2. Google responde normalmente en un par de días.
3. Con el acceso aprobado: **Producción → Crear versión** → selecciona el `.aab` → **Enviar a revisión**.
4. La revisión de una app nueva suele tardar de unos pocos días hasta una semana.

## 8. Actualizaciones
- Cambia el código, y si quieres, `version` en `app.json` (el número visible, p. ej. `1.0.1`).
- `npx eas-cli build -p android --profile production` y sube el nuevo `.aab` a producción (o a prueba primero).
- Automatizar la subida (opcional): crea una cuenta de servicio de Google y usa `npx eas-cli submit -p android --profile production`. La primera subida de cada app siempre se hace a mano desde la consola.

## Si en Cuba mucha gente no puede usar Google Play
Para repartir la app fuera de Play (WhatsApp, Telegram, memoria USB), genera un **APK** firmado:
```bash
npx eas-cli build -p android --profile preview
```
Es el mismo código; quien lo instale debe permitir «instalar apps de orígenes desconocidos». Las actualizaciones hay que repartirlas a mano.

## Lista de comprobación final
- [x] Iconos propios en `assets/images/`
- [ ] Correo en la política de privacidad y URL pública funcionando
- [ ] Nombre de paquete definitivo
- [ ] `.aab` generado con el perfil `production`
- [ ] Copia de seguridad del keystore
- [ ] «Contenido de la app» completo (todas las secciones en verde)
- [ ] Ficha con textos, icono, gráfico y 2+ capturas
- [ ] Prueba cerrada: 12+ testers, 14 días
- [ ] Solicitud de acceso a producción enviada
