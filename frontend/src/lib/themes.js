// Theme presets and utilities for Adhikaar.ai

export const THEME_PRESETS = {
  mint: {
    id: 'mint',
    displayName: 'Adhikaar Mint',
    description: 'Default theme with mint green accents',
    tokens: {
      'brand.primary': '#35E0B8',
      'brand.secondary': '#6CA8FF',
      'status.success': '#15C27E',
      'status.warning': '#FFB020',
      'status.error': '#E25555',
      'text.primary': '#E8EEF4',
      'text.muted': '#A7B4C2',
      'surface.background': '#0B0F14',
      'surface.card': '#0F141B',
      'surface.elevated': '#121923',
      'border.default': 'rgba(255,255,255,0.12)',
      'focus.ring': '0 0 0 3px rgba(53,224,184,0.35)',
    },
    cssVariables: {
      '--background': '213 29% 6%',
      '--foreground': '210 45% 93%',
      '--card': '213 28% 8%',
      '--card-foreground': '210 45% 93%',
      '--primary': '167 74% 54%',
      '--primary-foreground': '210 45% 10%',
      '--secondary': '215 100% 71%',
      '--secondary-foreground': '214 31% 10%',
      '--success': '154 80% 42%',
      '--warning': '37 100% 56%',
      '--destructive': '357 100% 70%',
    },
  },
  success: {
    id: 'success',
    displayName: 'Adhikaar Success',
    description: 'Green-focused theme for success states',
    tokens: {
      'brand.primary': '#18A24F',
      'brand.secondary': '#3CCB7A',
      'status.success': '#18A24F',
      'status.warning': '#FFB020',
      'status.error': '#E25555',
      'text.primary': '#E8EEF4',
      'text.muted': '#A7B4C2',
      'surface.background': '#0C1210',
      'surface.card': '#0F1714',
      'surface.elevated': '#13211B',
      'border.default': 'rgba(255,255,255,0.12)',
      'focus.ring': '0 0 0 3px rgba(24,162,79,0.35)',
    },
    cssVariables: {
      '--background': '150 25% 7%',
      '--foreground': '210 45% 93%',
      '--card': '150 25% 9%',
      '--card-foreground': '210 45% 93%',
      '--primary': '149 70% 37%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '149 60% 50%',
      '--secondary-foreground': '150 25% 9%',
      '--success': '149 70% 37%',
      '--warning': '37 100% 56%',
      '--destructive': '357 100% 70%',
    },
  },
  indigo: {
    id: 'indigo',
    displayName: 'Adhikaar Indigo',
    description: 'Blue-indigo theme for a calm professional look',
    tokens: {
      'brand.primary': '#5B8BFF',
      'brand.secondary': '#35E0B8',
      'status.success': '#1FB77A',
      'status.warning': '#FFB020',
      'status.error': '#E25555',
      'text.primary': '#E8EEF4',
      'text.muted': '#A7B4C2',
      'surface.background': '#0B0F14',
      'surface.card': '#0F141B',
      'surface.elevated': '#111A26',
      'border.default': 'rgba(255,255,255,0.12)',
      'focus.ring': '0 0 0 3px rgba(91,139,255,0.35)',
    },
    cssVariables: {
      '--background': '213 29% 6%',
      '--foreground': '210 45% 93%',
      '--card': '213 28% 8%',
      '--card-foreground': '210 45% 93%',
      '--primary': '223 100% 68%',
      '--primary-foreground': '213 29% 6%',
      '--secondary': '167 74% 54%',
      '--secondary-foreground': '213 29% 6%',
      '--success': '158 73% 42%',
      '--warning': '37 100% 56%',
      '--destructive': '357 100% 70%',
    },
  },
  warning: {
    id: 'warning',
    displayName: 'Adhikaar Warning',
    description: 'Light theme with warm orange accents',
    tokens: {
      'brand.primary': '#FFB020',
      'brand.secondary': '#6CA8FF',
      'status.success': '#15C27E',
      'status.warning': '#FFB020',
      'status.error': '#E25555',
      'text.primary': '#1A1F2A',
      'text.muted': '#5E6473',
      'surface.background': '#FFF7E8',
      'surface.card': '#FFFFFF',
      'surface.elevated': '#FFF0D6',
      'border.default': 'rgba(0,0,0,0.12)',
      'focus.ring': '0 0 0 3px rgba(255,176,32,0.35)',
    },
    cssVariables: {
      '--background': '41 100% 96%',
      '--foreground': '218 22% 15%',
      '--card': '0 0% 100%',
      '--card-foreground': '218 22% 15%',
      '--primary': '37 100% 56%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '215 100% 71%',
      '--secondary-foreground': '218 22% 15%',
      '--success': '154 80% 42%',
      '--warning': '37 100% 56%',
      '--destructive': '357 73% 60%',
    },
  },
};

