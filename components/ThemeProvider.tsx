"use client";

import { useEffect, useState } from "react";
import { useThemeStore, getTheme } from "@/lib/themeStore";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const themeConfig = getTheme(theme);

      // Apply theme data attribute
      document.documentElement.setAttribute("data-theme", theme);

      // Update class for light/dark mode (for Tailwind dark: variants if needed)
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(themeConfig.isDark ? "dark" : "light");
    }
  }, [theme, mounted]);

  return <>{children}</>;
}
