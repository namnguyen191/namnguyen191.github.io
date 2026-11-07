import angular from 'angular-eslint';
import { defineConfig } from 'eslint/config';

/**
 * ESLint configuration for Angular projects. Oxlint lints the TypeScript with the shared base, so
 * ESLint only runs what oxlint cannot: the `angular-eslint` rules and the Angular template (and
 * inline template) rules. None of these rules exist in oxlint, so no rule is reported twice.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const angularBaseConfig = defineConfig(
  {
    ignores: ['dist/**', '**/node_modules'],
  },
  {
    files: ['**/*.ts'],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/attributes-order': [
        'error',
        {
          alphabetical: true,
        },
      ],
    },
  }
);
