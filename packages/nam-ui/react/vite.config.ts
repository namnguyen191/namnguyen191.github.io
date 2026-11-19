import { globSync } from 'node:fs';
import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin, type Rolldown } from 'vite';
import dts from 'vite-plugin-dts';

const OUT_DIR = 'dist';
const UNSTYLED_DIR = `${OUT_DIR}/unstyled`;
const ALL_STYLES = 'styles.css';

const isStylesheet = (file: string | null): boolean => /\.s?css$/.test(file ?? '');

const stylesheetsOf = (chunk: Rolldown.RenderedChunk): string[] => [
  ...(chunk.viteMetadata?.importedCss ?? []),
];

const importPath = (from: string, to: string): string => {
  const relative = path.posix.relative(path.posix.dirname(from), to);
  return relative.startsWith('.') ? relative : `./${relative}`;
};

const sourceOf = (bundle: Rolldown.OutputBundle, stylesheet: string): string => {
  const asset = bundle[stylesheet];
  if (asset?.type !== 'asset') throw new Error(`${stylesheet} is missing from the build output`);
  return typeof asset.source === 'string' ? asset.source : new TextDecoder().decode(asset.source);
};

const allStyles = (bundle: Rolldown.OutputBundle): string =>
  Object.keys(bundle)
    .filter(isStylesheet)
    .map((stylesheet) => sourceOf(bundle, stylesheet))
    .join('');

// The end of a chunk's code: its source map comment when it has one. Stylesheet imports go in
// just before it, after all the code, so the positions the source map points at don't move.
const END_OF_CODE = /(?:\/\/# sourceMappingURL=\S+\s*)?$/;
const withImports = (code: string, imports: string): string =>
  code.replace(END_OF_CODE, (sourceMapComment) => `${imports}${sourceMapComment}`);

const componentStyles = (): Plugin => ({
  name: 'nam-ui:component-styles',
  apply: 'build',
  enforce: 'post',
  generateBundle({ dir }, bundle) {
    if (dir === UNSTYLED_DIR) {
      for (const fileName of Object.keys(bundle).filter(isStylesheet)) {
        Reflect.deleteProperty(bundle, fileName);
      }
      return;
    }
    for (const file of Object.values(bundle)) {
      if (file.type !== 'chunk') continue;
      const imports = stylesheetsOf(file)
        .map((stylesheet) => `import ${JSON.stringify(importPath(file.fileName, stylesheet))};\n`)
        .join('');
      if (imports) file.code = withImports(file.code, imports);
    }
    this.emitFile({ type: 'asset', fileName: ALL_STYLES, source: allStyles(bundle) });
  },
});

const output = (dir: string): Rolldown.OutputOptions => ({
  format: 'es',
  dir,
  preserveModules: true,
});

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: 'tsconfig.lib.json',
      outDirs: `${OUT_DIR}/types`,
      copyDtsFiles: true,
      afterDiagnostic: (diagnostics) => {
        if (diagnostics.length) {
          throw new Error('Type error in build. Please run check-types for more info');
        }
      },
    }),
    componentStyles(),
  ],
  build: {
    lib: {
      // The package root and each component's own entry (`@nam-ui/react/Button`).
      entry: ['src/index.ts', ...globSync('src/components/*/index.ts')],
    },
    // One stylesheet per component instead of one for the whole library.
    cssCodeSplit: true,
    rolldownOptions: {
      // The app brings React and the tokens; the library must not bundle its own copies.
      external: ['react', 'react/jsx-runtime', /^@nam-ui\/core(\/|$)/],
      output: [output(OUT_DIR), output(UNSTYLED_DIR)],
    },
    emptyOutDir: true,
    sourcemap: true,
    outDir: OUT_DIR,
    reportCompressedSize: true,
    minify: true,
  },
});
