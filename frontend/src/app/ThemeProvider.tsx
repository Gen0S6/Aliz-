"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
    } catch (_err) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch (_err) {
      // ignore
    }
    const isDark = theme === "dark";
    if (typeof document !== "undefined") {
      const el = document.documentElement;
      const body = document.body;
      el.classList.toggle("dark", isDark);
      body.classList.toggle("dark", isDark);
      body.classList.toggle("bg-[#0b0c10]", isDark);
      body.classList.toggle("text-gray-100", isDark);
      body.classList.toggle("bg-white", !isDark);
      body.classList.toggle("text-black", !isDark);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeContext.Provider>
  );
}
