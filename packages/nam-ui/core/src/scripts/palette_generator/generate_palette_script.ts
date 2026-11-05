import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { format, resolveConfig } from 'prettier';

import { hexToOklch } from '../shared/color-helpers.ts';
import { truncate } from '../shared/dtcg-color.ts';
import { generatedPalette, getMinDeltaEOK, type RampName, sdData, type Step } from './palette.ts';
import { COLORS, LIGHTNESS_TOLERANCE, LILAC_HEX, MIN_NEIGHBOUR_DELTA_E_OK, STEPS } from './seed.ts';

const writePaletteToSdFile = async (): Promise<void> => {
  const PALETTE_PATH = path.join(import.meta.dirname, '../../../tokens/primitive/palette.json');
  const options = await resolveConfig(PALETTE_PATH);
  const formatted = await format(JSON.stringify(sdData, null, 2), {
    ...options,
    filepath: PALETTE_PATH,
  });
  writeFileSync(PALETTE_PATH, formatted);
};

// Verify that every generated hex doesn't differ too much from the original OKLCH in terms of lightness
const verifyConsistentLightness = (failures: string[]): void => {
  for (const [color, steps] of Object.entries(generatedPalette)) {
    for (const [stepNo, step] of Object.entries(steps)) {
      const {
        components: [L],
        hex,
      } = step.$value;

      const { L: convertedL } = hexToOklch(hex);
      const lightnessDiff = Math.abs(convertedL - L);
      if (lightnessDiff > LIGHTNESS_TOLERANCE) {
        failures.push(
          `Color ${color} did not pass check at step ${stepNo}. Converting Hex back to OKLCH produces a difference of ${lightnessDiff}`
        );
      }
    }
  }
};

// Verify that the generated purple matches our brand lilac
const verifyBrandColor = (failures: string[]): void => {
  const generatedPurple300Hex = generatedPalette.purple[300].$value.hex;
  if (generatedPurple300Hex !== LILAC_HEX) {
    failures.push(`Purple 300 hex is ${generatedPurple300Hex} instead of the target ${LILAC_HEX}`);
  }
};

// Verify that white exists and is correct
const verifyWhite = (failures: string[]): void => {
  if (sdData.palette.white.$value.hex !== '#ffffff') {
    failures.push(`White hex is wrong at ${sdData.palette.white.$value.hex}`);
  }
};

// For every ramp, verify that each adjacent pair of steps is noticeably different
const verifyNeighbouringSteps = (failures: string[]): void => {
  let pairCount = 0;
  let failureCount = 0;
  for (const ramp of Object.keys(COLORS) as RampName[]) {
    let previous: Step | undefined;
    for (const step of STEPS) {
      if (previous !== undefined) {
        const currentRef = `${ramp}.${step}` as const;
        const prevRef = `${ramp}.${previous}` as const;
        const minDeltaEOK = getMinDeltaEOK(currentRef, prevRef);
        if (minDeltaEOK < MIN_NEIGHBOUR_DELTA_E_OK) {
          failureCount++;
          failures.push(
            `The pair ${prevRef} and ${currentRef} has a lowest deltaEOK of ${truncate(minDeltaEOK, 4)} which is less than the acceptable ${MIN_NEIGHBOUR_DELTA_E_OK}`
          );
        }
        pairCount++;
      }
      previous = step;
    }
  }

  console.log(`Neighbours: ${pairCount - failureCount}/${pairCount} pass`);
};

const isGeneratedPaletteValid = (): boolean => {
  const failures: string[] = [];
  verifyConsistentLightness(failures);
  verifyBrandColor(failures);
  verifyWhite(failures);
  verifyNeighbouringSteps(failures);

  if (failures.length > 0) {
    console.error(failures.join('\n'));
    return false;
  }

  return true;
};

if (!isGeneratedPaletteValid()) {
  process.exitCode = 1;
} else {
  await writePaletteToSdFile();
}
