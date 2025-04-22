import type { ChartSetting } from "@monitoring/shared/model";

export function getDefaultGaugeChartOptions(setting : ChartSetting) {


    const options={
        grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            containLabel: false
        },
        series: [{
            type: 'gauge',
            animation: false,//ページ切り替え時に以前の値を保持しているように見せるため、初期値だけアニメーションさせない
            radius: '138%',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '75%'],
            min: setting.specific_chart_setting.minValue,
            max: setting.specific_chart_setting.maxValue,
            splitNumber: 8,
            axisLine: {
                lineStyle: {
                    width: 6,
                    color: [
                        [1, '#696969'],
                    ]
                }
            },
            pointer: {
                offsetCenter: [0, 0],
                itemStyle: {
                    color: 'auto'
                }
            },
            axisTick: {
                length: 12,
                lineStyle: {
                    color: 'auto',
                    width: 2
                }
            },
            splitLine: {
                length: 20,
                lineStyle: {
                    color: 'auto',
                    width: 5
                }
            },
            axisLabel: {
                show: false
            },
            title: {
                offsetCenter: [0, '-10%'],
                fontSize: 18
            },
            detail: {
                show:true,
                fontSize: 35,
                offsetCenter: [0, '-35%'],
                valueAnimation: true,
                formatter: (value:number) => value.toFixed(2),
                color: 'inherit'
            },
            data: [{
                value: 0,
                show: false
            }]
        }]
    };
    return options;
}