import { useEffect, useState, ReactNode } from 'react';
import { Logger } from '../../utils/logger';
import { ThemeContext, Theme } from './ThemeContext';

const logger = new Logger('ThemeProvider');

/**
 * @file ThemeProvider.tsx
 * Diese Datei definiert den ThemeProvider, der den Light- bzw. Dark-Mode für die gesamte Anwendung steuert.
 * 
 * Der Provider beinhaltet folgende Daten:
 * * theme: 'light' | 'dark';
 * * setTheme: (theme: Theme) => void;
 * * toggleTheme: () => void;
 * 
 * Der Provider implementiert folgende Funktionen:
 * * setTheme: (theme: Theme) => void;
 * * toggleTheme: () => void;
 * 
 * @author Firstname Lastname
 */

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initiale Themen-Ermittlung (Lazy Initialization)
  const [theme, setThemeState] = useState<Theme>(() => {
    
    const savedTheme = localStorage.getItem('app-theme') as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Fallback
    const prefersDark : boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
    logger.debug(`System-Theme angewendet: '${theme}'`);
  }, [theme]);

  useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        setThemeState(newSystemTheme);
      };
      
      // Listener registrieren
      mediaQuery.addEventListener('change', handleChange);

      // Cleanup beim Unmount
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
  }, []);

  // Hilfsfunktion zum Umschalten (z.B. für einen Toggle-Button)
  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Funktion zum expliziten Setzen
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
