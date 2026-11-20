// `lint:affected` lints every package the change affects, not only the staged files: a type-aware
// rule can find a new error in a file that didn't change. `package.json` counts too, because the
// package checks in `@nam-ui/react`'s lint read its `exports`. The tests run on push
// (.husky/pre-push) and in CI.
const config = {
  '{apps,packages,angular-workspace}/**/{*.{js,jsx,ts,tsx},package.json}': [
    (_files) => 'pnpm lint:affected',
  ],
  '{apps,packages,angular-workspace}/**/*.{js,ts,jsx,tsx,json,html,css,scss}': [
    (files) => `pnpm format ${files.join(' ')}`,
  ],
};

export default config;
