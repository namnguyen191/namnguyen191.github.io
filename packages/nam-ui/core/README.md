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

> Every pairing the semantic tokens declare passes in both themes; the token build checks them and fails if one doesn't. The build outputs the light theme only for now; the dark output comes with step 11 of the palette process.

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
  color: var(--nam-text-on-primary);
  background: var(--nam-fill-primary);
}
```

Every token becomes a variable on `:root`, prefixed with `--nam-`. Colours are written as `oklch()` (for example `--nam-palette-purple-300: oklch(0.8400 0.0856 306.90)`); semantic and role tokens point at them with `var()`.

Per-file entry points exist too (`@nam-ui/core/css/semantic/text`, `@nam-ui/core/css/primitive/palette`, …). A single file only works when the files it references are also loaded: `semantic/text.css` contains `var(--nam-color-neutral-600)`, which is defined in `role/color.css`, which in turn points at `primitive/palette.css`. Import `@nam-ui/core/css` unless you know exactly which files you need; it also sets `color-scheme`, which the themes need (below).

### Light and dark themes

Every semantic colour carries both themes: `--nam-text-body: light-dark(var(--nam-color-neutral-800), var(--nam-color-neutral-200))`. The browser picks one by the [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) of the element using it.

- **Default: follow the OS.** `@nam-ui/core/css` sets `:root { color-scheme: light dark; }`.
- **Force a theme:** set `color-scheme: light` or `color-scheme: dark` on `<html>`.
- **Theme part of a page:** set `color-scheme` on any element, for example a dark card inside a light page. Everything inside it follows.

```css
html[data-user-theme='dark'] {
  color-scheme: dark; /* an app's own toggle; nam-ui only reads color-scheme */
}
```

Choosing a theme (a toggle, remembering the choice, a provider) belongs to the component libraries or the app. `light-dark()` needs browsers from mid-2024 (Chrome 123, Firefox 120, Safari 17.5); older browsers drop the colours entirely.

### SCSS variables

```scss
@use '@nam-ui/core/scss' as nam;

.button {
  color: nam.$text-on-primary;
  background: nam.$fill-primary;
  font-size: nam.$font-size-body-md;
}
```

Each SCSS variable is its CSS custom property: `nam.$text-body` compiles to `var(--nam-text-body)`. So SCSS styles follow the theme like CSS does, and the page must load `@nam-ui/core/css`. Sass colour functions (`darken()`, `mix()`, `rgba($color, 0.5)`) can't work on a `var()`; colours come from the tokens.

Per-file partials are available as `@nam-ui/core/scss/<tier>/<file>` (for example `@use '@nam-ui/core/scss/semantic/text'`). Each partial compiles on its own.

### JavaScript / TypeScript

```ts
import { TextBody, FillPrimary } from '@nam-ui/core';
// or one file at a time:
import { TextBody } from '@nam-ui/core/js/semantic/text';
```

Each token is a PascalCase constant holding its CSS custom property: `TextBody` is `'var(--nam-text-body)'`. CSS-in-JS styles and inline styles follow the theme without re-rendering; the page must load `@nam-ui/core/css`.

### Raw values (no CSS)

For places that can't use CSS variables (canvas charts, React Native, HTML email, design tools), `@nam-ui/core/raw` exports resolved values, one object per theme. Colours are hex, since these consumers often can't read `oklch()`.

```ts
import { light, dark } from '@nam-ui/core/raw';

