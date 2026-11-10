import '@nam-ui/core/css';
import './preview.css';
import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';

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

const preview: Preview = {
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
    colorScheme: 'system',
  },
  parameters: {
    // Use themes switcher to control background instead
    backgrounds: { disable: true },
    a11y: {
      test: 'todo',
    },
    docs: {
      container: NamDocsContainer,
    },
  },
};

export default preview;
