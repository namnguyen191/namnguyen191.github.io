import { config as baseConfig } from '@repo/shared-configs/oxlint/base';
import { defineConfig } from 'oxlint';

/**
 * Oxlint configuration for the Angular workspace: the shared base plus two Angular exceptions.
 * A spread replaces top-level keys, so `rules` spreads the base rules first.
 */
export default defineConfig({
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    // Pipes (`transform`), guards and lifecycle hooks are instance methods by design, and often do
    // not use `this`.
    'class-methods-use-this': 'off',
    // `@NgModule` classes are empty on purpose. A class with no decorator is still reported.
    'typescript/no-extraneous-class': ['error', { allowWithDecorator: true }],
  },
});
