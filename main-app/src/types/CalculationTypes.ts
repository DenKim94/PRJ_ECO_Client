
/**
 * - endDate: Enddatum der Abrechnungszeit [dd.MM.yyyy]
 */
export interface CalcultationRequest {
    endDate: string;
};

/**
 * - meterid: Zählernummer
 * - periodStart: Startdatum der Abrechnungszeit
 * - periodEnd: Enddatum der Abrechnungszeit
 * - daysPeriod: Anzahl der Tage in der Abrechnungszeit
 * - paidAmountPeriod: Summe der Einzahlungen über den Abrechnungszeitraum [€]
 * - totalCostsPeriod: Gesamtkosten (brutto) anhand der verbrauchten Energiemenge [€]
 * - sumUsedEnergy: Summe der bisher verbrauchte Energiemenge [kWh]
 * - costDiffPeriod: Brutto Restbetrag [€]: Positiv = Guthaben, Negativ = Nachzahlung
 * - usedEnergyPerDay: Durchschnittlicher Energieverbrauch pro Tag [kWh/Tag]
 * - logMessage: Log-Nachricht mit Details zur Berechnung (optional)
 */
export interface CalculationDataResponse {
    meterid: string;                
    periodStart: string;             
    periodEnd: string;
    daysPeriod: number;
    paidAmountPeriod: number;
    totalCostsPeriod: number;
    sumUsedEnergy: number;
    costDiffPeriod: number;
    usedEnergyPerDay: number;
    logMessage?: string;    
};