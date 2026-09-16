"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "isla" | "editorial" | "cinematic-noir";

const THEMES: Theme[] = ["dark", "light", "isla", "editorial", "cinematic-noir"];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("portfolio-theme") as Theme | null;
    if (stored && THEMES.includes(stored)) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
      localStorage.setItem("portfolio-theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    },
  };

  // Prevent hydration mismatch by rendering invisible until mounted, 
  // or just render children (since we default to dark, if SSR is dark it matches)
  return (
    <ThemeContext.Provider value={value}>
      <div className={mounted ? undefined : "theme-gate"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
