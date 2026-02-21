export interface UpdateEntryRequest {
    id: number;
    value: number;
    date: string;
}

export interface AddEntryRequest {
    value: number;
    date: string;
}