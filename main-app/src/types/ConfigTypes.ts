/**
 * Datenmodell, um die Konfigurationsparameter anzupassen oder abzurufen.
 * - basePrice: Grundpreis in EUR/Monat (brutto)
 * - energyPrice: Verbrauchspreis in EUR/kWh (brutto)
 * - energyTax: Stromsteuer in EUR/kWh
 * - vatRate: Umsatzsteuer (Relativ z.B. 0.19)
 * - monthlyAdvance: Monatliche Abschlagszahlung in EUR (brutto)
 * - additionalCredit: Zusätzlicher Guthabenbetrag in EUR (brutto)
 * - dueDay: Fälligkeitstag der monatlichen Abschlagszahlung (z.B. 5: Zum 5. des Monats)
 * - sepaProcessingDays: Anzahl Tage, die für die SEPA-Lastschriftverarbeitung benötigt werden
 * - meterIdentifier: Zählernummer
 * - referenceDate: Referenzdatum für die Berechnung (z.B. Vertragsbeginn)
 */
export interface ConfigModel {
  basePrice: number;                
  energyPrice: number;                
  energyTax: number;                
  vatRate: number;                  
  monthlyAdvance: number;           
  additionalCredit: number;         
  dueDay: number;                   
  sepaProcessingDays: number;       
  meterIdentifier: string;          
  referenceDate: string | null;     
}