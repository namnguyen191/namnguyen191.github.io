// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';
import type { TestProjectConfiguration } from 'vitest/config';

const currentDir = import.meta.dirname;

const dirname =
  typeof currentDir !== 'undefined' ? currentDir : path.dirname(fileURLToPath(import.meta.url));

// The environment a picture is drawn in decides its pixels, so each environment has its own set of
// reference pictures. CI names its own (SCREENSHOT_ENV in .github/workflows/deploy.yml); anywhere
// else it is the operating system. `darwin` is the set a person reviews; CI's set is only ever
// redrawn to match it.
const SCREENSHOT_ENV = process.env.SCREENSHOT_ENV ?? process.platform;

// Stories run as tests in two projects. `storybook` is the full run: every story and every test
// attached to one, in the light theme. `storybook-dark` renders each story once more in the dark
// theme, to check colour contrast and take its picture there: behaviour doesn't depend on the theme,
// so the attached tests are skipped.
const storybookProject = (
  name: string,
  colorScheme: 'light' | 'dark'
): TestProjectConfiguration => ({
  extends: true,
  plugins: [
    // Runs the stories found by the Storybook config in `src/` as tests.
    // https://storybook.js.org/docs/writing-tests/integrations/vitest-addon#storybooktest
    storybookTest({
      configDir: path.join(dirname, 'src'),
      // `test-fn` is the tag Storybook puts on tests written with `Story.test()`.
      tags: { skip: colorScheme === 'dark' ? ['test-fn'] : [] },
    }),
  ],
  test: {
    name,
    // Read in src/preview.tsx and src/visual.setup.ts.
    env: { VITE_NAM_COLOR_SCHEME: colorScheme },
    // `pseudo-states.setup.ts` lets stories force hover, pressed and focus. `visual.setup.ts` compares
    // a picture of each story with its reference.
    setupFiles: ['./src/pseudo-states.setup.ts', './src/visual.setup.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({}),
      instances: [{ browser: 'chromium' }],
      expect: {
        toMatchScreenshot: {
          // __screenshots__/<environment>/<stories file's path>/<picture>-<browser>.png
          resolveScreenshotPath: ({
            arg,
            browserName,
            ext,
            root,
            testFileDirectory,
            testFileName,
          }) =>
            path.join(
              root,
              '__screenshots__',
              SCREENSHOT_ENV,
              testFileDirectory,
              testFileName,
              `${arg}-${browserName}${ext}`
            ),
        },
      },
    },
  },
});

export default defineConfig({
  plugins: [react()],
  test: {
    // Draw a picture that has no reference as its reference, in CI too, where Vitest otherwise
    // doesn't (CI uploads them). The test still fails, so a new picture is always looked at. A
    // picture that doesn't match is never replaced: only `pnpm test:update` (`--update`) does that.
    update: 'new',
    coverage: {
      provider: 'v8',
      // The components live in @nam-ui/react, outside this app.
      allowExternal: true,
      include: ['**/nam-ui/react/src/**/*.{ts,tsx}'],
      thresholds: { 100: true },
    },
    projects: [
      storybookProject('storybook', 'light'),
      storybookProject('storybook-dark', 'dark'),
      // @nam-ui/react's own tests, run in Node beside the stories so that coverage counts them too.
      {
        test: {
          name: 'nam-ui-react',
          root: path.join(dirname, '../../packages/nam-ui/react'),
          include: ['src/**/*.test.{ts,tsx}'],
          environment: 'node',
          globals: true,
          // Type tests (`*.test-d.tsx`) are compiled, not run.
          typecheck: { enabled: true, tsconfig: './tsconfig.spec.json' },
        },
      },
    ],
  },
});
