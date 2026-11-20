// oxlint-disable no-console import/no-relative-parent-imports no-magic-numbers
import path from 'node:path';

import type { Action, Dictionary, TransformedToken } from 'style-dictionary/types';

import type { WCAGThreshold } from '../shared/color-helpers.ts';
import { type DtcgColor, isDtcgColor, minContrastRatio, truncate } from '../shared/dtcg-color.ts';

// A Style Dictionary action that checks the semantic colour tokens (step 10): every token's shape,
// and every contrast pairing it declares, in both themes. `$value` is the light theme;
// `$extensions["nam-ui"].dark` is the dark one. Style Dictionary has already read the files and
// resolved every reference (failing on any that don't exist); this adds only nam-ui's own rules.
// Any problem fails the build. Run it on a platform without transforms, so colours arrive as the
// palette's colour objects (both spellings) rather than as CSS strings.

const THEMES = ['light', 'dark'] as const;
type Theme = (typeof THEMES)[number];

// Rule 5: text, icons and borders declare contrast unless their name contains an exempt word;
// surfaces and fills are what they're checked against, so they never declare it.
const FOREGROUNDS: ReadonlySet<string> = new Set(['text', 'icon', 'border']);
const BACKGROUNDS: ReadonlySet<string> = new Set(['surface', 'fill']);
const EXEMPT_WORDS: readonly string[] = ['subtle', 'disabled'];
const THRESHOLDS = [3, 4.5] as const satisfies readonly WCAGThreshold[];

// The tier rule: a semantic value is exactly one reference to the role tier (color.*).
const ROLE_REFERENCE = /^\{color\.[^{}]+\}$/;

