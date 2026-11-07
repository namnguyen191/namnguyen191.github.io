// oxlint-disable no-console
import { readFileSync, writeFileSync } from 'node:fs';
import { cp, mkdir, rm } from 'node:fs/promises';

import { context, build } from 'esbuild';

import packageJson from './package.json' with { type: 'json' };

const isWatch = process.argv.includes('--watch');

async function copyStaticFiles() {
  await rm('dist', { recursive: true, force: true });
  await mkdir('dist', { recursive: true });
  await cp('public', 'dist', { recursive: true });
}

function updateManifestDescription() {
  try {
    const manifestPath = './dist/manifest.json';
    const rawManifest = readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(rawManifest);
    manifest['description'] = packageJson.description;
    writeFileSync(manifestPath, JSON.stringify(manifest));
  } catch (error) {
    console.error('Something went wrong trying to update the manifest description:', error);
  }
}

const options = {
  entryPoints: ['src/content.ts'],
  bundle: true,
  outfile: 'dist/content.js',
  target: 'chrome100',
  sourcemap: true,
};

await copyStaticFiles();
updateManifestDescription();

if (isWatch) {
  const ctx = await context(options);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await build(options);
  console.log('Build complete.');
}
