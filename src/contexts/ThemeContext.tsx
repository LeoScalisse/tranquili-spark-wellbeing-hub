
import React, { createContext, useContext, useEffect } from 'react';

type Theme = 'tranquili';

interface ThemeContextType {
  theme: Theme;
  usedThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme: Theme = 'tranquili';
  const usedThemes: Theme[] = ['tranquili'];

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes (cleanup)
    root.classList.remove('theme-light', 'theme-dark', 'theme-tranquili');
    
    // Add tranquili theme class
    root.classList.add('theme-tranquili');
    
    // Save to localStorage
    localStorage.setItem('tranquili-theme', theme);
    localStorage.setItem('tranquili-used-themes', JSON.stringify(usedThemes));
    
    console.log('Tema Tranquili+ aplicado com sucesso');
  }, []);

  const value = {
    theme,
    usedThemes,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
