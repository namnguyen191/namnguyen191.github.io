# nam-ui-react-storybook

Storybook for React components, built with [Vite](https://vite.dev) via `@storybook/react-vite`.

## Scripts

- `pnpm dev` – start Storybook on http://localhost:6006
- `pnpm build` – build a static Storybook into `storybook-static/`
- `pnpm check-types` – type-check the project with `tsc -b`
- `pnpm lint` – lint with Oxlint
- `pnpm test` – run every story as a browser test: behaviour, accessibility, and a picture compared with its reference. Also measures which lines of `@nam-ui/react` ran, and fails if any didn't: test the line, or mark it `/* v8 ignore next -- <reason> */`
- `pnpm test:update` – the same run, but every picture that differs replaces its reference. Look at the changed pictures before committing them

## Layout

- `src/main.ts` – story globs, addons and framework; turns on the experimental `.test()` syntax and hides those tests from the sidebar by default. The Storybook config lives in `src/`, not the usual `.storybook/`, so every Storybook command is given `-c ./src`
- `src/preview.tsx` – global story parameters; story files import it to build their `meta`
- `src/stories/` – stories (`*.stories.tsx`, written as `preview.meta(...)` and `meta.story(...)`) and docs (`*.mdx`). A story's tests are `Story.test(...)` calls in the same file; they can't live in another one
- `vite.config.ts` – Vite config reused by Storybook; also sets up running stories as Vitest browser tests (`@storybook/addon-vitest` + Playwright), pointing the plugin at `src/` for the Storybook config. There are three test projects: `storybook` runs every story and its tests in the light theme, `storybook-dark` renders each story once more in the dark theme to check colour contrast and take its picture there, and `nam-ui-react` runs `@nam-ui/react`'s own tests in Node (`*.test.ts(x)` next to the code, and the `*.test-d.tsx` type tests). `@nam-ui/react` has no test run of its own; everything runs here, so that one coverage report counts every test
- `src/pseudo-states.setup.ts` – lets stories force `:hover`, `:active` and `:focus-visible` in the test run (`parameters: { pseudo: { hover: true } }`), as `storybook-addon-pseudo-states` does in Storybook itself
- `src/visual.setup.ts` – after a story has run, compares a picture of it with its reference picture. Used by the test projects only, and not in CI
- `src/stories/**/__screenshots__/` – the reference pictures, committed: one per story, theme, browser and operating system. A picture that doesn't match fails the test, and what was rendered is written to `.vitest/` (not committed) with a picture of the difference
