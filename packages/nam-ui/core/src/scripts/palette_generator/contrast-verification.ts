import type { Trim } from 'type-fest';

import type { WCAGThreshold } from './color-helpers.ts';
import {
  type ColorRef,
  getMinContrastRatio,
  STATUS_RAMPS,
  type StatusRamp,
  truncate,
} from './palette.ts';

// Every surface that text, icons and focus rings can sit on: step 6, the step 9 pressed-row decision
// and the step 10 selected-row tint (brand hue at the hover step, unchanged on hover and press).
const LIGHT_SURFACES = [
  'slate.50', // page
  'white', // card, input
  'slate.100', // row hover (on the page and in a card)
  'slate.200', // row pressed
  'purple.100', // row selected
] as const satisfies readonly ColorRef[];

const DARK_SURFACES = [
  'slate.950', // page
  'slate.900', // card, input; row hover on the page
  'slate.800', // row hover in a card; row pressed everywhere
  'purple.900', // row selected on the page
  'purple.800', // row selected in a card
] as const satisfies readonly ColorRef[];

// Rows that can be pressed never contain links (no interactive element inside another), so links skip pressed rows.
const LIGHT_LINK_SURFACES = [
  'slate.50',
  'white',
  'slate.100',
  'purple.100',
] as const satisfies readonly ColorRef[];
const DARK_LINK_SURFACES = DARK_SURFACES; // slate.800 is also the hover step for rows in a card

type Theme = 'light' | 'dark';
type ContrastRule<TSurface extends ColorRef = ColorRef> = {
  name: string;
  theme: Theme;
  foreground: ColorRef;
  surfaces: readonly TSurface[];
  threshold: WCAGThreshold;
  // Keyed by surface: an exception covers one pair, not the whole rule.
  exception?: Partial<Record<TSurface, string>>;
};
// Accepts any reason whose trimmed form isn't empty; otherwise the error names the problem.
type ExceptionReason<T extends string> = T extends unknown
  ? Trim<T> extends ''
    ? 'Exception reason cannot be empty'
    : T
  : never;
const createContrastRule = <TSurface extends ColorRef, TReason extends string>(
  input: ContrastRule<TSurface> & {
    exception?: Partial<Record<TSurface, ExceptionReason<TReason>>>;
  }
): ContrastRule<TSurface> => input;

// Pairings from steps 5–7, with the step 9 focus-ring move and the step 10 changes (row surfaces for
// links and statuses, lighter dark status text and icons, the brand-outline secondary button). Each rule is one job in one theme;
// it expands to one pair per surface. Disabled colours are exempt from WCAG and aren't listed.
const NEUTRAL_RULES = [
  // Light theme
  createContrastRule({
    name: 'heading',
    theme: 'light',
    foreground: 'slate.950',
    surfaces: LIGHT_SURFACES,
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'body text',
    theme: 'light',
    foreground: 'slate.800',
    surfaces: LIGHT_SURFACES,
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'secondary text',
    theme: 'light',
    foreground: 'slate.700',
    surfaces: LIGHT_SURFACES,
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'placeholder',
    theme: 'light',
    foreground: 'slate.600',
    surfaces: ['white'],
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'input border',
    theme: 'light',
    foreground: 'slate.500',
    surfaces: ['slate.50', 'white'],
    threshold: 3,
  }),
  createContrastRule({
    name: 'selected-row indicator',
    theme: 'light',
    foreground: 'slate.600',
    surfaces: ['purple.100'],
    threshold: 3,
  }),
  // Dark theme
  createContrastRule({
    name: 'heading',
    theme: 'dark',
    foreground: 'slate.50',
    surfaces: DARK_SURFACES,
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'body text',
    theme: 'dark',
    foreground: 'slate.200',
    surfaces: DARK_SURFACES,
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'secondary text',
    theme: 'dark',
    foreground: 'slate.300',
    surfaces: DARK_SURFACES,
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'placeholder',
    theme: 'dark',
    foreground: 'slate.400',
    surfaces: ['slate.900'],
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'input border',
    theme: 'dark',
    foreground: 'slate.500',
    surfaces: ['slate.950', 'slate.900'],
    threshold: 3,
  }),
  createContrastRule({
    name: 'selected-row indicator',
    theme: 'dark',
    foreground: 'slate.400',
    surfaces: ['purple.900', 'purple.800'],
    threshold: 3,
  }),
];

