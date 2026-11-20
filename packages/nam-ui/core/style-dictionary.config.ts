import { readdirSync } from 'node:fs';
import path from 'node:path';

import StyleDictionary from 'style-dictionary';
import type { Config, Dictionary, FormatFn, TransformedToken } from 'style-dictionary/types';
import { fileHeader } from 'style-dictionary/utils';

import { isDtcgColor } from './src/scripts/shared/dtcg-color.ts';
import { verifyTokensAction } from './src/scripts/token_verification/verify-tokens.ts';

const buildPath = 'src/generated/';
const PREFIX = 'nam';

// Every tokens/**/*.json file becomes its own output file in each format,
// e.g. tokens/semantic/text.json → css/semantic/text.css, scss/semantic/_text.scss, js/semantic/text.js
const toModule = (file: string): string =>
  file
    .split(path.sep)
    .join('/')
    .replace(/\.json$/, '');

const modules = readdirSync('tokens', { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.json'))
  .map(toModule)
  .toSorted();

const moduleOf = (token: TransformedToken): string =>
  toModule(path.relative('tokens', token.filePath));

const inModule =
  (module: string) =>
  (token: TransformedToken): boolean =>
    moduleOf(token) === module;

const scssPartial = (module: string): string => {
  const { dir, base } = path.posix.parse(module);
  return path.posix.join(dir, `_${base}.scss`);
};

// A built-in transform group with one transform swapped. Fails if Style Dictionary changes the group,
// so the swap can't silently stop happening after an upgrade.
const swapTransform = (group: string, from: string, to: string | undefined): string[] => {
  const transforms = StyleDictionary.hooks.transformGroups[group];
  if (!transforms?.includes(from)) {
    throw new Error(`Style Dictionary's ${group} transform group no longer contains ${from}`);
  }
  const newTransforms = transforms.filter((name) => name !== from);
  return to ? [...newTransforms, to] : newTransforms;
};

// CSS writes colours as oklch() (the published format, step 2) with the built-in color/oklch, instead
// of as hex with color/css.
const cssTransforms = swapTransform('css', 'color/css', 'color/oklch');
// The raw export keeps colours as the palette's colour objects, so it can publish their own hex,
// and writes font stacks as CSS font-family strings (the js group leaves them as arrays).
const rawTransforms = [...swapTransform('js', 'color/hex', undefined), 'fontFamily/css'];

// A token's dark value from $extensions["nam-ui"].dark: as written on token.original, resolved on the
// token itself.
const darkOf = (extensions: unknown): unknown => {
  if (typeof extensions !== 'object' || extensions === null || !('nam-ui' in extensions)) {
    return undefined;
  }
  const namUi: unknown = extensions['nam-ui'];
  return typeof namUi === 'object' && namUi !== null && 'dark' in namUi ? namUi.dark : undefined;
};

// The CSS custom property a token is published as, named exactly as the css platform names it.
const nameKebab = StyleDictionary.hooks.transforms['name/kebab'];
if (!nameKebab) throw new Error("Style Dictionary's built-in name/kebab transform was not found");
const cssVariableOf = (token: TransformedToken): string =>
  `var(--${String(nameKebab.transform(token, { prefix: PREFIX }, {}))})`;

const commentOf = (token: TransformedToken): string =>
  token.$description ? ` // ${token.$description}` : '';

// References that point into other files are intended (CSS resolves them at runtime), so resolve them
// against every token instead of only this file's tokens. Otherwise Style Dictionary warns about
// "filtered out token references" on every build.
const withAllReferences = (dictionary: Dictionary): Dictionary => ({
  ...dictionary,
  tokens: dictionary.unfilteredTokens ?? dictionary.tokens,
});

// In CSS a token with a dark value becomes light-dark(light, dark), which picks one by the element's
// color-scheme. Written with both references, so outputReferences turns each into var(--nam-…).
const withBothThemes = (token: TransformedToken): TransformedToken => {
  const dark = darkOf(token.original.$extensions);
  if (dark === undefined) return token;
  const light: unknown = token.original.$value;
  if (typeof light !== 'string' || typeof dark !== 'string') {
    throw new Error(`${token.name}: expected references as its light and dark values`);
  }
  return { ...token, original: { ...token.original, $value: `light-dark(${light}, ${dark})` } };
};

// The built-in css/variables format (so options like `selector` keep working), with references to
// other files resolved via withAllReferences and both themes in every semantic colour.
const cssVariables = StyleDictionary.hooks.formats['css/variables'];
if (!cssVariables)
  throw new Error("Style Dictionary's built-in css/variables format was not found");
const cssModule: FormatFn = (args) => {
  const dictionary = withAllReferences(args.dictionary);
  return cssVariables({
    ...args,
    dictionary: { ...dictionary, allTokens: dictionary.allTokens.map(withBothThemes) },
  });
};

// SCSS and the main JS export point at the CSS custom properties instead of holding values, so they
// follow the theme the way CSS does (step 11). The page must load @nam-ui/core/css.
//   $text-body: var(--nam-text-body);
const scssModule: FormatFn = async ({ dictionary, file, options }) => {
  const lines = dictionary.allTokens.map(
    (token) => `$${token.name}: ${cssVariableOf(token)};${commentOf(token)}`
  );
  return `${await fileHeader({ file, commentStyle: 'short', options })}${lines.join('\n')}\n`;
};

//   export const TextBody = 'var(--nam-text-body)';
const jsModule: FormatFn = async ({ dictionary, file, options }) => {
  const lines = dictionary.allTokens.map(
    (token) =>
      `export const ${token.name} = ${JSON.stringify(cssVariableOf(token))};${commentOf(token)}`
  );
  return `${await fileHeader({ file, options })}${lines.join('\n')}\n`;
};

const jsModuleDeclarations: FormatFn = async ({ dictionary, file, options }) => {
  const lines = dictionary.allTokens.map(
    (token) => `export declare const ${token.name}: string;${commentOf(token)}`
  );
  return `${await fileHeader({ file, options })}${lines.join('\n')}\n`;
};

// @nam-ui/core/js/raw: resolved values for places without CSS (canvas, React Native, email, design
// tools), one object per theme for the app to pick at runtime. Colours are the palette's hex, the
// fallback for consumers that can't read oklch() (step 2).
const THEMES = ['light', 'dark'] as const;
type Theme = (typeof THEMES)[number];

const rawValueOf = (token: TransformedToken, theme: Theme): string | number => {
  const value: unknown =
    theme === 'dark' ? (darkOf(token.$extensions) ?? token.$value) : token.$value;
  const raw: unknown = isDtcgColor(value) ? value.hex : value;
  if (typeof raw !== 'string' && typeof raw !== 'number') {
    throw new Error(`${token.name}: no raw ${theme} value for ${JSON.stringify(value)}`);
  }
  return raw;
};

const rawThemes: FormatFn = async ({ dictionary, file, options }) => {
  const themeObject = (theme: Theme): string =>
    `export const ${theme} = {\n${dictionary.allTokens
      .map((token) => `  ${token.name}: ${JSON.stringify(rawValueOf(token, theme))},`)
      .join('\n')}\n};`;
  return `${await fileHeader({ file, options })}${THEMES.map(themeObject).join('\n\n')}\n`;
};

const rawDeclarations: FormatFn = async ({ dictionary, file, options }) => {
  const fields = dictionary.allTokens.map(
    (token) => `  readonly ${token.name}: ${typeof rawValueOf(token, 'light')};${commentOf(token)}`
  );
  const themes = THEMES.map((theme) => `export declare const ${theme}: Tokens;`).join('\n');
  return `${await fileHeader({ file, options })}export interface Tokens {\n${fields.join('\n')}\n}\n\n${themes}\n`;
};

// Index files that pull every module of a format together, followed by `extra` (after the imports,
// where CSS requires @import rules to come first).
const indexFormat =
  (commentStyle: 'short' | 'long', line: (module: string) => string, extra = ''): FormatFn =>
  async ({ file, options }) =>
    `${await fileHeader({ file, commentStyle, options })}${modules.map(line).join('\n')}\n${extra}`;

// light-dark() only switches when the page declares both schemes. Follow the OS by default; an app
// forces a theme by setting color-scheme: light or dark on <html>, or on any element to theme part
// of a page.
const COLOR_SCHEME = '\n:root {\n  color-scheme: light dark;\n}\n';

const config: Config = {
  source: ['tokens/**/*.json'],
  // Lists each broken reference by name instead of only counting them; a clean build prints nothing extra.
  log: { verbosity: 'verbose' },
  hooks: {
    actions: {
      'nam/verify-tokens': verifyTokensAction,
    },
    formats: {
      'nam/css-module': cssModule,
      'nam/scss-module': scssModule,
      'nam/js-module': jsModule,
      'nam/js-module-declarations': jsModuleDeclarations,
      'nam/js-raw': rawThemes,
      'nam/js-raw-declarations': rawDeclarations,
      'nam/css-index': indexFormat('long', (module) => `@import './${module}.css';`, COLOR_SCHEME),
      'nam/scss-index': indexFormat('short', (module) => `@forward './${module}';`),
      'nam/js-index': indexFormat('long', (module) => `export * from './${module}.js';`),
    },
  },
  platforms: {
    // Writes nothing: checks the semantic tokens and fails the build on any problem. No transforms,
    // so the check sees each colour as the palette's colour object rather than a CSS string.
    verify: {
      files: [],
      actions: ['nam/verify-tokens'],
    },
    css: {
      transforms: cssTransforms,
      prefix: PREFIX,
      buildPath: `${buildPath}css/`,
      files: [
        ...modules.map((module) => ({
          destination: `${module}.css`,
          format: 'nam/css-module',
          filter: inModule(module),
          options: { outputReferences: true },
        })),
        { destination: 'index.css', format: 'nam/css-index' },
      ],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: `${buildPath}scss/`,
      files: [
        ...modules.map((module) => ({
          destination: scssPartial(module),
          format: 'nam/scss-module',
          filter: inModule(module),
        })),
        { destination: '_index.scss', format: 'nam/scss-index' },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: `${buildPath}js/`,
      files: [
        ...modules.flatMap((module) => [
          { destination: `${module}.js`, format: 'nam/js-module', filter: inModule(module) },
          {
            destination: `${module}.d.ts`,
            format: 'nam/js-module-declarations',
            filter: inModule(module),
          },
        ]),
        { destination: 'index.js', format: 'nam/js-index' },
        { destination: 'index.d.ts', format: 'nam/js-index' },
      ],
    },
    raw: {
      transforms: rawTransforms,
      buildPath: `${buildPath}js/`,
      files: [
        { destination: 'raw.js', format: 'nam/js-raw' },
        { destination: 'raw.d.ts', format: 'nam/js-raw-declarations' },
      ],
    },
  },
};

export default config;
