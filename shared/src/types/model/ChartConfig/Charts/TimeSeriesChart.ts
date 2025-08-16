export interface TimeSeriesChart {
    maxThreshold: number;
    minThreshold: number;
    thresholds?:{
        max?: number
        min?: number
        color?: string
    },
    seriesColors?: Record<string, string>
}

export function createTimeSeriesChartSpecificSetting(): TimeSeriesChart {
    // TimeSeriesChart固有の初期化処理
    const timeSeriesChart: TimeSeriesChart = {
        maxThreshold: 100,
        minThreshold: 0,
        thresholds: {
            max: 80,
            min: 20,
            color: "#FF0000"
        },
        seriesColors: {
            "series1": "#FF6E76",
            "series2": "#FDDD60",
            "series3": "#7CFFB2"
        }
    };
    return timeSeriesChart;
}