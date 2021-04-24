export interface CurrencyList {
    success: boolean;
    symbols: any;
}

export interface CurrencyRates {
    success: boolean;
    timestamp: number;
    base: string;
    date: string;
    rates: any;
}