const BRAND_RULES = [
  // Light theme
  createContrastRule({
    name: 'primary button label (rest, hover, pressed)',
    theme: 'light',
    foreground: 'purple.950',
    surfaces: ['purple.300', 'purple.400', 'purple.500'],
    threshold: 4.5,
  }),
  // Outline button: no fill at rest, so the label sits on the page or a card; its border is decorative.
  createContrastRule({
    name: 'secondary button label (rest, hover, pressed)',
    theme: 'light',
    foreground: 'purple.700',
    surfaces: ['slate.50', 'white', 'purple.100', 'purple.200'],
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'link',
    theme: 'light',
    foreground: 'purple.600',
    surfaces: LIGHT_LINK_SURFACES,
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'focus ring',
    theme: 'light',
    foreground: 'purple.600',
    surfaces: LIGHT_SURFACES,
    threshold: 3,
  }),
  // Dark theme
  createContrastRule({
    name: 'primary button label (rest, hover, pressed)',
    theme: 'dark',
    foreground: 'purple.950',
    surfaces: ['purple.300', 'purple.200', 'purple.100'],
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'secondary button label (rest, hover, pressed)',
    theme: 'dark',
    foreground: 'purple.300',
    surfaces: ['slate.950', 'slate.900', 'purple.900', 'purple.800'],
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'link',
    theme: 'dark',
    foreground: 'purple.300',
    surfaces: DARK_LINK_SURFACES,
    threshold: 4.5,
  }),
  createContrastRule({
    name: 'focus ring',
    theme: 'dark',
    foreground: 'purple.400',
    surfaces: DARK_SURFACES,
    threshold: 3,
  }),
];

// The step 7 status mapping, the same for all four statuses except warning's light-theme fill.
const statusRules = (ramp: StatusRamp): ContrastRule[] => {
  // Status text and icons appear in banners and in rows (a "Failed" cell), so every surface plus the own banner.
  const lightSurfaces = [...LIGHT_SURFACES, `${ramp}.100`] as const;
  const darkSurfaces = [...DARK_SURFACES, `${ramp}.900`] as const;
  const lightFill =
    ramp === 'amber'
      ? createContrastRule({
          name: `${ramp} fill label (rest, hover, pressed)`,
          theme: 'light',
          foreground: `${ramp}.950`,
          surfaces: [`${ramp}.300`, `${ramp}.400`, `${ramp}.500`],
          threshold: 4.5,
        })
      : createContrastRule({
          name: `${ramp} fill label (rest, hover, pressed)`,
          theme: 'light',
          foreground: 'white',
          surfaces: [`${ramp}.600`, `${ramp}.700`, `${ramp}.800`],
          threshold: 4.5,
        });

  return [
    // Light theme
    createContrastRule({
      name: `${ramp} text`,
      theme: 'light',
      foreground: `${ramp}.700`,
      surfaces: lightSurfaces,
      threshold: 4.5,
    }),
    createContrastRule({
      name: `${ramp} icon`,
      theme: 'light',
      foreground: `${ramp}.600`,
      surfaces: lightSurfaces,
      threshold: 3,
    }),
    createContrastRule({
      name: `${ramp} border`,
      theme: 'light',
      foreground: `${ramp}.500`,
      surfaces: ['white', 'slate.50'],
      threshold: 3,
    }),
    lightFill,
    // Dark theme
    createContrastRule({
      name: `${ramp} text`,
      theme: 'dark',
      foreground: `${ramp}.300`,
      surfaces: darkSurfaces,
      threshold: 4.5,
    }),
    createContrastRule({
      name: `${ramp} icon`,
      theme: 'dark',
      foreground: `${ramp}.400`,
      surfaces: darkSurfaces,
      threshold: 3,
    }),
    createContrastRule({
      name: `${ramp} border`,
      theme: 'dark',
      foreground: `${ramp}.500`,
      surfaces: ['slate.950', 'slate.900'],
      threshold: 3,
    }),
    createContrastRule({
      name: `${ramp} fill label (rest, hover, pressed)`,
      theme: 'dark',
      foreground: `${ramp}.950`,
      surfaces: [`${ramp}.300`, `${ramp}.200`, `${ramp}.100`],
      threshold: 4.5,
    }),
  ];
};

const CONTRAST_RULES: readonly ContrastRule[] = [
  ...NEUTRAL_RULES,
  ...BRAND_RULES,
  ...STATUS_RAMPS.flatMap(statusRules),
];

export const verifyContrastRules = (failures: string[]): void => {
  let pairCount = 0;
  let failureCount = 0;
  const exceptions: string[] = [];

  for (const rule of CONTRAST_RULES) {
    const { name, theme, foreground, surfaces, threshold, exception = {} } = rule;
    for (const surface of surfaces) {
      const minContrast = getMinContrastRatio(foreground, surface);
      const colorInfo = `- Theme: ${theme}\n- Name: ${name}\n- Color: ${foreground}\n- Surface: ${surface}\n- Contrast: ${truncate(minContrast, 2)} vs ${threshold} threshold`;
      const exceptionMsg = exception[surface];

      if (minContrast < threshold) {
        if (exceptionMsg) {
          exceptions.push(`Exception for:\n${colorInfo}\n- Reason: ${exceptionMsg}`);
        } else {
          failureCount++;
          failures.push(`Color does not meet contrast rule:\n${colorInfo}`);
        }
      } else if (exceptionMsg) {
        failureCount++;
        failures.push(`Exception for ${surface} is no longer needed.\n${colorInfo}`);
      }
      pairCount++;
    }
  }

  console.log(
    `Contrast: ${pairCount - failureCount}/${pairCount} pairs pass with ${exceptions.length} exception(s) accepted.${exceptions.length ? '\nExceptions detail:\n' + exceptions.join('\n') : ''}`
  );
};
