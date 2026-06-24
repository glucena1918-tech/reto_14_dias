"use client";

import {
  createContext,
  useState,
  useEffect,
  useTransition,
  useCallback,
  type ReactNode,
} from "react";

export type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "es",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always initialize with server-safe default to prevent hydration mismatch
  const [language, setLanguageState] = useState<Language>("es");
  const [, startTransition] = useTransition();

  // Sync from localStorage AFTER hydration
  useEffect(() => {
    const stored = localStorage.getItem("language");
    if (stored === "en" || stored === "es") {
      startTransition(() => {
        setLanguageState(stored);
      });
    }
  }, [startTransition]);

  const setLanguage = useCallback(
    (lang: Language) => {
      startTransition(() => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
      });
    },
    [startTransition]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
