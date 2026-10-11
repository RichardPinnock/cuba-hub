// Símbolo CubaKit: palma real minimalista (tronco esbelto y copa de pencas).
// Contenido SVG (viewBox 0 0 1024 1024) sobre fondo transparente, centrado en la zona segura.
const BASE = { x: 512, y: 424 }; // donde nacen las pencas

/** Penca en forma de lente curvo: del centro de la copa a `tip`, arqueada hacia `ctrl`. */
function frond(tip, ctrl, t) {
  const a = `${ctrl.x},${ctrl.y - t}`;
  const b = `${ctrl.x},${ctrl.y + t}`;
  return `M${BASE.x} ${BASE.y} Q${a} ${tip.x} ${tip.y} Q${b} ${BASE.x} ${BASE.y} Z`;
}

const FRONDS = [
  'M512 424 Q494 320 512 206 Q530 320 512 424 Z', // lanza central
  frond({ x: 366, y: 262 }, { x: 420, y: 296 }, 36),
  frond({ x: 658, y: 262 }, { x: 604, y: 296 }, 36),
  frond({ x: 262, y: 372 }, { x: 330, y: 318 }, 40),
  frond({ x: 762, y: 372 }, { x: 694, y: 318 }, 40),
  frond({ x: 238, y: 508 }, { x: 300, y: 384 }, 36),
  frond({ x: 786, y: 508 }, { x: 724, y: 384 }, 36),
];

const TRUNK = 'M490 816 C498 740 503 560 503 436 H521 C521 560 526 740 534 816 Q512 826 490 816 Z';
const COLLAR = 'M498 408 H526 V462 H498 Z';

function symbol({ palm = '#FFFFFF', accent = '#FFFFFF' } = {}) {
  return `<g transform="translate(0 -6)">
    <path d="${TRUNK}" fill="${palm}"/>
    <rect x="498" y="404" width="28" height="64" rx="12" fill="${accent}"/>
    ${FRONDS.map((d) => `<path d="${d}" fill="${palm}"/>`).join('\n    ')}
  </g>`;
}

/** Una sola tinta (icono temático de Android 13+). */
function monochrome(ink = '#000000') {
  return symbol({ palm: ink, accent: ink });
}

module.exports = { symbol, monochrome };
