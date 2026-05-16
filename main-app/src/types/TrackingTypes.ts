export interface TrackingEntityRequest {
    value_kWh: number;
    date: string;
};

export interface TrackingEntityResponse {
    readingValue: number;
    timestamp: string;
    id: number;
};

export interface EnergyDifferenceData {
    date: string;
    periodDays: number;
    energyDifferenceNorm: number; // Auf die Tage der Abrechnungsperiode normierter Energieverbrauch
}