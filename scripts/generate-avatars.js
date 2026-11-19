// `npm run avatars` — generates the placeholder profile photos in public/avatars/.
// Local SVGs keep the demo fully offline and free of real people's faces.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { SEED_PROFILES } from '../lib/seed.js';

const PALETTES = [
  ['#ff9a8b', '#ff6a88', '#ff99ac'],
  ['#a18cd1', '#fbc2eb', '#8e7cc3'],
  ['#f6d365', '#fda085', '#f093a0'],
  ['#84fab0', '#8fd3f4', '#5fb7d4'],
  ['#fccb90', '#d57eeb', '#b96ad9'],
  ['#e0c3fc', '#8ec5fc', '#7aa5e8'],
  ['#ffecd2', '#fcb69f', '#f38d7a'],
  ['#43e97b', '#38f9d7', '#2bc4a8'],
  ['#fa709a', '#fee140', '#f5876b'],
  ['#30cfd0', '#5b5fc7', '#4a90c2'],
  ['#ff758c', '#ff7eb3', '#e5609a'],
  ['#c471f5', '#fa71cd', '#a55be0'],
];

function hash(str) {
  let h = 2166136261;
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function avatarSvg(profile) {
  const h = hash(profile.id + profile.name);
  const [a, b, c] = PALETTES[h % PALETTES.length];
  const angle = (h >> 4) % 360;
  const bx = 120 + ((h >> 8) % 360);
  const by = 80 + ((h >> 12) % 220);
  const initial = profile.name[0].toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800" role="img" aria-label="Placeholder photo for ${profile.name}">
  <defs>
    <linearGradient id="bg" gradientTransform="rotate(${angle} .5 .5)">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="800" fill="url(#bg)"/>
  <circle cx="${bx}" cy="${by}" r="230" fill="url(#glow)"/>
  <circle cx="${600 - bx / 2}" cy="${640 - by / 3}" r="180" fill="${c}" opacity=".35"/>
  <g fill="#fff" fill-opacity=".82">
    <circle cx="300" cy="250" r="96"/>
    <path d="M96 640c0-140 92-262 204-262s204 122 204 262z"/>
  </g>
  <text x="300" y="282" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="700" fill="${b}" fill-opacity=".9">${initial}</text>
</svg>
`;
}

const outDir = path.join(process.cwd(), 'public', 'avatars');
mkdirSync(outDir, { recursive: true });
for (const p of SEED_PROFILES) writeFileSync(path.join(outDir, `${p.id}.svg`), avatarSvg(p));
console.log(`Wrote ${SEED_PROFILES.length} avatars to ${outDir}`);
