// Loaded by the story test projects in vite.config.ts and nowhere else: Storybook itself never runs
// this file.
//
// Once a story has rendered and its `play` function has run, a picture of it is compared with the
// reference picture kept next to the stories file. Tests attached with `Story.test()` check
// behaviour, not looks, so they get no picture.

import { afterEach, expect } from 'vitest';
import { page } from 'vitest/browser';

import { toColorSchemeChoice } from './color-scheme';

// A composed story is a function that carries `id`, `tags` and more as properties.
const hasProperties = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'function' || (typeof value === 'object' && value !== null);

/** The story being tested. The Storybook Vitest plugin puts it on the test context, untyped. */
const storyOf = (context: object): { id: string; tags: unknown[] } | undefined => {
  if (!('story' in context) || !hasProperties(context.story)) return undefined;
  const { id, tags } = context.story;
  return typeof id === 'string' && Array.isArray(tags) ? { id, tags } : undefined;
};

// Room around the story, so a focus ring isn't cut off by the edge of the page.
document.body.style.padding = '1rem';

afterEach(async (context) => {
  const story = storyOf(context);
  if (!story || story.tags.includes('test-fn') || context.task.result?.state === 'fail') return;

  // Wait for the web font, or the picture could be taken in the fallback font.
  await document.fonts.ready;

  const theme = toColorSchemeChoice(import.meta.env.VITE_NAM_COLOR_SCHEME);
  await expect(page.elementLocator(document.body)).toMatchScreenshot(`${story.id}-${theme}`);
});
