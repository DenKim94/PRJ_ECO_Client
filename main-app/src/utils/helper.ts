
export type TimeRange = '6M' | '1Y' | '2Y';

export class HelperClass {
    
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isEqualPasswords(password: string, approvePassword: string): boolean {
        return password === approvePassword;
    }

    static formatDateForServer (dateStr: string): string {
        if (!dateStr) return dateStr ?? '';
        
        // Wenn ein T enthalten ist (z.B. "2026-04-26T14:30:00"), dann nur den das Datum verwenden
        const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        const [year, month, day] = datePart.split('-');

        // Fallback
        if (!year || !month || !day) return dateStr;

        return `${day}.${month}.${year}`;
    };

    static formatDateForClient (dateStr: string): string {
        if (!dateStr) return '';
        
        // Prüfen, ob das Format bereits DD.MM.YYYY ist
        if (dateStr.includes('.')) return dateStr;

        // Wenn ein T enthalten ist (z.B. "2026-04-26T14:30:00"), dann nur den das Datum verwenden
        const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;

        // Umwandeln von YYYY-MM-DD zu DD.MM.YYYY
        const [year, month, day] = datePart.split('-');
        
        // Fallback
        if (!year || !month || !day) return dateStr;

        return `${year}-${month}-${day}`;
    };


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
     * Hilfsfunktion zum Parsen von "DD.MM.YYYY" in ein JS-Date-Objekt
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