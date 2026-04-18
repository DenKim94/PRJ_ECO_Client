import { useEffect, useRef, RefObject } from 'react';

/**
 * Eine Aktion wird ausführt, wenn außerhalb eines referenzierten Elements geklickt wird.
 * 
 * @param ref - Referenz auf das HTML-Element (z.B. ein Dropdown-Menü)
 * @param handler - Die Funktion, die ausgeführt werden soll (z.B. Menü schließen)
 */
export function useOutsideClick<T extends HTMLElement = HTMLElement>(
    refObject: RefObject<T | null>,
    handler: (event: MouseEvent | TouchEvent) => void
): void {
    
    // Speichern des aktuellsten Handlers in einer Ref
    const savedHandler = useRef(handler);

    // Aktualisiere die Ref immer dann, wenn sich der übergebene Handler ändert.
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        // Das Event, das bei jedem Klick/Touch feuert
        const listener = (event: MouseEvent | TouchEvent) => {
            const element = refObject.current;

            // Abbruchbedingung: 
            // - Das Element existiert aktuell nicht im DOM (null)
            // - ODER der geklickte Bereich (event.target) liegt INNERHALB unseres referenzierten Elements
            if (!element || element.contains(event.target as Node)) {
                return;
            }

            // Klick fand AUSSERHALB von refObject statt
            savedHandler.current(event);
        };

        // Event-Listener registrieren
        // Die Listener werden auf 'mousedown' und 'touchstart' anstelle von 'click' registriert
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        // Cleanup-Funktion (Memory-Leak Prävention)
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
        
    }, [refObject]); // Hook triggert nur neu, wenn sich die DOM-Referenz (refObject) ändert
}
