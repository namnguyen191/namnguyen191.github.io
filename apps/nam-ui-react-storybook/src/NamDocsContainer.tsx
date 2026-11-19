import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { type PropsWithChildren, type ReactElement, useEffect } from 'react';

import { COLOR_SCHEMES, toColorSchemeChoice } from './color-scheme';

interface ContextWithInternalStore {
  store: {
    userGlobals: {
      globals: {
        colorScheme: string;
      };
    };
  };
}
/**
 * Docs pages have no story, so the decorator in preview.tsx never runs for them. This container
 * does the same job: it follows the toolbar's colour scheme and gives the docs the matching theme.
 */
export const NamDocsContainer = ({
  children,
  context,
  ...props
}: PropsWithChildren<DocsContainerProps>): ReactElement => {
  // `context.store` is not in Storybook's public types, but it is there at runtime.
  const choice = toColorSchemeChoice(
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    (context as unknown as ContextWithInternalStore).store.userGlobals.globals.colorScheme
  );

  useEffect(() => {
    document.documentElement.style.colorScheme = COLOR_SCHEMES[choice];
  }, [choice]);

  return (
    <DocsContainer {...props} context={context}>
      {children}
    </DocsContainer>
  );
};
