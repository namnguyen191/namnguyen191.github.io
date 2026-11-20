# nam-ui-react-storybook

Storybook for React components, built with [Vite](https://vite.dev) via `@storybook/react-vite`.

## Scripts

- `pnpm dev` – start Storybook on http://localhost:6006
- `pnpm build` – build a static Storybook into `storybook-static/`
- `pnpm check-types` – type-check the project with `tsc -b`
- `pnpm lint` – lint with Oxlint
- `pnpm test` – run every story as a browser test: behaviour, accessibility, and a picture compared with its reference. Also measures which lines of `@nam-ui/react` ran, and fails if any didn't: test the line, or mark it `/* v8 ignore next -- <reason> */`
- `pnpm test:update` – the same run, but every picture that differs replaces its reference, and missing ones are drawn. Look at every new or changed picture before committing it

## Layout

- `src/main.ts` – story globs, addons and framework; turns on the experimental `.test()` syntax and hides those tests from the sidebar by default. The Storybook config lives in `src/`, not the usual `.storybook/`, so every Storybook command is given `-c ./src`
- `src/preview.tsx` – global story parameters; story files import it to build their `meta`
- `src/stories/` – stories (`*.stories.tsx`, written as `preview.meta(...)` and `meta.story(...)`) and docs (`*.mdx`). A story's tests are `Story.test(...)` calls in the same file; they can't live in another one
- `vite.config.ts` – Vite config reused by Storybook; also sets up running stories as Vitest browser tests (`@storybook/addon-vitest` + Playwright), pointing the plugin at `src/` for the Storybook config. There are three test projects: `storybook` runs every story and its tests in the light theme, `storybook-dark` renders each story once more in the dark theme to check colour contrast and take its picture there, and `nam-ui-react` runs `@nam-ui/react`'s own tests in Node (`*.test.ts(x)` next to the code, and the `*.test-d.tsx` type tests). `@nam-ui/react` has no test run of its own; everything runs here, so that one coverage report counts every test
- `src/pseudo-states.setup.ts` – lets stories force `:hover`, `:active` and `:focus-visible` in the test run (`globals: { pseudo: { hover: true } }`), as `storybook-addon-pseudo-states` does in Storybook itself
- `src/visual.setup.ts` – after a story has run, compares a picture of it with its reference picture. A picture with no reference is saved as its reference, also in CI, and the test fails once so that it gets looked at. A picture that doesn't match fails the test and is not replaced: what was drawn, and the difference, are saved in `.vitest/attachments/` (not committed), under the stories file's path, as `<picture>-actual-chromium-<os>.png` and `<picture>-diff-chromium-<os>.png`
- `__screenshots__/<environment>/` – the reference pictures, one per story, theme and browser, under the stories file's path (`__screenshots__/darwin/src/stories/components/Button.stories.tsx/`). The same story draws slightly different pixels on different operating systems, so each environment has its own set: the one named by `SCREENSHOT_ENV`, or else the operating system (`vite.config.ts`). Two sets are committed:
  - `darwin` – drawn on a Mac with `pnpm test:update`. This is the set to review closely: it is what the components should look like
  - `gh-action-ubuntu-24.04` – CI's. When one of its pictures is missing, CI draws it, fails, and uploads the `ci-reference-pictures` artifact: CI's whole set, with the new pictures in it. Download it, check each new picture against its `darwin` twin, then copy the set back with `cp -R ci-reference-pictures/. apps/nam-ui-react-storybook/__screenshots__/gh-action-ubuntu-24.04/` (it merges, and git shows only the new pictures; dragging the folder in Finder would replace it instead). A picture that doesn't match is a failure to look into, not to copy: the `failed-visual-tests` artifact has what CI drew (`<picture>-actual-…`) and the difference (`<picture>-diff-…`). In a pull request, a CI picture should change only together with its `darwin` twin, and look the same as it, or when CI moves to a new environment

  Any other machine (Linux, Windows) draws its own set on its first `pnpm test`, which fails once to say the pictures are new, and keeps it to itself (not committed)
