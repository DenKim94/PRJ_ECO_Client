export interface TrackingEntityRequest {
    value_kWh: number;
    date: string;
};

export interface TrackingEntityResponse {
    readingValue: number;
    timestamp: string;
    id: number;
};