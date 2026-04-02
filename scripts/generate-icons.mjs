import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const svg = readFileSync(join(__dirname, 'pwa-icon.svg'));
const iconsDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(iconsDir, { recursive: true });

await sharp(svg)
  .resize(192, 192)
  .png()
  .toFile(join(iconsDir, 'icon-192.png'));

await sharp(svg)
  .resize(512, 512)
  .png()
  .toFile(join(iconsDir, 'icon-512.png'));

console.log('Icons generated!');
