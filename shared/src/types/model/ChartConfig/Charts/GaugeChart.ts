export interface GaugeChart {
    maxValue: number;
    minValue: number;
    colors: string[];
    thresholds: number[];
    lastValue: number;
}