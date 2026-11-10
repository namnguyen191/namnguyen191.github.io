// The expected values are hard coded on purpose, so a palette change has to update this test.
// oxlint-disable eslint/no-magic-numbers

import { getPaletteInfo } from './palette-info.js';

describe('getPaletteInfo', () => {
  it('does not throw', () => {
    expect(() => getPaletteInfo()).not.toThrow();
  });

  it('returns white as a color without steps', () => {
    expect(getPaletteInfo().White).toEqual({
      cssVar: 'var(--nam-palette-white)',
      hex: '#ffffff',
    });
  });

  it('returns purple as a color with steps', () => {
    const purple = getPaletteInfo().Purple;

    expect(purple).toBeInstanceOf(Array);
    expect(purple).toContainEqual([
      500,
      { cssVar: 'var(--nam-palette-purple-500)', hex: '#ae5fed' },
    ]);
  });

  it('returns the steps of purple sorted from lightest to darkest', () => {
    const purple = getPaletteInfo().Purple;
    const steps = Array.isArray(purple) ? purple.map(([step]) => step) : [];

    expect(steps).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]);
  });
});
