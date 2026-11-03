# @nam-ui/core

Design tokens for the nam-ui design system: colours and typography, defined once as JSON and built into CSS custom properties, SCSS variables and JS/TS constants. Framework-agnostic; the React and Angular packages build on it.

> **Status:** pre-release (`0.0.0`, not published yet). The colour palette is being rebuilt to meet the accessibility standard below; see [`palette-selection-process.md`](./palette-selection-process.md). Token names and values may change before `1.0`.

## Accessibility standard

**Every semantic colour pairing in nam-ui meets [WCAG 2.2](https://www.w3.org/TR/WCAG22/) level AA.**

| Pairing                                                                                                      | Minimum contrast | WCAG criterion |
| ------------------------------------------------------------------------------------------------------------ | ---------------- | -------------- |
| Normal text on its background                                                                                | 4.5:1            | 1.4.3          |
| Large text (≥ 24px, or ≥ 18.66px bold)                                                                       | 3:1              | 1.4.3          |
| UI that identifies a control or its state (input borders without a fill, meaningful icons, focus indicators) | 3:1              | 1.4.11         |

- **Body text aims higher:** 7:1 (AAA), since a dark neutral reaches it easily.
- **Exempt:** decorative colours, logos and disabled controls. Disabled states must still look less prominent than enabled ones.
- **No rounding up:** 4.49:1 fails.
- **Scope:** this standard covers the colour tokens. Other accessibility work (keyboard support, screen-reader semantics, focus management) belongs to the component packages.

Colour ramps are designed in OKLCH and every pairing is checked with the WCAG 2.2 contrast ratio. The reasoning is recorded in [`palette-selection-process.md`](./palette-selection-process.md).

> The current palette does **not** meet this standard yet. The failing pairings are listed in [`TODO.md`](./TODO.md) section 2.

## Install

```sh
pnpm add @nam-ui/core
```

Inside this monorepo, use the workspace version instead:

```json
{ "dependencies": { "@nam-ui/core": "workspace:*" } }
```

## Usage

### CSS custom properties

```css
@import '@nam-ui/core/css';

.button {
  color: var(--nam-text-on-action);
  background: var(--nam-surface-action-default);
}
```

Every token becomes a variable on `:root`, prefixed with `--nam-`.

Per-file entry points exist too (`@nam-ui/core/css/semantic/text`, `@nam-ui/core/css/primitive/palette`, …). A single file only works when the files it references are also loaded: `semantic/text.css` contains `var(--nam-color-neutral-600)`, which is defined in `role/color.css`, which in turn points at `primitive/palette.css`. Import `@nam-ui/core/css` unless you know exactly which files you need.

### SCSS variables

```scss
@use '@nam-ui/core/scss' as nam;

.button {
  color: nam.$text-on-action;
  background: nam.$surface-action-default;
  font-size: nam.$font-size-body-md;
}
```

SCSS variables hold resolved values at build time, so they don't follow runtime theming. Use the CSS custom properties where values need to change at runtime (for example, a future dark theme).

Per-file partials are available as `@nam-ui/core/scss/<tier>/<file>` (for example `@use '@nam-ui/core/scss/semantic/text'`). Each partial `@use`s the files it depends on, so it compiles on its own.

### JavaScript / TypeScript

```ts
import { TextBody, SurfaceActionDefault } from '@nam-ui/core';
// or one file at a time:
import { TextBody } from '@nam-ui/core/js/semantic/text';
```

Tokens are exported as PascalCase constants holding resolved values (for example `TextBody` is a hex string).

## How the tokens are organised

Tokens are split into three tiers. Each tier points only at the tier below it.

| Tier      | Source file(s)            | Example                                      | Purpose                                               |
| --------- | ------------------------- | -------------------------------------------- | ----------------------------------------------------- |
| Primitive | `tokens/primitive/*.json` | `palette.lilac.500`, `font-size.md`          | Raw values: every colour and size the system has      |
| Role      | `tokens/role/color.json`  | `color.primary.600`, `color.error.100`       | Gives each palette a job (primary, neutral, error, …) |
| Semantic  | `tokens/semantic/*.json`  | `text.body`, `surface.error`, `border.focus` | What components use: a value for a specific purpose   |

**Components should only use semantic tokens.** Rebranding then means changing role mappings, and theming means changing semantic mappings, without touching component code.

Names across outputs:

| Token (JSON path) | CSS               | SCSS         | JS         |
| ----------------- | ----------------- | ------------ | ---------- |
| `text.body`       | `--nam-text-body` | `$text-body` | `TextBody` |

## Adding or changing a token

1. Edit the JSON in `tokens/`. Files use the [Design Tokens (DTCG)](https://www.designtokens.org/) format: `$value` holds the value, `$type` the kind of token, and `{palette.lilac.500}` references another token.
2. Rebuild the generated files:

   ```sh
   pnpm turbo run tokens --filter=@nam-ui/core
   ```

   This runs [Style Dictionary](https://styledictionary.com/) (configured in `style-dictionary.config.ts`) and writes CSS, SCSS and JS into `src/generated/`. Never edit `src/generated/` by hand; it is overwritten on every build.

3. For colour changes, check every affected pairing against the [accessibility standard](#accessibility-standard).

A new JSON file in `tokens/` automatically becomes its own output file in every format and is added to the index files.

## Development

From the repository root:

```sh
pnpm install
pnpm turbo run build test lint --filter=@nam-ui/core
```

Turbo runs the `tokens` task before `build`, `test` and `lint`. Running `pnpm build` inside the package only works once `src/generated/` exists.

## Further reading

- [`palette-selection-process.md`](./palette-selection-process.md): the step-by-step process for rebuilding the colour palette, with a glossary and a decisions log.
- [`TODO.md`](./TODO.md): remaining work on this package.
