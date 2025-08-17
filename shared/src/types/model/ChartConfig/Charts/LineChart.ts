export interface LineChart {
    thresholds?:{
        max?: number
        min?: number
        color?: string
    },
    seriesColors: Record<string, string>
}

export function createLineChartSpecificSetting(): LineChart {
    // LineChart固有の初期化処理
    const lineChart: LineChart = {
        thresholds: {
            max: 80,
            min: 20,
            color: "#FF0000"
        },
        seriesColors: {}
    };
    return lineChart;
}