export interface LineChartOption {
    thresholds?:{
        max?: number
        min?: number
        color?: string
    },
    seriesColors: Record<string, string>
}

export function createLineChartSpecificSetting(): LineChartOption {
    // LineChart固有の初期化処理
    const lineChart: LineChartOption = {
        thresholds: {
            max: 80,
            min: 20,
            color: "#FF0000"
        },
        seriesColors: {}
    };
    return lineChart;
}