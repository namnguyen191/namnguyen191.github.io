// oxlint-disable no-magic-numbers
import {
  contrastRatio,
  deltaEOK,
  type Hex,
  hexToLinearSrgb,
  linearSrgbToOklab,
  type OKLab,
  oklabToLinearSrgb,
  oklchToOklab,
  relativeLuminance,
  type RGB,
} from './color-helpers.ts';

// A colour as published in tokens/primitive/palette.json (DTCG 2025.10 colour object):
// the oklch() components are the source, the hex is the nearest 8-bit fallback.
export interface DtcgColor {
  colorSpace: 'oklch';
  components: [L: number, C: number, H: number];
  hex: Hex;
}

export const isDtcgColor = (value: unknown): value is DtcgColor =>
  typeof value === 'object' &&
  value !== null &&
  'colorSpace' in value &&
  value.colorSpace === 'oklch' &&
  'components' in value &&
  Array.isArray(value.components) &&
  value.components.length === 3 &&
  value.components.every((component: unknown) => typeof component === 'number') &&
  'hex' in value &&
  typeof value.hex === 'string' &&
  /^#[0-9a-f]{6}$/i.test(value.hex);

interface Spelling {
  linear: RGB;
  oklab: OKLab;
}

// Both ways a colour can reach a user: oklch() in browsers, hex in native apps, email and design tools.
const spellingsOf = (color: DtcgColor): [oklch: Spelling, hex: Spelling] => {
  const [L, C, H] = color.components;
  const oklab = oklchToOklab({ L, C, H });
  const hexLinear = hexToLinearSrgb(color.hex);
  return [
    { oklab, linear: oklabToLinearSrgb(oklab) },
    { oklab: linearSrgbToOklab(hexLinear), linear: hexLinear },
  ];
};

// Either spelling can be what a user sees, so every check uses the worse of the two (step 9).
export const minContrastRatio = (a: DtcgColor, b: DtcgColor): number => {
  const [oklchA, hexA] = spellingsOf(a);
  const [oklchB, hexB] = spellingsOf(b);
  return Math.min(
    contrastRatio(relativeLuminance(oklchA.linear), relativeLuminance(oklchB.linear)),
    contrastRatio(relativeLuminance(hexA.linear), relativeLuminance(hexB.linear))
  );
};

export const minDeltaEOK = (a: DtcgColor, b: DtcgColor): number => {
  const [oklchA, hexA] = spellingsOf(a);
  const [oklchB, hexB] = spellingsOf(b);
  return Math.min(deltaEOK(oklchA.oklab, oklchB.oklab), deltaEOK(hexA.oklab, hexB.oklab));
};

// Rounds down, so a reported value never looks like it passes when it doesn't (4.499 shows as 4.49).
export const truncate = (x: number, decimals: number): number =>
  Math.floor(x * 10 ** decimals) / 10 ** decimals;