export const DEFAULT_THEME_ID = 'mint';

// LocalStorage keys
const STORAGE_KEYS = {
  ACTIVE_THEME: 'adhikaar_active_theme',
  CUSTOM_THEMES: 'adhikaar_custom_themes',
  DELETED_THEMES: 'adhikaar_deleted_themes',
  THEME_MODE: 'adhikaar_theme_mode',
};

// Get active theme ID
export const getActiveThemeId = () => {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_THEME) || DEFAULT_THEME_ID;
};

// Set active theme ID
export const setActiveThemeId = (themeId) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_THEME, themeId);
};

// Get theme mode (light/dark/system/high_contrast)
export const getThemeMode = () => {
  return localStorage.getItem(STORAGE_KEYS.THEME_MODE) || 'dark';
};

// Set theme mode
export const setThemeMode = (mode) => {
  localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
};

// Get custom themes
export const getCustomThemes = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_THEMES);
  return stored ? JSON.parse(stored) : [];
};

// Save custom theme
export const saveCustomTheme = (theme) => {
  const themes = getCustomThemes();
  const existingIndex = themes.findIndex((t) => t.id === theme.id);
  
  if (existingIndex >= 0) {
    themes[existingIndex] = { ...theme, updatedAt: new Date().toISOString() };
  } else {
    themes.push({
      ...theme,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.CUSTOM_THEMES, JSON.stringify(themes));
  return theme;
};

// Delete theme (soft delete)
export const deleteTheme = (themeId) => {
  const themes = getCustomThemes();
  const theme = themes.find((t) => t.id === themeId);
  
  if (theme) {
    // Move to deleted
    const deleted = getDeletedThemes();
    deleted.push({ ...theme, deletedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.DELETED_THEMES, JSON.stringify(deleted));
    
    // Remove from custom
    const updated = themes.filter((t) => t.id !== themeId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_THEMES, JSON.stringify(updated));
    
    // If active theme was deleted, switch to default
    if (getActiveThemeId() === themeId) {
      setActiveThemeId(DEFAULT_THEME_ID);
    }
  }
};

// Get deleted themes
export const getDeletedThemes = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.DELETED_THEMES);
  return stored ? JSON.parse(stored) : [];
};

// Restore theme
export const restoreTheme = (themeId) => {
  const deleted = getDeletedThemes();
  const theme = deleted.find((t) => t.id === themeId);
  
  if (theme) {
    // Remove deletedAt
    delete theme.deletedAt;
    
    // Save as custom theme
    saveCustomTheme(theme);
    
    // Remove from deleted
    const updated = deleted.filter((t) => t.id !== themeId);
    localStorage.setItem(STORAGE_KEYS.DELETED_THEMES, JSON.stringify(updated));
    
    return theme;
  }
};

// Get all themes (presets + custom)
export const getAllThemes = () => {
  const presets = Object.values(THEME_PRESETS);
  const custom = getCustomThemes();
  return [...presets, ...custom];
};

// Get theme by ID
export const getThemeById = (themeId) => {
  return THEME_PRESETS[themeId] || getCustomThemes().find((t) => t.id === themeId);
};

// Duplicate theme
export const duplicateTheme = (themeId) => {
  const theme = getThemeById(themeId);
  if (!theme) return null;
  
  const newTheme = {
    ...theme,
    id: `${theme.id}_copy_${Date.now()}`,
    displayName: `${theme.displayName} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return saveCustomTheme(newTheme);
};

// Export theme to JSON
export const exportTheme = (themeId) => {
  const theme = getThemeById(themeId);
  if (!theme) return null;
  
  const exportData = {
    version: '1.0.0',
    theme: {
      ...theme,
      exportedAt: new Date().toISOString(),
    },
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${theme.id}.adhikaar-theme.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import theme from JSON
export const importTheme = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.version && data.theme) {
          const theme = {
            ...data.theme,
            id: `imported_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          delete theme.exportedAt;
          
          const saved = saveCustomTheme(theme);
          resolve(saved);
        } else {
          reject(new Error('Invalid theme file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Apply theme to document
export const applyTheme = (theme) => {
  if (!theme) return;
  
  const root = document.documentElement;
  
  // Apply CSS variables
  Object.entries(theme.cssVariables || {}).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Update class for dark/light mode
  const mode = getThemeMode();
  root.classList.remove('light', 'dark', 'high-contrast');
  root.classList.add(mode === 'system' ? 'dark' : mode);
};

// Calculate contrast ratio (WCAG)
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (color) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Calculate relative luminance
    const [rs, gs, bs] = [r, g, b].map((c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Check if contrast meets WCAG standards
export const meetsWCAG = (ratio, level = 'AA') => {
  if (level === 'AAA') {
    return ratio >= 7;
  }
  return ratio >= 4.5;
};
