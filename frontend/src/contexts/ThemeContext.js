import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getActiveThemeId,
  setActiveThemeId,
  getThemeById,
  getAllThemes,
  applyTheme,
  getThemeMode,
  setThemeMode,
  THEME_PRESETS,
  DEFAULT_THEME_ID,
} from '../lib/themes';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [activeThemeId, setActiveThemeIdState] = useState(getActiveThemeId());
  const [mode, setModeState] = useState(getThemeMode());
  const [themes, setThemes] = useState(getAllThemes());

  const activeTheme = getThemeById(activeThemeId) || THEME_PRESETS[DEFAULT_THEME_ID];

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme, mode]);

  const switchTheme = (themeId) => {
    setActiveThemeId(themeId);
    setActiveThemeIdState(themeId);
    const theme = getThemeById(themeId);
    if (theme) {
      applyTheme(theme);
    }
  };

  const switchMode = (newMode) => {
    setThemeMode(newMode);
    setModeState(newMode);
    applyTheme(activeTheme);
  };

  const refreshThemes = () => {
    setThemes(getAllThemes());
  };

  return (
    <ThemeContext.Provider
      value={{
        activeThemeId,
        activeTheme,
        mode,
        themes,
        switchTheme,
        switchMode,
        refreshThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
