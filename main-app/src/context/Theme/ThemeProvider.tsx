import { useEffect, useState, ReactNode } from 'react';
import { Logger } from '../../utils/logger';
import { ThemeContext, Theme } from './ThemeContext';

const logger = new Logger('ThemeProvider');

/**
 * Aktualisiert das <meta name="theme-color">-Tag passend zum aktiven Theme,
 * damit die UI des Browsers (z.B. die obere Adressleiste) zum App-Layout passt.
 *
 * Die Farbe wird aus der CSS-Variablen --color-background gelesen, damit es
 * keine zweite, separat zu pflegende Farbquelle neben den SCSS-Definitionen gibt.
 * Voraussetzung: data-theme muss am <html> bereits gesetzt sein, bevor diese
 * Funktion aufgerufen wird, da getComputedStyle sonst den falschen Wert liefert.
 *
 * @param fallback Farbwert, falls die CSS-Variable nicht ermittelbar ist
 */
const applyThemeColor = (fallback: string): void => {
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-background')
    .trim();

  let meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]:not([media])'
  );

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }

  meta.content = bg || fallback;
};

/**
 * @file ThemeProvider.tsx
 * Diese Datei definiert den ThemeProvider, der den Light- bzw. Dark-Mode für die gesamte Anwendung steuert.
 * 
 * Der Provider beinhaltet folgende Daten:
 * * theme: 'light' | 'dark';
 * * setTheme: (theme: Theme) => void;
 * 
 * Der Provider implementiert folgende Funktionen:
 * * setTheme: (theme: Theme) => void;
 * 
 * @author Denis Kim
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initiale Themen-Ermittlung (Lazy Initialization)
  const [theme, setThemeState] = useState<Theme>(() => {
    const prefersDark : boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Browserleiste an das App-Theme angleichen (nach dem Setzen von data-theme)
    applyThemeColor(theme === 'dark' ? '#324F56' : '#ebebeb');

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

  // Funktion zum expliziten Setzen
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
