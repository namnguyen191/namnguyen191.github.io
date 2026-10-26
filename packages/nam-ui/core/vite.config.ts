import { cpSync, statSync } from 'node:fs';

import { defineConfig as defineViteConfig, mergeConfig, type Plugin } from 'vite';
import dts from 'vite-plugin-dts';
import { defineConfig as defineVitestConfig } from 'vitest/config';

const copyStyles = (): Plugin => ({
  name: 'nam-ui:copy-styles',
  apply: 'build',
  writeBundle(): void {
    cpSync('src', 'dist', {
      recursive: true,
      filter: (source) =>
        statSync(source).isDirectory() || source.endsWith('.scss') || source.endsWith('.css'),
    });
  },
});

const viteConfig = defineViteConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: 'tsconfig.lib.json',
      outDir: 'dist/types',
      copyDtsFiles: true,
      afterDiagnostic: (diagnostics) => {
        if (diagnostics.length) {
          throw new Error('Type error in build. Please run typecheck for more info');
        }
      },
    }),
    copyStyles(),
  ],
  build: {
    lib: {
      entry: ['src/index.ts'],
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    emptyOutDir: true,
    sourcemap: true,
    outDir: 'dist',
    reportCompressedSize: true,
    minify: true,
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: { reportsDirectory: 'coverage', provider: 'v8' },
  },
});

export default mergeConfig(viteConfig, vitestConfig);
