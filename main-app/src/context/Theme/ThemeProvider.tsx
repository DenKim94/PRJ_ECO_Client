import { useEffect, useState, ReactNode } from 'react';
import { Logger } from '../../utils/logger';
import { ThemeContext, Theme } from './ThemeContext';

const logger = new Logger('ThemeContext');

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
    const root = document.documentElement; // Das <html> Tag
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

    logger.debug(`Theme changed to '${theme}'`);

  }, [theme]);

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
