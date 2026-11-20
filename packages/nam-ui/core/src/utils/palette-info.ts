// oxlint-disable import/no-relative-parent-imports
// oxlint-disable-next-line import/no-namespace
import * as paletteTokens from '../generated/js/primitive/palette.js';
import { light, type Tokens } from '../generated/js/raw.js';

export interface ColorValue {
  cssVar: string;
  hex: string;
}
// If a color has steps, then its info is an array of [step, ColorValue], otherwise its
// just ColorValue
export type ColorStep = [number, ColorValue];
export type PaletteColor = ColorStep[] | ColorValue;
export type Palette = Record<string, PaletteColor>;
const PALETTE_EXPORT_NAME = /^Palette(?<hue>[A-Za-z]+?)(?<step>\d*)$/;
function isTokensKey(val: string): val is keyof Tokens {
  return Object.hasOwn(light, val);
}
export const getPaletteInfo = (): Palette => {
  const paletteInfo: Palette = {};
  for (const [varName, cssVar] of Object.entries(paletteTokens)) {
    const nameGroups = PALETTE_EXPORT_NAME.exec(varName)?.groups;
    const hue = nameGroups?.hue;
    const step = nameGroups?.step;
    if (hue === undefined) {
      throw new Error(`Invalid palette color variable:  ${varName}`);
    }

    if (!isTokensKey(varName)) {
      throw new Error(`Color ${varName} is missing the raw hex value`);
    }
    const hex = light[varName];

    if (typeof hex !== 'string') {
      throw new Error(`Color ${varName} has an invalid value for hex: ${hex}`);
    }

    const colorValue: ColorValue = {
      cssVar,
      hex,
    };
    const newVal: ColorStep | ColorValue = step ? [Number(step), colorValue] : colorValue;

    if (!paletteInfo[hue]) {
      paletteInfo[hue] = Array.isArray(newVal) ? [newVal] : newVal;
      continue;
    } else {
      if (Array.isArray(paletteInfo[hue]) && Array.isArray(newVal)) {
        paletteInfo[hue].push(newVal);
        continue;
      }

      if (!Array.isArray(paletteInfo[hue]) && !Array.isArray(newVal)) {
        paletteInfo[hue] = newVal;
        continue;
      }
    }

    throw new Error(
      `Color ${varName} is invalid. It needs to be either a simple color or a color with steps`
    );
  }

  Object.values(paletteInfo).forEach((val) => {
    if (Array.isArray(val)) {
      // oxlint-disable-next-line no-magic-numbers
      val.sort((stepA, stepB) => stepA[0] - stepB[0]);
    }
  });

  return Object.freeze(paletteInfo);
};
