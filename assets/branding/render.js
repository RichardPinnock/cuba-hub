const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');
const { symbol, monochrome } = require('./symbol');

const out = path.join(__dirname, 'out');
fs.mkdirSync(out, { recursive: true });

const GRADIENT = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2F7BF0"/><stop offset="1" stop-color="#0B3E96"/></linearGradient></defs>`;
const svg = (inner, size = 1024, vb = '0 0 1024 1024') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${size}" height="${size}">${inner}</svg>`;
const save = (name, s, width) => {
  const png = new Resvg(s, { fitTo: { mode: 'width', value: width }, font: { loadSystemFonts: true } }).render().asPng();
  fs.writeFileSync(path.join(out, name), png);
};

const bgRect = `${GRADIENT}<rect width="1024" height="1024" fill="url(#g)"/>`;

// Archivos de la app
save('icon.png', svg(bgRect + symbol()), 1024);
save('android-icon-background.png', svg(bgRect), 1024);
save('android-icon-foreground.png', svg(symbol()), 1024);
save('android-icon-monochrome.png', svg(monochrome('#000000')), 1024);
save('splash-icon.png', svg(symbol()), 1024);
save('favicon.png', svg(bgRect + symbol()), 48);

// Play Store
save('play-icon-512.png', svg(bgRect + symbol()), 512);

const feature = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" width="1024" height="500">
  <defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2F7BF0"/><stop offset="1" stop-color="#0B3E96"/></linearGradient></defs>
  <rect width="1024" height="500" fill="url(#fg)"/>
  <g transform="translate(-70 -18) scale(0.52)">${symbol()}</g>
  <text x="352" y="238" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="104" fill="#FFFFFF">CubaKit</text>
  <text x="356" y="304" font-family="Segoe UI, Arial, sans-serif" font-weight="400" font-size="34" fill="#CFE2FB">Pendientes · Tasa de cambio · Contadora</text>
</svg>`;
save('play-feature-1024x500.png', feature, 1024);

fs.writeFileSync(path.join(out, 'logo.svg'), svg(bgRect + symbol()));
fs.writeFileSync(path.join(out, 'logo-symbol.svg'), svg(symbol()));
console.log('ok', fs.readdirSync(out).join(', '));
