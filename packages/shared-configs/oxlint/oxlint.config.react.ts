import { defineConfig } from 'oxlint';

import { config as baseConfig } from './oxlint.config.base.ts';

export const config = defineConfig({
  ...baseConfig,
  plugins: [...(baseConfig.plugins ?? []), 'react', 'jsx-a11y'],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      env: {
        es2020: true,
        browser: true,
      },
      rules: {
        // Pedantic starts
        'react/rules-of-hooks': 'error',
        // Pedantic ends
        'react/jsx-filename-extension': ['error', { extensions: ['jsx', 'tsx'] }],
        'react/jsx-max-depth': ['error', { max: 5 }],
        'react/no-multi-comp': 'off',
        'react/forbid-component-props': 'off',
        'react/function-component-definition': 'off',
        'react/jsx-curly-brace-presence': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/react-in-jsx-scope': 'off',
        // Conflict with exhaustive-deps
        'react/exhaustive-effect-dependencies': 'off',
        'react/only-export-components': ['error', { allowConstantExport: true }],
      },
    },
  ],
});
