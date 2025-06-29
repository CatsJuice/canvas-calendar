import { atom, useAtomValue } from "jotai";

export type Theme = "light" | "dark";

export function getSystemColorScheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const themeAtom = atom<Theme>(getSystemColorScheme());

export function useTheme() {
  const theme = useAtomValue(themeAtom);
  return {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
}
