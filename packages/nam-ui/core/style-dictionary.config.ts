import { readdirSync } from 'node:fs';
import path from 'node:path';

import StyleDictionary from 'style-dictionary';
import type {
  Config,
  Dictionary,
  FormatFn,
  LocalOptions,
  TransformedToken,
} from 'style-dictionary/types';
import {
  fileHeader,
  formattedVariables,
  getReferences,
  sortByReference,
} from 'style-dictionary/utils';

const buildPath = 'src/generated/';

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
  .sort();

const moduleOf = (token: TransformedToken): string =>
  toModule(path.relative('tokens', token.filePath));

const inModule =
  (module: string) =>
  (token: TransformedToken): boolean =>
    moduleOf(token) === module;

// References that point into other files are intended (CSS resolves them at runtime, SCSS files @use
// and JS files import them), so resolve them against every token instead of only this file's tokens.
// Otherwise Style Dictionary warns about "filtered out token references" on every build.
const withAllReferences = (dictionary: Dictionary): Dictionary => ({
  ...dictionary,
  tokens: dictionary.unfilteredTokens ?? dictionary.tokens,
});

// The module a generated file belongs to (e.g. 'semantic/text'), passed in as `options.module`.
const moduleOption = ({ module }: LocalOptions): string => {
  if (typeof module !== 'string') throw new Error('Expected a string `options.module`');
  return module;
};

const scssPartial = (module: string): string => {
  const { dir, base } = path.posix.parse(module);
  return path.posix.join(dir, `_${base}.scss`);
};

// Like the built-in scss/variables format, plus `@use` lines for the other files this file
// references, so `$text-body: $neutral-600;` compiles on its own.
const scssModule: FormatFn = async ({ dictionary, file, options }) => {
  const self = moduleOption(options);
  const dependencies = new Set<string>();
  for (const token of dictionary.allTokens) {
    const refs = getReferences(token.original.$value, withAllReferences(dictionary).tokens, {
      usesDtcg: true,
    });
    for (const ref of refs) {
      if (moduleOf(ref) !== self) dependencies.add(moduleOf(ref));
    }
  }
  const uses = [...dependencies]
    .sort()
    .map((dep) => `@use '${path.posix.relative(path.posix.dirname(self), dep)}' as *;`)
    .join('\n');

  const header = await fileHeader({ file, commentStyle: 'short', options });
  const variables = formattedVariables({
    format: 'sass',
    dictionary: withAllReferences(dictionary),
    outputReferences: true,
    usesDtcg: true,
  });
  return `${header}${uses ? `${uses}\n\n` : ''}${variables}\n`;
};

// The built-in css/variables format (so options like `selector` keep working), with references to
// other files resolved via withAllReferences.
const cssVariables = StyleDictionary.hooks.formats['css/variables'];
if (!cssVariables)
  throw new Error("Style Dictionary's built-in css/variables format was not found");
const cssModule: FormatFn = (args) =>
  cssVariables({ ...args, dictionary: withAllReferences(args.dictionary) });

// Like the built-in javascript/es6 format, but a token that points at another token is exported as a
// link to it (`export const TextBody = Neutral600;`), importing it when it lives in another file.
const jsModule: FormatFn = async ({ dictionary, file, options }) => {
  const self = moduleOption(options);
  const everyToken = withAllReferences(dictionary).tokens;
  const imports = new Map<string, Set<string>>();

  const exports = [...dictionary.allTokens]
    .sort(sortByReference(everyToken, { usesDtcg: true }))
    .map((token) => {
      // Only a value that is exactly one reference, like "{neutral.600}", becomes a link.
      const original: unknown = token.original.$value;
      const [ref, ...otherRefs] =
        typeof original === 'string' ? getReferences(original, everyToken, { usesDtcg: true }) : [];
      const isLink =
        ref !== undefined &&
        otherRefs.length === 0 &&
        typeof original === 'string' &&
        original.trim() === `{${ref.path.join('.')}}`;

      let value = JSON.stringify(token.$value);
      if (isLink) {
        value = ref.name;
        const module = moduleOf(ref);
        if (module !== self) imports.set(module, (imports.get(module) ?? new Set()).add(ref.name));
      }
      const comment = token.$description ? ` // ${token.$description}` : '';
      return `export const ${token.name} = ${value};${comment}`;
    });

  const importLines = [...imports]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([module, names]) => {
      const relative = path.posix.relative(path.posix.dirname(self), module);
      const from = `${relative.startsWith('.') ? relative : `./${relative}`}.js`;
      const list = [...names].sort();
      const oneLine = `import { ${list.join(', ')} } from '${from}';`;
      return oneLine.length <= 100
        ? oneLine
        : `import {\n${list.map((name) => `  ${name},`).join('\n')}\n} from '${from}';`;
    });

  const header = await fileHeader({ file, options });
  return `${header}${importLines.length ? `${importLines.join('\n')}\n\n` : ''}${exports.join('\n')}\n`;
};

// Index files that pull every module of a format together.
const indexFormat =
  (commentStyle: 'short' | 'long', line: (module: string) => string): FormatFn =>
  async ({ file, options }) =>
    `${await fileHeader({ file, commentStyle, options })}${modules.map(line).join('\n')}\n`;

const config: Config = {
  source: ['tokens/**/*.json'],
  hooks: {
    formats: {
      'nam/css-module': cssModule,
      'nam/scss-module': scssModule,
      'nam/js-module': jsModule,
      'nam/css-index': indexFormat('long', (module) => `@import './${module}.css';`),
      'nam/scss-index': indexFormat('short', (module) => `@forward './${module}';`),
      'nam/js-index': indexFormat('long', (module) => `export * from './${module}.js';`),
    },
  },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'nam',
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
          options: { module },
        })),
        { destination: '_index.scss', format: 'nam/scss-index' },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: `${buildPath}js/`,
      files: [
        ...modules.flatMap((module) => [
          {
            destination: `${module}.js`,
            format: 'nam/js-module',
            filter: inModule(module),
            options: { module },
          },
          {
            destination: `${module}.d.ts`,
            format: 'typescript/es6-declarations',
            filter: inModule(module),
          },
        ]),
        { destination: 'index.js', format: 'nam/js-index' },
        { destination: 'index.d.ts', format: 'nam/js-index' },
      ],
    },
  },
};

export default config;
