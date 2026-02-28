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
 * Gibt an, ob aktuell ein mobiles Gerät verwendet wird.
 * @param {number} breakpointPx - Die Breite in Pixel, ab der ein mobiles Gerät angenommen wird. Standardwert in Pixel: 768
 * @returns {boolean} true, wenn ein mobiles Gerät verwendet wird, sonst false.
 */
export function useIsMobile(breakpointPx = 768){
  return useMediaQuery(`(max-width: ${breakpointPx - 1}px)`, false);
}