type JsonObject = Record<string, unknown>;
const isObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isThreshold = (value: unknown): value is WCAGThreshold =>
  THRESHOLDS.some((threshold) => threshold === value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

interface Contrast {
  min: WCAGThreshold;
  on: string[];
}
const parseContrast = (value: unknown): Contrast | undefined => {
  if (!isObject(value) || Object.keys(value).some((key) => key !== 'min' && key !== 'on')) {
    return undefined;
  }
  const { min, on } = value;
  return isThreshold(min) && isStringArray(on) && on.length > 0 ? { min, on } : undefined;
};

interface SemanticToken {
  name: string; // as in CSS and contrast.on: a group's $root token takes the group's name
  file: string;
  references: Record<Theme, unknown>; // as written, e.g. '{color.neutral.800}'
  colors: Record<Theme, unknown>; // as resolved by Style Dictionary
  contrast: Contrast | undefined;
}

const categoryOf = (name: string): string => name.split('.')[0] ?? '';
const namUiOf = (extensions: unknown): JsonObject | undefined =>
  isObject(extensions) && isObject(extensions['nam-ui']) ? extensions['nam-ui'] : undefined;

const isSemanticColor = (token: TransformedToken): boolean =>
  token.$type === 'color' && path.basename(path.dirname(token.filePath)) === 'semantic';

// Reads a token's values and contrast declaration, or reports why it can't.
const parseToken = (token: TransformedToken, failures: string[]): SemanticToken | undefined => {
  const name = token.path.filter((segment) => segment !== '$root').join('.');
  const file = token.filePath;
  const where = `${name} (${file})`;
  const written = namUiOf(token.original.$extensions);
  if (written?.dark === undefined) {
    failures.push(`${where}: missing $extensions["nam-ui"].dark`);
    return undefined;
  }

  const unknownKeys = Object.keys(written).filter((key) => key !== 'dark' && key !== 'contrast');
  const contrast = parseContrast(written.contrast);
  const problems = [
    ...(unknownKeys.length > 0 ? [`unknown nam-ui keys: ${unknownKeys.join(', ')}`] : []),
    ...(written.contrast !== undefined && !contrast
      ? [`nam-ui.contrast must be { min: ${THRESHOLDS.join(' | ')}, on: [token names] }`]
      : []),
  ];
  if (problems.length > 0) {
    failures.push(...problems.map((problem) => `${where}: ${problem}`));
    return undefined;
  }
  return {
    name,
    file,
    references: { light: token.original.$value, dark: written.dark },
    // The same object with references replaced, so it exists whenever `written` does.
    colors: { light: token.$value, dark: namUiOf(token.$extensions)?.dark },
    contrast,
  };
};

// Rule 5, the tier rule and the resolved colours. Returns the token's colour in each theme.
const checkToken = (
  token: SemanticToken,
  failures: string[]
): Record<Theme, DtcgColor> | undefined => {
  const where = `${token.name} (${token.file})`;
  const category = categoryOf(token.name);
  const isForeground = FOREGROUNDS.has(category);
  const exemptWord = EXEMPT_WORDS.find((word) => token.name.split('.').includes(word));

  if (!isForeground && !BACKGROUNDS.has(category)) {
    failures.push(
      `${where}: unknown category '${category}' (expected text, icon, border, surface or fill)`
    );
  } else if (!isForeground && token.contrast) {
    failures.push(
      `${where}: surfaces and fills are what foregrounds are checked against; remove nam-ui.contrast`
    );
  } else if (isForeground && exemptWord && token.contrast) {
    failures.push(`${where}: named '${exemptWord}', so it's exempt; remove nam-ui.contrast`);
  } else if (isForeground && !exemptWord && !token.contrast) {
    failures.push(
      `${where}: needs nam-ui.contrast, or a name containing ${EXEMPT_WORDS.join(' or ')}`
    );
  }

  const colors: Partial<Record<Theme, DtcgColor>> = {};
  for (const theme of THEMES) {
    const reference = token.references[theme];
    const color = token.colors[theme];
    if (typeof reference !== 'string' || !ROLE_REFERENCE.test(reference)) {
      failures.push(
        `${where}: ${theme} value ${JSON.stringify(reference)} must reference the role tier (color.*)`
      );
    } else if (!isDtcgColor(color)) {
      failures.push(`${where}: ${theme} value ${reference} doesn't resolve to a palette colour`);
    } else {
      colors[theme] = color;
    }
  }
  const { light, dark } = colors;
  return light && dark ? { light, dark } : undefined;
};

const verifyTokens = (dictionary: Dictionary): void => {
  const failures: string[] = [];
  const semantic = dictionary.allTokens
    .filter(isSemanticColor)
    .map((token) => parseToken(token, failures))
    .filter((token) => token !== undefined);

  const colorsByName = new Map<string, Record<Theme, DtcgColor>>();
  for (const token of semantic) {
    const colors = checkToken(token, failures);
    if (colors) colorsByName.set(token.name, colors);
  }

  const pairs: Record<Theme, { total: number; failed: number }> = {
    light: { total: 0, failed: 0 },
    dark: { total: 0, failed: 0 },
  };
  const semanticNames = new Set(semantic.map((token) => token.name));
  for (const token of semantic) {
    const foreground = colorsByName.get(token.name);
    if (!token.contrast || !foreground) continue;
    const { min, on } = token.contrast;
    for (const backgroundName of on) {
      if (!semanticNames.has(backgroundName) || !BACKGROUNDS.has(categoryOf(backgroundName))) {
        failures.push(
          `${token.name}: contrast.on names '${backgroundName}', which isn't a surface or fill token`
        );
        continue;
      }
      // A background that failed its own checks is already reported.
      const background = colorsByName.get(backgroundName);
      if (!background) continue;
      for (const theme of THEMES) {
        pairs[theme].total++;
        const ratio = minContrastRatio(foreground[theme], background[theme]);
        if (ratio < min) {
          pairs[theme].failed++;
          failures.push(
            `Contrast below ${min}:1\n- Theme: ${theme}\n- Pair: ${token.name} on ${backgroundName}\n- Contrast: ${truncate(ratio, 2)}`
          );
        }
      }
    }
  }

  const passed = (theme: Theme): string =>
    `${pairs[theme].total - pairs[theme].failed}/${pairs[theme].total}`;
  const total = pairs.light.total + pairs.dark.total;
  const failed = pairs.light.failed + pairs.dark.failed;
  console.log(`Tokens: ${semantic.length} semantic colour tokens read`);
  console.log(
    `Contrast: ${total - failed}/${total} pairs pass (light ${passed('light')}, dark ${passed('dark')})`
  );
  // oxlint-disable-next-line no-magic-numbers
  if (failures.length > 0) {
    throw new Error(
      `Token verification found ${failures.length} problem(s):\n${failures.join('\n')}`
    );
  }
};

export const verifyTokensAction: Omit<Action, 'name'> = {
  do: verifyTokens,
  // `style-dictionary clean` undoes each action; this one writes nothing, so there's nothing to undo.
  undo: () => undefined,
};
