
/**
 * Custom hook for theme detection and management
 * Handles system theme detection with manual override support
 */

import { useState, useEffect, useCallback } from 'react';
import { UseThemeReturn } from '../types/code-preview';

export const useTheme = (initialTheme: 'light' | 'dark' | 'auto' = 'auto'): UseThemeReturn => {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [manualTheme, setManualTheme] = useState<'light' | 'dark' | 'auto'>(initialTheme);

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial value
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const theme = manualTheme === 'auto' ? systemTheme : manualTheme;

  const toggleTheme = useCallback(() => {
    setManualTheme(current => {
      if (current === 'auto') {
        return systemTheme === 'dark' ? 'light' : 'dark';
      }
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemTheme]);

  const setTheme = useCallback((newTheme: 'light' | 'dark' | 'auto') => {
    setManualTheme(newTheme);
  }, []);

  return {
    theme,
    systemTheme,
    toggleTheme,
    setTheme,
  };
};
