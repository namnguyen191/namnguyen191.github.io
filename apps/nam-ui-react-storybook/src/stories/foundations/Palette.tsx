import { getPaletteInfo, type PaletteColor } from '@nam-ui/core';
import { ColorItem, ColorPalette } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';

// The colours to show, in the order to show them, and what each is used for. Adding a colour to
// the palette means adding it here too.
const HUES: [hue: string, usage: string][] = [
  ['Purple', 'The brand primary colour. Lilac, the signature shade, is step 300.'],
  ['Slate', 'The neutral colour, for text, surfaces and borders.'],
  ['Green', 'The success status colour.'],
  ['Red', 'The error status colour.'],
  ['Amber', 'The warning status colour.'],
  ['Cyan', 'The info status colour.'],
  ['White', 'Pure white'],
];

// ColorItem takes a record of label to colour. The labels are shown under the swatches.
const toSwatches = (hue: string, color: PaletteColor): Record<string, string> =>
  Array.isArray(color)
    ? Object.fromEntries(color.map(([step, { hex }]) => [String(step), hex]))
    : { [hue]: color.hex };

const palette = getPaletteInfo();
export const Palette = (): ReactElement => {
  const unlisted = Object.keys(palette).find((hue) => !HUES.some(([name]) => name === hue));
  if (unlisted !== undefined) {
    throw new Error(`Palette colour "${unlisted}" is missing from HUES`);
  }

  return (
    <ColorPalette>
      {HUES.map(([hue, usage]) => {
        const color = palette[hue];
        if (color === undefined) {
          throw new Error(`Palette has no colour "${hue}", but HUES lists it`);
        }
        return <ColorItem key={hue} title={hue} subtitle={usage} colors={toSwatches(hue, color)} />;
      })}
    </ColorPalette>
  );
};
