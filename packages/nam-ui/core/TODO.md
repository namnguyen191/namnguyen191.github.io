# @nam-ui/core — TODO

Remaining work on the core package (tokens and framework-agnostic styles), roughly in priority order.
Tokens live in `tokens/**/*.json` (source of truth) and are built by Style Dictionary
(`pnpm run tokens`) into `src/generated/`.

## 0. Housekeeping

- [ ] Run `pnpm install` at the repo root (adds `style-dictionary`, re-links the package at its new path), then `pnpm turbo run build test lint --filter=@nam-ui/core` (Turbo runs the `tokens` task first; plain `pnpm build` inside the package only works once `src/generated/` exists).
- [ ] Create the free npm organization `nam-ui` on npmjs.com before the first publish (the scope is unclaimed today).
- [ ] Delete `.npmignore`: `"files": ["dist"]` in `package.json` already controls what gets published.
- [ ] Add a changeset for the first release (`pnpm changeset`).
- [ ] When a second package is added, set `"fixed": [["@nam-ui/*"]]` in `.changeset/config.json` so versions move in lockstep.
- [ ] Write a README: install, the entry points (`@nam-ui/core`, `/css`, `/scss`, plus per-file `/js/*`, `/css/*`, `/scss/*`), how to add or change a token. Note that a single CSS file only works when the files it references are loaded too (import `/css` unless you know what you need).
- [ ] Add tests back (removed for now): the SCSS entry compiles, CSS keeps its `var()` references, JS exports resolve. Until then `vitest run` fails with "No test files found" (or add `--passWithNoTests`).

## 1. Color palettes (`tokens/primitive/color.json`)

- [ ] Rebuild every ramp in OKLCH with fixed lightness targets per step, so the same step number means the same lightness/contrast in every hue (today step 500 ranges from L\*24 for mazarine to L\*80 for lilac).
- [ ] Move to 11 steps (`50`–`950`) and replace the `default` step with `500` (`color.primary.default` → `color.primary.500`), so ramps can be looped over.
- [ ] Give the brand primary a dark end: even `palette.lilac.800` is only 2.8:1 on white. Pick a saturated purple whose 600–700 steps reach ≥ 4.5:1 with white; keep lilac for tints/surfaces.
- [ ] Spread out the lilac ramp: steps 100/200 are 1.1:1 vs 1.2:1 on white (indistinguishable), which also makes the `action.hover` states (one step darker) invisible.
- [ ] Add near-white neutrals (the lightest grey today is `#d6d8db`, L\*86) for subtle backgrounds, stripes and hover rows.
- [ ] Rename primitives by hue (`blue`, `navy`, `slate`, `teal`, `cyan`…) instead of color-site names (good-samaritan, dupain, mazarine, middle-blue, wizard-grey).
- [ ] Remove or assign a role to the unused palettes: `turquoise`, `good-samaritan`, `dupain`.
- [ ] Add an automated contrast test (WCAG 2.2) over every semantic text/background, icon/background and border/background pair, so a palette change can't silently break accessibility.

## 2. Accessibility failures to fix (current values)

| Pairing                                                          | Contrast | Needed |
| ---------------------------------------------------------------- | -------- | ------ |
| `text.action.default` (lilac-500 on white)                       | 1.68     | 4.5    |
| `text.on-action` (white on lilac-500), i.e. every primary button | 1.68     | 4.5    |
| `border.focus` (lilac-500 on white)                              | 1.68     | 3.0    |
| `text.warning` (amber-500 on white)                              | 1.77     | 4.5    |
| `text.info` (middle-blue-500 on white)                           | 1.81     | 4.5    |
| `text.success` (green-500 on white)                              | 2.67     | 4.5    |
| `text.error` (red-500 on white)                                  | 4.16     | 4.5    |
| `border.default` (grey-200 on white), i.e. input outlines        | 2.11     | 3.0    |
| Warning text on warning surface                                  | 1.58     | 4.5    |
| Info text on info surface                                        | 1.63     | 4.5    |
| `icon.warning` / `icon.info` on white                            | 1.8      | 3.0    |

- [ ] Fix the disabled inversions: `border.disabled` (3.3:1) is stronger than the enabled `border.default` (2.1:1), and `text.on-disabled` (7.9:1, the heading colour) is far stronger than an enabled primary button label (1.68:1).

## 3. Semantic tokens (`tokens/semantic/*.json`)

- [ ] `border.secondary` currently points at the _primary_ brand colour (`color.primary.default`). Rename it or fix it.
- [ ] `border.secondary`, `border.action.default` and `border.focus` share one value. Decide whether they are really distinct roles; if so, give them distinct values.
- [ ] Fill the gaps so every category covers the same roles:
  - [ ] text: `secondary`, `link`, `link-visited`, `inverse`
  - [ ] icon: `disabled`, `action`, `on-action`, `inverse`
  - [ ] surface: `secondary`, `subtle`, `inverse`, `overlay` / `scrim`
- [ ] Interaction states: `pressed`/`active`, `selected`, and a dedicated `focus-ring` token separate from borders.
- [ ] On-colour tokens for solid status backgrounds: `text.on-error`, `text.on-success`, `text.on-warning`, `text.on-info`.

