/** The toolbar's choices, and the CSS `color-scheme` each one sets on <html>. */
export const COLOR_SCHEMES = {
  system: 'light dark',
  light: 'light',
  dark: 'dark',
} as const;

export type ColorSchemeChoice = keyof typeof COLOR_SCHEMES;

export const isColorSchemeChoice = (value: unknown): value is ColorSchemeChoice =>
  typeof value === 'string' && Object.hasOwn(COLOR_SCHEMES, value);

export const toColorSchemeChoice = (value: unknown): ColorSchemeChoice =>
  isColorSchemeChoice(value) ? value : 'system';
