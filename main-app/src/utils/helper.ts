
export type TimeRange = '6M' | '1Y' | '2Y';

export class HelperClass {
    
    /**
     * Prüft, ob eine Zeichenkette einer einfachen E-Mail-Struktur entspricht
     * (Zeichen vor und nach dem @ sowie eine Domain mit Punkt).
     *
     * @param email Die zu prüfende E-Mail-Adresse
     * @returns true, wenn das Format gültig ist, sonst false
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Vergleicht zwei Passwörter auf exakte Gleichheit (z.B. zur Bestätigung
     * bei der Registrierung).
     *
     * @param password Das eingegebene Passwort
     * @param approvePassword Die Wiederholung des Passworts
     * @returns true, wenn beide Werte identisch sind, sonst false
     */
    static isEqualPasswords(password: string, approvePassword: string): boolean {
        return password === approvePassword;
    }

    /**
     * Wandelt ein Datum vom ISO-Format (YYYY-MM-DD, optional mit T-Zeitanteil)
     * in das deutsche Anzeigeformat DD.MM.YYYY um, wie es der Server erwartet.
     * Leere oder unvollständige Eingaben werden unverändert zurückgegeben (Fallback).
     *
     * @param dateStr Datum im Format YYYY-MM-DD oder YYYY-MM-DDTHH:mm:ss
     * @returns Datum im Format DD.MM.YYYY oder die unveränderte Eingabe als Fallback
     */
    static formatDateForServer (dateStr: string): string {
        if (!dateStr) return dateStr ?? '';
        
        // Wenn ein T enthalten ist (z.B. "2026-04-26T14:30:00"), dann nur den das Datum verwenden
        const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        const [year, month, day] = datePart.split('-');

        // Fallback
        if (!year || !month || !day) return dateStr;

        return `${day}.${month}.${year}`;
    };

    /**
     * Bereitet ein Datum für die Anzeige im Client auf, 
     * der das Datum im ISO-Format YYYY-MM-DD erwartet.
     * Ein optionaler T-Zeitanteil wird abgeschnitten. Leere oder unvollständige
     * Eingaben werden unverändert zurückgegeben (Fallback).
     *
     * @param dateStr Datum im Format YYYY-MM-DD bzw. YYYY-MM-DDTHH:mm:ss
     * @returns Datum im Format YYYY-MM-DD oder die unveränderte Eingabe als Fallback
     */
    static formatDateForClient(dateStr: string): string {
        if (!dateStr) return '';

        // DD.MM.YYYY → YYYY-MM-DD
        if (dateStr.includes('.')) {
            const [day, month, year] = dateStr.split('.');
            if (!day || !month || !year) return dateStr;
            return `${year}-${month}-${day}`;
        }

        // YYYY-MM-DD (ggf. mit T-Zeitanteil) → unverändert lassen
        const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        const [year, month, day] = datePart.split('-');
        if (!year || !month || !day) return dateStr;

        return `${year}-${month}-${day}`;
    }

    /**
     * Wandelt ein Datum im deutschen Format DD.MM.YYYY in einen
     * Unix-Zeitstempel in Millisekunden um (z.B. für Sortierungen oder Vergleiche).
     *
     * @param dateStr Datum im Format DD.MM.YYYY
     * @returns Zeitstempel in Millisekunden
     */
    static parseDateToMs (dateStr: string) {
        const [day, month, year] = dateStr.split('.');
        return new Date(`${year}-${month}-${day}`).getTime();
    };

    /**
     * Formatiert eine Zahl in das deutsche Format (z.B. 1.407,70)
     * 
     * @param value Die zu formatierende Zahl
     * @param minDecimals Minimale Anzahl an Nachkommastellen (Standard: 2)
     * @param maxDecimals Maximale Anzahl an Nachkommastellen (Standard: 2)
     */
    static formatNumberDE = (value: number | undefined | null, minDecimals = 2, maxDecimals = 2): string => {
        if (value === undefined || value === null || isNaN(value)) return "0,00";

        return value.toLocaleString('de-DE', {
            minimumFractionDigits: minDecimals, // Erzwingt z.B. die ,70 am Ende
            maximumFractionDigits: maxDecimals  // Begrenzt die maximale Länge
        });
    };

    /**
     * Hilfsfunktion zum Parsen von "DD.MM.YYYY" in ein JS-Date-Objekt.
     * Die Komponenten werden lokal interpretiert (kein UTC).
     *
     * @param dateStr Datum im Format DD.MM.YYYY
     * @returns Ein Date-Objekt, das dem übergebenen Datum entspricht
     */
    static parseGermanDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split('.');
        return new Date(Number(year), Number(month) - 1, Number(day));
    };

    /**
     * Filtert eine Liste basierend auf einem Zeitraum und limitiert die Anzahl der Punkte
     * 
     * @param sortedData Datenarray als Input, muss bereits chronologisch aufsteigend sortiert sein (älteste Daten zuerst)
     * @param range Der gewünschte Zeitraum ('6M', '1Y', '2Y')
     * @param maxPoints Maximale Anzahl an Datenpunkten (Standard: 16)
     * @returns Gefiltertes und ggf. heruntergerechnetes Array mit höchstens maxPoints Einträgen
     */
    static filterAndDownsampleData = <T extends { periodEnd: string }>(
        sortedData: T[],
        periodEnd: string, 
        range: TimeRange, 
        maxPoints = 16
    ): T[] => {
        if (!sortedData || sortedData.length === 0) return [];

        // Zieldatum ausgehend vom ersten (ältesten) Eintrag berechnen
        const targetEndDate = new Date(this.parseGermanDate(periodEnd));

        if (range === '6M') {
            targetEndDate.setMonth(targetEndDate.getMonth() + 6);
        } else if (range === '1Y') {
            targetEndDate.setFullYear(targetEndDate.getFullYear() + 1);
        } else if (range === '2Y') {
            targetEndDate.setFullYear(targetEndDate.getFullYear() + 2);
        }

        // Zeitraum filtern (alles abschneiden, was nach dem targetEndDate liegt)
        const filteredData = sortedData.filter(entry => {
            const entryDate = this.parseGermanDate(entry.periodEnd);
            return entryDate.getTime() <= targetEndDate.getTime();
        });

        // Downsampling (Auflösung verringern), falls > 16 Punkte
        if (filteredData.length <= maxPoints) {
            return filteredData; // Nichts zu tun, alle Punkte anzeigen
        }

        const downsampled: T[] = [];
        // Berechnet die Schrittweite, um exakt maxPoints aus dem Array zu entnehmen
        const step = (filteredData.length - 1) / (maxPoints - 1);
        
        for (let i = 0; i < maxPoints; i++) {
            // Durch Math.round wird auf den nächsten passenden Array-Index gerundet
            const index = Math.round(i * step);
            downsampled.push(filteredData[index]);
        }

        return downsampled;
    };    
}