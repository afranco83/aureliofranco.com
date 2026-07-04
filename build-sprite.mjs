// build-sprite.mjs
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const iconsDir = path.join(process.cwd(), 'src/icons');
const outputFile = path.join(process.cwd(), 'public/icons.svg');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const files = fs.readdirSync(iconsDir).filter((file) => file.endsWith('.svg'));

if (files.length === 0) {
  console.log('⚠️ No hay archivos SVG en src/icons/. Añade alguno de Figma.');
  process.exit(0);
}

// SOLUCIÓN: URL exacta obligatoria del estándar W3C para gráficos SVG
let spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n`;

files.forEach((file) => {
  const iconName = path.basename(file, '.svg');
  let svgRaw = fs.readFileSync(path.join(iconsDir, file), 'utf-8');

  const viewBoxMatch = svgRaw.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch
    ? `viewBox="${viewBoxMatch[1]}"`
    : 'viewBox="0 0 24 24"';

  let innerContent = svgRaw
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .trim();

  // Limpiar colores estáticos de Figma
  innerContent = innerContent.replace(
    /fill="(#[a-fA-F0-9]{3,6}|black|rgb\([^)]+\))"/g,
    'fill="currentColor"',
  );
  innerContent = innerContent.replace(
    /stroke="(#[a-fA-F0-9]{3,6}|black|rgb\([^)]+\))"/g,
    'stroke="currentColor"',
  );

  spriteContent += `  <symbol id="${iconName}" ${viewBox}>\n    ${innerContent}\n  </symbol>\n`;
});

spriteContent += `</svg>`;

try {
  fs.writeFileSync(outputFile, spriteContent, 'utf-8');

  const iconNames = files.map((file) => path.basename(file, '.svg')).sort();

  // Hash del contenido: fuerza a los navegadores/CDNs a pedir icons.svg de
  // nuevo cuando cambia, en vez de servir una versión cacheada desactualizada.
  const spriteVersion = crypto
    .createHash('md5')
    .update(spriteContent)
    .digest('hex')
    .slice(0, 8);

  const typesFile = path.join(process.cwd(), 'src/types/icons.ts');

  const typeContent = `
// Archivo generado automáticamente
export const ICON_NAMES = [
${iconNames.map((name) => `  '${name}',`).join('\n')}
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export const ICON_SPRITE_VERSION = '${spriteVersion}';
`;

  fs.writeFileSync(typesFile, typeContent);

  console.log('🚀 ¡Sprite generado con la URL correcta en public/icons.svg!');
} catch (error) {
  console.error('❌ Error al escribir el sprite:', error);
}
