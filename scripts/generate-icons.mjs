// One-off PWA icon generation from public/favicon.svg.
// Run with: node scripts/generate-icons.mjs — outputs are committed, not built.
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const svg = await readFile(path.join(root, 'public/favicon.svg'));
const BG = '#1a1a2e';

async function plain(size, out) {
  await sharp(svg, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(path.join(root, 'public', out));
  console.log(`✓ ${out}`);
}

// Maskable icons must fill the canvas; artwork stays inside the central 80% safe zone.
async function maskable(size, out) {
  const art = await sharp(svg, { density: 300 })
    .resize(Math.round(size * 0.7), Math.round(size * 0.7))
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: art, gravity: 'centre' }])
    .png()
    .toFile(path.join(root, 'public', out));
  console.log(`✓ ${out}`);
}

await plain(192, 'icon-192.png');
await plain(512, 'icon-512.png');
await maskable(192, 'icon-maskable-192.png');
await maskable(512, 'icon-maskable-512.png');
await maskable(180, 'apple-touch-icon.png');
