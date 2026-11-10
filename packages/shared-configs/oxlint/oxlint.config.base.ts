import { defineConfig } from 'oxlint';

/**
 * Shared oxlint base configuration for the repository.
 *
 * oxlint uses the nearest config file and does not merge parent folders, so every project has its
 * own `oxlint.config.ts` that re-exports or spreads this object. Spread rather than `extends`:
 * `ignorePatterns` and override globs are rooted at the folder of the file that declares them, and
 * spreading declares them in the project's own file. A spread replaces top-level keys instead of
 * merging them, so a project that changes `rules` or `overrides` must spread the base value inside
 * its own.
 *
 * The rule set is every oxlint category except `pedantic` and `nursery`, for the plugins below.
 * Rules that do not fit this repo are switched off under `rules`, and a few `pedantic` rules from
 * the old ESLint setup and the rules that need options are listed there too. Which rules belong to
 * a category can change between oxlint versions, so `oxlint` stays pinned and its changelog is read
 * before an upgrade.
 *
 * No `options` here on purpose. Oxlint only accepts `options.typeAware`, `options.typeCheck` and
 * `options.maxWarnings` in the root config, and the VS Code extension treats the workspace folder
 * as the root, so in the editor every package config is a nested one and setting them there is an
 * error. The `lint` script passes `--type-aware --max-warnings 0` instead, and
 * `.vscode/settings.json` sets `"oxc.typeAware": true` for the editor.
 *
 */
export const config = defineConfig({
  plugins: ['unicorn', 'typescript', 'import', 'oxc'],
  categories: {
    correctness: 'error',
    perf: 'error',
    restriction: 'error',
    style: 'error',
    suspicious: 'error',
  },
  env: {
    builtin: true,
    es2026: true,
    node: true,
  },
  ignorePatterns: ['dist/**', 'coverage/**', '**/node_modules', 'generated/**'],
  rules: {
    // Pedantic starts
    'no-array-constructor': 'error',
    'no-case-declarations': 'error',
    'no-fallthrough': 'error',
    'no-prototype-builtins': 'error',
    'typescript/ban-ts-comment': 'error',
    'typescript/no-unsafe-function-type': 'error',
    // Pedantic ends
    'import/no-cycle': ['error', { maxDepth: 100 }],
    'max-statements': ['error', { max: 50 }],
    'no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'no-void': 'off',
    'oxc/no-async-await': 'off',
    'import/no-default-export': 'off',
    'typescript/promise-function-async': 'off',
    'no-undefined': 'off',
    'no-plusplus': 'off',
    'unicorn/no-array-for-each': 'off',
    'oxc/no-optional-chaining': 'off',
    'oxc/no-rest-spread-properties': 'off',
    'unicorn/import-style': 'off',
    'unicorn/no-array-reduce': 'off',
    // Already included in explicit-function-return-type
    'typescript/explicit-module-boundary-types': 'off',
    'unicorn/require-module-specifiers': 'off',
    'import/no-unassigned-import': 'off',
    'no-underscore-dangle': 'off',
    'typescript/dot-notation': 'off',
    'init-declarations': 'off',
    'unicorn/prefer-export-from': 'off',
    'one-var': 'off',
    'func-style': 'off',
    'sort-keys': 'off',
    // already handled by oxfmt
    'sort-imports': 'off',
    'import/no-nodejs-modules': 'off',
    'import/prefer-default-export': 'off',
    'import/no-named-export': 'off',
    'no-continue': 'off',
    'unicorn/no-null': 'off',
    'import/group-exports': 'off',
    'prefer-named-capture-group': 'off',
    'new-cap': 'off',
    'id-length': 'off',
    'capitalized-comments': 'off',
    'import/exports-last': 'off',
    'unicorn/filename-case': 'off',
    'no-ternary': 'off',
    curly: 'off',
    'typescript/consistent-indexed-object-style': 'off',
    'import/consistent-type-specifier-style': 'off',
  },
});
