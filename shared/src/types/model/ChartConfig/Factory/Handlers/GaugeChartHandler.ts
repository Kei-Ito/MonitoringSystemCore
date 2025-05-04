import { GaugeChart } from "../../Charts/GaugeChart";


export function createGaugeChartSpecificSetting(): GaugeChart {
    // GaugeChart固有の初期化処理
    const gaugeChart: GaugeChart = {
        maxValue: 100,
        minValue: 0,
        colors: ['#FF6E76', '#FDDD60', '#7CFFB2', '#FDDD60', '#FF6E76'],
        thresholds: [0.10, 0.30, 0.70, 0.90, 1.00],
        lastValue: NaN,
    };
    return gaugeChart;
}
