// Loaded by the story test projects in vite.config.ts, in CI too.
//
// Lets the pseudo-states addon force `:hover`, `:active` and `:focus-visible` in the test run, as it
// does in Storybook. The addon copies those rules to classes and puts the classes on the element
// stories render into. In Storybook it finds that element by its id, and copies the rules when a
// story has rendered. The test run renders into an element with no id and says nothing when a story
// has rendered, so both are done here.

import { STORY_RENDERED } from 'storybook/internal/core-events';
import { addons } from 'storybook/preview-api';
import { beforeEach } from 'vitest';

// The element stories render into. In Storybook it is `<div id="storybook-root">`.
document.body.id = 'storybook-root';

// Every stylesheet is loaded by now, and the addon skips rules it has already copied.
beforeEach(() => {
  addons.getChannel().emit(STORY_RENDERED);
});
