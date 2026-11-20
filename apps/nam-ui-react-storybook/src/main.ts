import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineMain } from '@storybook/react-vite/node';
import { defaultClientConditions, mergeConfig } from 'vite';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

// Storybook loads the components from their source instead of the built package. The props tables
// on the docs pages are read from the TypeScript types, which the built files no longer have, and
// an edit to a component shows up without rebuilding the library. @nam-ui/react offers its source
// under this condition in its `exports`; nothing else asks for it, so apps get the build.
const SOURCE_CONDITION = '@nam-ui/source';

const config = defineMain({
  stories: ['./**/*.mdx', './**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('storybook-addon-pseudo-states'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  features: {
    // Lets a story carry named tests: `Story.test('...', fn)`. Experimental in Storybook 10.6.
    experimentalTestSyntax: true,
  },
  tags: {
    // `_test` is Storybook's own tag for those tests. They stay out of the sidebar until the tag is
    // switched on in the sidebar's filter.
    _test: { defaultFilterSelection: 'exclude' },
    'test-only': { defaultFilterSelection: 'exclude' },
  },
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      resolve: {
        // Setting conditions replaces Vite's defaults, so they are listed again.
        conditions: [SOURCE_CONDITION, ...defaultClientConditions],
      },
    }),
});
export default config;
