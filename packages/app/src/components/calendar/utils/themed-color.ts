export type ThemedColor = [light: string, dark: string];

export const themedColor = (light: string, dark?: string): ThemedColor => [
  light,
  dark ?? light,
];

export const getThemedColor = (color: ThemedColor, isDark: boolean) =>
  isDark ? color[1] : color[0];