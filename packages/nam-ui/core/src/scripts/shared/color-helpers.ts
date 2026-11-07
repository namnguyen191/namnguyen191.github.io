// oxlint-disable no-magic-numbers
import type { Tagged } from 'type-fest';

export interface OKLCH {
  L: number;
  C: number;
  H: number;
}
export interface OKLab {
  L: number;
  a: number;
  b: number;
}
export interface RGB {
  r: number;
  g: number;
  b: number;
}
export type Hex = Tagged<string, 'Hex'>;

const WCAG = {
  // WCAG 2.x contrast: added to both luminances to allow for screen flare (ambient light reflected off the screen).
  contrastFlare: 0.05,
  // WCAG 2.x relative luminance: how much each linear sRGB channel adds to Y.
  // From the sRGB (Rec. 709) primaries; green counts about 10× as much as blue.
  luminanceWeights: { r: 0.2126, g: 0.7152, b: 0.0722 },
} as const;

// OKLab → LMS′ (Ottosson 2020)
const OKLAB_TO_LMS = [
  [1, 0.3963377774, 0.2158037573],
  [1, -0.1055613458, -0.0638541728],
  [1, -0.0894841775, -1.291485548],
] as const;

// LMS → linear sRGB (Ottosson 2020)
const LMS_TO_LINEAR_SRGB = [
  [4.0767416621, -3.3077115913, 0.2309699292],
  [-1.2684380046, 2.6097574011, -0.3413193965],
  [-0.0041960863, -0.7034186147, 1.707614701],
] as const;

// linear sRGB → LMS (Ottosson 2020; inverse of LMS_TO_LINEAR_SRGB)
const LINEAR_SRGB_TO_LMS = [
  [0.4122214708, 0.5363325363, 0.0514459929],
  [0.2119034982, 0.6806995451, 0.1073969566],
  [0.0883024619, 0.2817188376, 0.6299787005],
] as const;

// LMS′ → OKLab (Ottosson 2020; inverse of OKLAB_TO_LMS)
const LMS_TO_OKLAB = [
  [0.2104542553, 0.793617785, -0.0040720468],
  [1.9779984951, -2.428592205, 0.4505937099],
  [0.0259040371, 0.7827717662, -0.808675766],
] as const;

const SRGB_TRANSFER = {
  linearThreshold: 0.0031308, // below this (linear side) the curve is a straight line
  encodedThreshold: 0.04045, // the same point on the encoded side (12.92 × 0.0031308), for the reverse
  slope: 12.92, // slope of the straight segment near black
  gamma: 2.4, // exponent of the curved part
  offset: 0.055, // shift that makes the curve end exactly at 1
} as const;

const degToRad = (deg: number): number => (deg * Math.PI) / 180;
export const oklchToOklab = (oklch: OKLCH): OKLab => {
  const { L, C, H } = oklch;
  const hRad = degToRad(H);
  return {
    L,
    a: C * Math.cos(hRad),
    b: C * Math.sin(hRad),
  };
};

type Vec3 = readonly [number, number, number];
const multiply = (m: readonly [Vec3, Vec3, Vec3], [x, y, z]: Vec3): Vec3 => [
  m[0][0] * x + m[0][1] * y + m[0][2] * z,
  m[1][0] * x + m[1][1] * y + m[1][2] * z,
  m[2][0] * x + m[2][1] * y + m[2][2] * z,
];
export const oklabToLinearSrgb = (oklab: OKLab): RGB => {
  const { L, a, b } = oklab;
  const lmsPrime = multiply(OKLAB_TO_LMS, [L, a, b]);
  const [l, m, s] = lmsPrime;
  const lms: Vec3 = [l ** 3, m ** 3, s ** 3];
  const linearSrgb = multiply(LMS_TO_LINEAR_SRGB, lms);

  return {
    r: linearSrgb[0],
    g: linearSrgb[1],
    b: linearSrgb[2],
  };
};

// 1 + offset keeps full brightness at exactly 1 (white stays white)
const SRGB_SCALE = 1 + SRGB_TRANSFER.offset;
export const linearToSrgb = (channel: number): number => {
  if (channel <= SRGB_TRANSFER.linearThreshold) {
    return SRGB_TRANSFER.slope * channel;
  }

  return SRGB_SCALE * channel ** (1 / SRGB_TRANSFER.gamma) - SRGB_TRANSFER.offset;
};

export const getOutOfRangeRGBMsg = (rgb: RGB): string | null => {
  const { r, g, b } = rgb;

  let errMsg = '';
  if (r < 0 || r > 1) {
    errMsg += `\nRed: ${r} is out of bound.`;
  }

  if (g < 0 || g > 1) {
    errMsg += `\nGreen: ${g} is out of bound.`;
  }

  if (b < 0 || b > 1) {
    errMsg += `\nBlue: ${b} is out of bound.`;
  }

  return errMsg || null;
};

