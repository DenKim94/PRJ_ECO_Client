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

  // Effekt, der bei jeder Theme-Änderung läuft
  useEffect(() => {
    const root = document.documentElement;
    const metaThemeColor = document.getElementById('meta-theme-color');

    // Attribut setzen, das unser SCSS triggert
    root.setAttribute('data-theme', theme);
    
    // Speichern für den nächsten Besuch
    localStorage.setItem('app-theme', theme);
    
    if (metaThemeColor) {
      // Farbe anpassen
      const color = theme === 'light' ? '#ebebeb' : '#324F56'; 
      metaThemeColor.setAttribute('content', color);
    }
    logger.debug(`Theme gesetzt auf '${theme}'`);

  }, [theme]);

  // Hilfsfunktion zum Umschalten (z.B. für einen Toggle-Button)
  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        setThemeState(newSystemTheme);
        logger.debug(`Theme gesetzt auf '${newSystemTheme}'`);
      };
        mediaQuery.addEventListener('change', handleChange);

      // Cleanup beim Unmount
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
  }, []);

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
