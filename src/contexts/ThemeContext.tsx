
import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'tranquili';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
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
  const [theme, setTheme] = useState<Theme>('light');
  const [usedThemes, setUsedThemes] = useState<Theme[]>(['light']);

  useEffect(() => {
    const savedTheme = localStorage.getItem('tranquili-theme') as Theme;
    const savedUsedThemes = JSON.parse(localStorage.getItem('tranquili-used-themes') || '["light"]');
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    setUsedThemes(savedUsedThemes);
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    
    // Adicionar tema à lista de temas usados se não estiver lá
    setUsedThemes(prev => {
      if (!prev.includes(newTheme)) {
        const newUsedThemes = [...prev, newTheme];
        localStorage.setItem('tranquili-used-themes', JSON.stringify(newUsedThemes));
        console.log('Novo tema adicionado:', newTheme, 'Total de temas usados:', newUsedThemes.length);
        return newUsedThemes;
      }
      return prev;
    });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-tranquili');
    
    // Add current theme class
    root.classList.add(`theme-${theme}`);
    
    // Save to localStorage
    localStorage.setItem('tranquili-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'tranquili'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    handleSetTheme(themes[nextIndex]);
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
    toggleTheme,
    usedThemes,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
