import { useSyncExternalStore, useCallback } from "react";

function useMediaQuery(query: string, ssrFallback = false) : boolean {
  // 1. getSnapshot: Prüft bei jedem Render den aktuellen Wert.
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return ssrFallback;
    return window.matchMedia(query).matches;
  }, [query, ssrFallback]);

  // 2. subscribe: Meldet React, wenn sich der Wert ändert (z.B. Gerät gedreht).
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof window === "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    const mql = window.matchMedia(query);
    mql.addEventListener("change", onStoreChange);
    return () => mql.removeEventListener("change", onStoreChange);
    
  }, [query]);

  // 3. getServerSnapshot: Wird beim SSR verwendet.
  const getServerSnapshot = useCallback(() => ssrFallback, [ssrFallback]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Gibt an, ob aktuell ein mobiles Gerät verwendet wird (sowohl vertikal als auch horizontal).
 * 
 * @param {number} maxWidthBreakpoint - Die maximale Breite im Hochformat (Standard: 768px).
 * @param {number} maxHeightLandscape - Die maximale Höhe, um es quer noch als Handy zu werten (Standard: 500px).
 * @returns {boolean} true, wenn ein mobiles Gerät verwendet wird, sonst false.
 */
export function useIsMobile(maxWidthBreakpoint = 768, maxHeightLandscape = 500){
  // Die Media Query deckt nun zwei Fälle ab:
  // 1. Gerät im Hochformat oder kleine Tablets: Breite ist kleiner als der Breakpoint.
  // 2. ODER: Gerät im Querformat (landscape) UND die Höhe ist sehr gering (z.B. < 500px).
  // Ein Komma in einer CSS Media Query wirkt wie ein logisches ODER.
  const query = `(max-width: ${maxWidthBreakpoint - 1}px), (orientation: landscape) and (max-height: ${maxHeightLandscape - 1}px)`;
  
  return useMediaQuery(query, false);
}
