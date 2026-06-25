"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ── Tipos ──
export type Theme = "dark" | "light";
export type FontSize = "small" | "medium" | "large";

export interface AppSettings {
  theme: Theme;
  fontSize: FontSize;
  reduceMotion: boolean;
  compactMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;
  resetSettings: () => void;
}

const STORAGE_KEY = "app-settings";

const defaultSettings: AppSettings = {
  theme: "dark",
  fontSize: "medium",
  reduceMotion: false,
  compactMode: false,
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: false,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSetting: () => {},
  resetSettings: () => {},
});

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  // Cargar ajustes del localStorage después de la hidratación
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch {
      // ignorar errores de parsing
    }
    setHydrated(true);
  }, []);

  // Aplicar tema y fuente al <html>
  useEffect(() => {
    if (!hydrated) return;

    const html = document.documentElement;

    // Tema
    html.setAttribute("data-theme", settings.theme);

    // Tamaño de fuente
    html.classList.remove("font-size-small", "font-size-medium", "font-size-large");
    html.classList.add(`font-size-${settings.fontSize}`);

    // Reducir animaciones
    if (settings.reduceMotion) {
      html.classList.add("reduce-motion");
    } else {
      html.classList.remove("reduce-motion");
    }

    // Modo compacto
    if (settings.compactMode) {
      html.classList.add("compact-mode");
    } else {
      html.classList.remove("compact-mode");
    }
  }, [settings, hydrated]);

  // Persistir cambios
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  const updateSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
