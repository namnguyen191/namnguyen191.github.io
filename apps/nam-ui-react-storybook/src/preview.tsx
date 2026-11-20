import '@nam-ui/core/css';
import '@nam-ui/core/fonts';
import './preview.css';
import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import { Controls, Description, Primary, Subtitle, Title } from '@storybook/addon-docs/blocks';
import addonVitest from '@storybook/addon-vitest';
import { type Decorator, definePreview } from '@storybook/react-vite';
import { useEffect } from 'react';
import addonPseudoStates from 'storybook-addon-pseudo-states';

import { COLOR_SCHEMES, toColorSchemeChoice } from './color-scheme';
import { NamDocsContainer } from './NamDocsContainer';

const withColorScheme: Decorator = (Story, { globals }) => {
  const choice = toColorSchemeChoice(globals.colorScheme);

  // oxlint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    document.documentElement.style.colorScheme = COLOR_SCHEMES[choice];
  }, [choice]);

  return <Story />;
};

// Set by the test run that re-renders the stories in the dark theme (see vite.config.ts). Unset in
// Storybook itself, which then follows the system.
const TEST_COLOR_SCHEME = toColorSchemeChoice(import.meta.env.VITE_NAM_COLOR_SCHEME);

// Stories build their `meta` from this object (`preview.meta(...)`), which is how they pick up the
// types of everything configured here. The addons are the same ones `main.ts` registers.
const preview = definePreview({
  addons: [addonVitest(), addonA11y(), addonDocs(), addonPseudoStates()],
  decorators: [withColorScheme],
  globalTypes: {
    colorScheme: {
      description: 'Forces the CSS `color-scheme` on <html>',
      toolbar: {
        title: 'Color scheme',
        icon: 'contrast',
        items: [
          { value: 'system', title: 'System (Default)', icon: 'browser' },
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorScheme: TEST_COLOR_SCHEME,
  },
  parameters: {
    // Use themes switcher to control background instead
    backgrounds: { disable: true },
    a11y: {
      test: 'error',
      // In the dark run, contrast is the only rule checked. Every other rule gives the same answer in
      // both themes and is already checked by the light run.
      ...(TEST_COLOR_SCHEME === 'dark' && {
        options: { runOnly: { type: 'rule', values: ['color-contrast'] } },
      }),
    },
    docs: {
      container: NamDocsContainer,
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
        </>
      ),
    },
  },
});

export default preview;
