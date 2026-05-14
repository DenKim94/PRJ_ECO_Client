export class HelperClass {
    
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isEqualPasswords(password: string, approvePassword: string): boolean {
        return password === approvePassword;
    }

    static formatDateForServer (dateStr: string): string {
        if (!dateStr || dateStr.includes('.')) return dateStr ?? '';
        
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
}