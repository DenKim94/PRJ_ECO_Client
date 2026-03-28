
/**
 * - endDate: Enddatum der Abrechnungszeit [dd.MM.yyyy]
 */
export interface CalcultationRequest {
    endDate: number;
};

/**
 * - meterid: Zählernummer
 * - startDate: Startdatum der Abrechnungszeit
 * - endDate: Enddatum der Abrechnungszeit
 * - daysBetween: Anzahl der Tage in der Abrechnungszeit
 * - paidAmountPeriod: Summe der Einzahlungen über den Abrechnungszeitraum [€]
 * - bruttoTotalCostPeriod: Gesamtkosten (brutto) anhand der verbrauchten Energiemenge [€]
 * - totalConsumptionKwh: Summe der bisher verbrauchte Energiemenge [kWh]
 * - costDiffPeriod: Brutto Restbetrag [€]: Positiv = Nachzahlung, Negativ = Guthaben
 * - usedEnergyPerDay: Durchschnittlicher Energieverbrauch pro Tag [kWh/Tag]
 * - logMessage: Log-Nachricht mit Details zur Berechnung (optional)
 */
export interface CalculationDataResponse {
    meterid: string;                
    startDate: number;             
    endDate: number;
    daysBetween: number;
    paidAmountPeriod: number;
    bruttoTotalCostPeriod: number;
    totalConsumptionKwh: number;
    costDiffPeriod: number;
    usedEnergyPerDay: number;
    logMessage?: string;    
};