const tokens = isDark ? dark : light;
context.fillStyle = tokens.TextBody; // '#3b4655' in light, '#d9dee7' in dark
```

The app decides which object to use. On the web, to read the value the page is currently showing, use `getComputedStyle(element).getPropertyValue('--nam-text-body')` instead, and read it again when the theme changes.

## How the tokens are organised

Tokens are split into three tiers. Each tier points only at the tier below it.

| Tier      | Source file(s)            | Example                                      | Purpose                                               |
| --------- | ------------------------- | -------------------------------------------- | ----------------------------------------------------- |
| Primitive | `tokens/primitive/*.json` | `palette.purple.600`, `font-size.md`         | Raw values: every colour and size the system has      |
| Role      | `tokens/role/color.json`  | `color.primary.600`, `color.error.100`       | Gives each palette a job (primary, neutral, error, …) |
| Semantic  | `tokens/semantic/*.json`  | `text.body`, `surface.error`, `border.focus` | What components use: a value for a specific purpose   |

**Components should only use semantic tokens.** Rebranding then means changing role mappings, and theming means changing semantic mappings, without touching component code.

Names across outputs:

| Token (JSON path) | CSS               | SCSS         | JS         |
| ----------------- | ----------------- | ------------ | ---------- |
| `text.body`       | `--nam-text-body` | `$text-body` | `TextBody` |

## Semantic token names

Every semantic token is named `category.meaning.state`, and each output joins the parts: `fill.primary.hover` is `--nam-fill-primary-hover` in CSS. The resting state has no suffix (`fill.primary`). The full list, with light and dark values and where each token is used, is in [`palette-selection-process.md`](./palette-selection-process.md#semantic-tokens-step-10).

**Categories: where the colour goes**

| Category  | Used for                                                                         | Contrast                                                        |
| --------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `surface` | Passive backgrounds: the page, cards, rows, banners                              | None of its own; foregrounds are checked against it             |
| `fill`    | A control's background: buttons, inputs                                          | None of its own; its `on-*` label is checked against it         |
| `text`    | Text                                                                             | 4.5:1                                                           |
| `icon`    | Icons                                                                            | 3:1                                                             |
| `border`  | Edges and lines: control borders, dividers, the focus ring, selection indicators | 3:1 when it identifies a control or state; none when decorative |

**Words that look similar but mean different things**

| Word                                     | Means                                                                                                      | Contrast                       | Examples                                                       |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------- |
| `primary` / `secondary` / `tertiary`     | Button emphasis only: filled lilac, brand outline, text-only. Never a text level or a second brand colour. | Per token                      | `fill.primary`, `text.on-secondary`, `border.secondary.subtle` |
| `heading` / `body` / `muted`             | Text emphasis, strongest to weakest.                                                                       | All meet 4.5:1                 | `text.heading`, `text.body`, `text.muted`                      |
| `muted`                                  | Lower emphasis but still read: helper text, captions, metadata, supporting icons.                          | Meets its category's threshold | `text.muted`, `icon.muted`                                     |
| `subtle`                                 | Decorative: carries no information on its own (dividers, card and banner edges).                           | None                           | `border.subtle`, `border.error.subtle`                         |
| `disabled`                               | Part of a disabled control. Always less prominent than the enabled version.                                | Exempt (WCAG)                  | `text.disabled`, `fill.disabled`, `border.disabled`            |
| `on-*`                                   | Content placed on that fill, and only there.                                                               | Checked against that fill      | `text.on-primary` on `fill.primary`                            |
| `error` / `warning` / `success` / `info` | A status. Always shown with an icon and a text label, never by colour alone.                               | Per token                      | `text.error`, `surface.error`, `fill.error`                    |
| `hover` / `pressed` / `selected`         | Interaction states. The resting state has no suffix.                                                       | Per token                      | `fill.primary.hover`, `surface.card.row-selected`              |
| `page` / `card`                          | The container a row sits in. Needed because the dark theme uses different steps in each.                   | n/a                            | `surface.page.row-hover`, `surface.card.row-hover`             |

Rules that follow from these words:

- **Pick a foreground by what it sits on.** Neutral surfaces and a status's own banner take `text.error`; the solid error button takes `text.on-error`.
- **`subtle` and `disabled` are the only exemptions.** A text, icon or border token without either word in its name has a contrast requirement, and the token build fails if it doesn't declare one (or if a `subtle` or `disabled` token does).

**Light and dark in one file.** `$value` holds the light theme. The dark value and the contrast pairings sit in the token's `$extensions`, under `nam-ui`:

```json
"body": {
  "$value": "{color.neutral.800}",
  "$description": "Body text, the default for content.",
  "$extensions": {
    "nam-ui": {
      "dark": "{color.neutral.200}",
      "contrast": { "min": 4.5, "on": ["surface.page", "surface.card"] }
    }
  }
}
```

`contrast.on` lists every background the token can sit on, by token name; the token build checks each one in both themes. Semantic tokens reference only the role tier (`color.*`).

## Adding or changing a token

1. Edit the JSON in `tokens/`. Files use the [Design Tokens (DTCG)](https://www.designtokens.org/) format: `$value` holds the value, `$type` the kind of token, and `{color.neutral.800}` references another token.
2. Rebuild the generated files:

   ```sh
   pnpm turbo run tokens --filter=@nam-ui/core
   ```

   This runs [Style Dictionary](https://styledictionary.com/) (configured in `style-dictionary.config.ts`) and writes CSS, SCSS and JS into `src/generated/`. Never edit `src/generated/` by hand; it is overwritten on every build.

3. The build in step 2 also checks the semantic colour tokens and fails on any problem. It checks each semantic token's shape (a dark value, role-tier references, the naming rule for `subtle` and `disabled`) and every contrast pairing it declares, in both themes. A new text, icon or border token lists the backgrounds it sits on in `$extensions` (see [Semantic token names](#semantic-token-names)).

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