export const isInGamut = (oklch: OKLCH): boolean => {
  const oklab = oklchToOklab(oklch);
  const rgb = oklabToLinearSrgb(oklab);
  return !getOutOfRangeRGBMsg(rgb);
};

const CHANNEL_MAX = 255;
export const srgbToHex = (linear: RGB): Hex => {
  const oorErrMsg = getOutOfRangeRGBMsg(linear);
  if (oorErrMsg) {
    throw new Error(`Linear RGB gets out of bound when trying to convert to sRGB for ${oorErrMsg}`);
  }

  let hex = '#';
  const rgb = [linear.r, linear.g, linear.b];

  for (const linearVal of rgb) {
    const srgbVal = linearToSrgb(linearVal);
    hex += Math.round(srgbVal * CHANNEL_MAX)
      .toString(16)
      .padStart(2, '0');
  }

  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return hex as Hex;
};

// No sRGB colour has OKLCH chroma above ~0.3225 (magenta), so this is always out of gamut.
export const CHROMA_SEARCH_MAX = 0.4;
export const maxChroma = (L: number, H: number): number => {
  let low = 0;
  let high = CHROMA_SEARCH_MAX;
  // With a precision of 0.0001, we need at least 12 round because 0.4 / 2^12 ≈ 0.0000977 < 0.0001
  for (let round = 0; round < 12; round++) {
    const midPoint = (low + high) / 2;
    if (
      isInGamut({
        L,
        H,
        C: midPoint,
      })
    ) {
      low = midPoint;
    } else {
      high = midPoint;
    }
  }

  return low;
};

export const hexToSrgb = (hex: Hex): RGB => {
  const r = Number.parseInt(hex.slice(1, 3), 16) / CHANNEL_MAX;
  const g = Number.parseInt(hex.slice(3, 5), 16) / CHANNEL_MAX;
  const b = Number.parseInt(hex.slice(5, 7), 16) / CHANNEL_MAX;
  return {
    r,
    g,
    b,
  };
};

export const linearSrgbToOklab = (rgb: RGB): OKLab => {
  const { r, g, b } = rgb;
  const lms = multiply(LINEAR_SRGB_TO_LMS, [r, g, b]);
  const [l, m, s] = lms;
  const lmsPrime = [Math.cbrt(l), Math.cbrt(m), Math.cbrt(s)] as const;
  const oklab = multiply(LMS_TO_OKLAB, lmsPrime);
  return {
    L: oklab[0],
    a: oklab[1],
    b: oklab[2],
  };
};

export const srgbToLinear = (channel: number): number => {
  if (channel <= SRGB_TRANSFER.encodedThreshold) {
    return channel / SRGB_TRANSFER.slope;
  }

  return ((channel + SRGB_TRANSFER.offset) / SRGB_SCALE) ** SRGB_TRANSFER.gamma;
};

const radToDeg = (rad: number): number => (rad * 180) / Math.PI;
export const oklabToOklch = (oklab: OKLab): OKLCH => {
  const { L, a, b } = oklab;
  const C = Math.hypot(a, b);
  const deg = radToDeg(Math.atan2(b, a));
  const H = deg < 0 ? deg + 360 : deg;

  return {
    L,
    C,
    H,
  };
};

export const hexToLinearSrgb = (hex: Hex): RGB => {
  const { r, g, b } = hexToSrgb(hex);
  return { r: srgbToLinear(r), g: srgbToLinear(g), b: srgbToLinear(b) };
};

export const hexToOklch = (hex: Hex): OKLCH =>
  oklabToOklch(linearSrgbToOklab(hexToLinearSrgb(hex)));

// Input must be linear RGB, not the encoded 0–1 values from hexToSrgb.
export const relativeLuminance = (linear: RGB): number => {
  const { r, g, b } = linear;
  return WCAG.luminanceWeights.r * r + WCAG.luminanceWeights.g * g + WCAG.luminanceWeights.b * b;
};

export const contrastRatio = (y1: number, y2: number): number => {
  const lighter = Math.max(y1, y2);
  const darker = Math.min(y1, y2);

  return (lighter + WCAG.contrastFlare) / (darker + WCAG.contrastFlare);
};

// Just-noticeable difference for deltaEOK, the value CSS Color 4 uses in its gamut-mapping algorithm
export const JUST_NOTICEABLE_DELTA_E_OK = 0.02;

// Euclidean distance in OKLab (CSS Color 4's deltaEOK)
export const deltaEOK = (lab1: OKLab, lab2: OKLab): number =>
  Math.hypot(lab1.L - lab2.L, lab1.a - lab2.a, lab1.b - lab2.b);

export type WCAGThreshold = 3 | 4.5;
