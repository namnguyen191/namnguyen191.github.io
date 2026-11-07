# nam-ui-react-storybook

Storybook for React components, built with [Vite](https://vite.dev) via `@storybook/react-vite`.

## Scripts

- `pnpm storybook` – start Storybook on http://localhost:6006
- `pnpm build-storybook` – build a static Storybook into `storybook-static/`
- `pnpm check-types` – type-check the project with `tsc -b`
- `pnpm lint` – lint with Oxlint

## Layout

- `.storybook/main.ts` – story globs, addons and framework
- `.storybook/preview.tsx` – global story parameters
- `src/stories/` – stories (`*.stories.ts`) and docs (`*.mdx`)
- `vite.config.ts` – Vite config reused by Storybook; also sets up running stories as Vitest browser tests (`@storybook/addon-vitest` + Playwright)
