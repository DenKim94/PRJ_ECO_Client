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
}