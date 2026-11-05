import { type Hex, JUST_NOTICEABLE_DELTA_E_OK } from '../shared/color-helpers.ts';
import type { Ramp, Step } from './palette.ts';

// The seed: every value you can adjust to generate a different palette.
// Edit this file, then run the `generate-palette` script. palette.ts turns these values into
// colours, and generate_palette_script.ts checks them and writes tokens/primitive/palette.json.
// The shapes they must follow (Step, ChromaRule, Ramp) are defined in palette.ts, and TypeScript
// flags any value that doesn't fit.
// Ramp names and steps are also referenced by tokens/role/color.json (`{palette.<ramp>.<step>}`),
// so renaming a ramp or changing the steps means updating that file too.

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export const LIGHTNESS_SCALE = {
  50: 0.98,
  100: 0.95,
  200: 0.9,
  300: 0.84,
  400: 0.74,
  500: 0.64,
  600: 0.54,
  700: 0.47,
  800: 0.39,
  900: 0.3,
  950: 0.21,
} as const satisfies {
  [K in Step]: number;
};

// Slate's hand-picked chroma from step 6: lowest at the ends, highest in the middle.
const SLATE_CHROMA = {
  50: 0.004,
  100: 0.008,
  200: 0.013,
  300: 0.018,
  400: 0.025,
  500: 0.03,
  600: 0.032,
  700: 0.032,
  800: 0.03,
  900: 0.028,
  950: 0.026,
} as const satisfies Record<Step, number>;

// Use this value so the weakest status hue isn't right on the gamut edge.
const STATUS_SHARE = 0.9;
export const COLORS = {
  purple: { role: 'brand', hue: 306.9, chroma: { kind: 'relative', share: 0.84 } },
  slate: { role: 'neutral', hue: 257, chroma: { kind: 'fixed', values: SLATE_CHROMA } },
  green: { role: 'success', hue: 158, chroma: { kind: 'equal', share: STATUS_SHARE } },
  red: { role: 'error', hue: 27, chroma: { kind: 'equal', share: STATUS_SHARE } },
  amber: { role: 'warning', hue: 75, chroma: { kind: 'equal', share: STATUS_SHARE } },
  cyan: { role: 'info', hue: 212, chroma: { kind: 'equal', share: STATUS_SHARE } },
} as const satisfies Record<string, Ramp>;

// The checks below run before palette.json is written; any failure stops the script.
// They hold the generated palette to targets that belong with the seed above, so change them
// together with it.

// How far a hex fallback's lightness may drift from its OKLCH lightness once converted back.
export const LIGHTNESS_TOLERANCE = 0.002;

// The brand colour: the generated purple 300 must come out as exactly this hex.
// Changing anything that moves purple 300 means updating this too.
export const LILAC_HEX = '#d9bcf7' as Hex;

// Step 9 policy: neighbouring steps fail below the just-noticeable difference.
export const MIN_NEIGHBOUR_DELTA_E_OK = JUST_NOTICEABLE_DELTA_E_OK;
