export interface LineChartOption {
    thresholds?:{
        /** 警告の最大閾値 */
        max?: number
        /** 警告の最小閾値 */
        min?: number
        /** 警告ラインの色 */
        color?: string
    },
    visibility?: {
        /** グラフ表示領域の最大値 */
        maxY?: number
        /** グラフ表示領域の最小値 */
        minY?: number
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