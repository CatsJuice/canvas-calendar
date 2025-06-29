import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { themeAtom } from "../hooks/use-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const setTheme = useSetAtom(themeAtom);

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", listener);
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", listener);
    };
  }, [setTheme]);

  return children;
}
