import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import { cp, mkdir, rm } from 'fs/promises';

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
  } catch (err) {
    console.error('Something went wrong trying to update the manifest description: ', err);
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
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await esbuild.build(options);
  console.log('Build complete.');
}
