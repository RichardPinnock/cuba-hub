# Marca CubaKit

- Logo: palma real minimalista en blanco sobre degradado azul.
- `logo.svg` (icono completo) y `logo-symbol.svg` (solo el símbolo, fondo transparente): fuentes vectoriales.
- `symbol.js` define el dibujo; `render.js` genera todos los PNG (icono, icono adaptativo, monocromo, splash, ficha de Play).
  Para regenerarlos: `npm i @resvg/resvg-js` en una carpeta temporal con estos dos archivos y `node render.js`; copia los PNG a `assets/images/` y `store/graphics/`.
- Paleta: azul vivo #1A64D6, degradado #2F7BF0 → #0B3E96, blanco.
