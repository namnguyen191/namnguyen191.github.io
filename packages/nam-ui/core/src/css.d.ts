// Types for the CSS entry points, `@nam-ui/core/css` and `@nam-ui/core/css/*`.
//
// Importing a stylesheet only has a side effect and exports nothing, so an empty module is the
// whole contract. Without it, TypeScript has nothing to resolve for these specifiers and a
// consumer using `noUncheckedSideEffectImports` fails with TS2882. The `types` condition on the
// `./css` and `./css/*` exports points here, and the build copies this file to `dist/types/`.
export {};