## 4. Theming

- [ ] Add a dark theme: a second set of semantic token files that points at different primitives, built into `[data-theme="dark"]` (plus a `prefers-color-scheme` variant) alongside `:root` in `tokens.css`.
- [ ] Lay out the theme files: `tokens/primitive`, `role` and `semantic` stay the light (default) theme; dark overrides go in `tokens/themes/dark/semantic/*.json` with the same token paths, containing only the tokens that change. Update `style-dictionary.config.ts` so `themes/*` files build into the `[data-theme="dark"]` CSS (`selector` option of the CSS format) and the `dark` raw object, instead of becoming their own modules (today every JSON file becomes its own output file).
- [ ] Decide how SCSS users get runtime theming: either the semantic SCSS variables output `var(--nam-…)` instead of hex, or document that SCSS = build-time values only and CSS variables = themeable values.
- [ ] Consider `!default` on the generated SCSS variables (Style Dictionary `themeable: true`) so consumers can override them with `@use … with (…)`.
- [ ] Make the main JS export theme-aware: `@nam-ui/core` and `@nam-ui/core/js/*` export CSS variable references (`TextBody = 'var(--nam-text-body)'`) instead of values, so CSS-in-JS styles follow the active theme without re-rendering. Generate them from the CSS output's names so the two can't drift; apps must load `@nam-ui/core/css`.
- [ ] Move resolved values to a raw export for places without CSS (canvas, charts, emails, React Native): `@nam-ui/core/raw` exporting one object per theme (`{ light, dark }`), not split per file, because apps choose the object at runtime (`isDark ? dark : light`). Ship `{ light }` until the dark theme exists.
- [ ] Decide these JS export names before the first publish: changing what `@nam-ui/core` returns afterwards is a breaking change.
- [ ] Document reading live values on the web (canvas, charts): `getComputedStyle(document.documentElement).getPropertyValue('--nam-text-body')` returns the active theme's value; redraw when the theme changes.

## 5. Typography (`tokens/primitive/font-size.json`, `tokens/primitive/line-height.json`, `tokens/semantic/typography.json`)

- [ ] `font-size.body.sm` is 12px while 14px (`font-size.sm`) goes unused. 12px is too small for body text; use 14px.
- [ ] `font-size.heading.h6` equals `font-size.body.lg` (both 20px). Separate them or document that weight carries the hierarchy.
- [ ] Line height per size instead of one value for all headings (`1.25` from 20px to 60px); large display text wants about 1.1. Remove the unused line heights (`tight`, `relaxed`, `loose`) or use them.
- [ ] Add font family, font weight and letter-spacing tokens.
- [ ] Add composite text styles (display / headline / title / body / label, with size + line height + weight + tracking) and a `type-style` Sass mixin.
- [ ] Either add real responsive/fluid sizes (`clamp()`, per-breakpoint values) or drop the "responsive" idea.
- [ ] Document the type scale's ratio (today's steps grow ×1.14–1.33 irregularly).

## 6. Missing token categories

- [ ] Spacing (do this first, together with radius)
- [ ] Corner radius
- [ ] Elevation / shadows
- [ ] Border widths
- [ ] Motion: durations and easing curves
- [ ] Z-index layers
- [ ] Breakpoints
- [ ] Opacity
- [ ] Sizing (icon sizes, control heights)

## 7. Sass helpers (`src/scss/`)

- [ ] `breakpoint()` media-query mixin (built on the breakpoint tokens)
- [ ] `type-style()` mixin (built on the composite text styles)
- [ ] `focus-ring` mixin
- [ ] `visually-hidden` mixin
- [ ] `theme()` mixin that emits the CSS custom properties, for apps that want to scope a theme to a subtree

## 8. Base CSS and other exports

- [ ] A reset/normalize stylesheet (`@nam-ui/core/css/reset`).
- [ ] `@font-face` declarations if the system ships its own fonts.
- [ ] Export the raw DTCG JSON (`@nam-ui/core/tokens.json`) for tooling (Figma, docs, linters).
- [ ] Decide whether component styles (`.nam-button`, …) live in core (one source of truth shared by React and Angular, class names become public API) or in each framework package.

## Done

- [x] Fix the `_surface.scss` compile error.
- [x] Ship the tokens in the package: `files`, `exports` (`.`, `./css`, `./scss`), Sass entry point, `sideEffects`.
- [x] Rename the package to `@nam-ui/core`, move it to `packages/nam-ui/core`, and add `packages/nam-ui/*` to the workspace.
- [x] Move the tokens to Style Dictionary (JSON source → CSS variables, SCSS, JS/TS), keeping the existing token names.
- [x] Consistent `info` naming across categories (was `info` / `information`).
- [x] Split the generated CSS, SCSS and JS into one file per token file, each format with an index.
- [x] Organise token files by tier everywhere (typography scales in `primitive/`, body/heading in `semantic/`) and namespace the lower tiers: `palette.*` for primitives (`primitive/palette.json`), `color.*` for role colours (`role/color.json`, formerly `alias/`).
- [x] Semantic naming: `default` instead of `primary` for main variants (`border.default`, `icon.default`, `surface.default`), nested states (`action.default` / `action.hover`), `text.heading`.
