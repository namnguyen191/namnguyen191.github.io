# `@repo/shared-configs`

Shared configuration for the repository: oxlint configs (`oxlint/`), the ESLint config for Angular only (`eslint/`), and the TypeScript base configs (`typescript/`).

## TypeScript configs

Import them with `"extends": "@repo/shared-configs/typescript/<name>"`.

- `base`: strict defaults for ES2023. No DOM lib and no `@types/*`, so DOM or Node globals have to be opted into.
- `browser_base`: `base` plus the DOM libs.
- `react_base` and `angular_base`: `browser_base` plus framework settings.
- `node_base`: TypeScript that runs on Node, such as `vite.config.ts` and scripts. Adds Node types and `noEmit`.
- `vitest_base`: `node_base` plus Vitest types and the usual test and Vite config globs.

Conventions:

- In a package with more than one tsconfig, `tsconfig.json` is a pure solution file: `"files": []` and `references` only, with no `extends` and no compiler options. Nothing inherits from it. A package with a single project (`mcp-example`, `youtube-resume`) keeps its options directly in `tsconfig.json`.
- Every referenced config (`tsconfig.lib.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.spec.json`) extends one of the shared bases directly.
- `extends` replaces array options such as `lib`, `types` and `include` instead of merging them. If a config overrides one, it has to list every entry it wants.
- Paths inside a shared base (`include`, `outDir`, `tsBuildInfoFile`) resolve relative to the shared file unless they start with `${configDir}`, which makes them relative to the config that extends it.
- Build info caches (`*.tsbuildinfo`) go in `${configDir}/node_modules/.tmp/`, never in `dist`, so they are not published. If incremental type checking ever reports stale errors, run `pnpm clean:tsbuildinfo` from the repo root and check again.
