import { config as baseConfig } from '@repo/shared-configs/eslint/base';

export default [
  ...baseConfig,
  {
    // Written by Style Dictionary on every build.
    ignores: ['src/generated/**'],
  },
];
