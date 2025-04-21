import { ChartSetting } from "@shared/types/model/ChartSetting";
import { ChartTypes } from "@shared/enum";
import * as Handlers from "./Handlers";
import * as Charts from "@shared/types/model/ChartSetting/Charts"

// ハンドラのマッピング
const SpecificChartSetting: Record<ChartTypes, any> = {
    [ChartTypes.GaugeChart]: Handlers.createGaugeChartSpecificSetting(),
    // 新規モジュールタイプを追加するときはここにハンドラを登録
    // 例: [IOModuleTypes.XYZModule]: new XYZModuleHandler(),
};

export interface ChartTypeMap {
    [ChartTypes.GaugeChart]: Charts.GaugeChart;
    // 新規モジュールタイプを追加するときはここにモジュールを登録
    // 例: [IOModuleTypes.XYZModule]:IModules.XYZModule;
}

export function createChartForInitialization(chart_id: number, chart_type: ChartTypes): ChartSetting {

    const specific_chart_setting = SpecificChartSetting[chart_type];
    if (!specific_chart_setting) {
        throw new Error(`ChartType :${chart_type} はファクトリメソッドで未対応です。`);
    }
    const chart_setting: ChartSetting = {
        chart_id: chart_id,
        module_uuid: "",
        channel_id: -1,
        chart_type: chart_type,
        chart_position: {
            chart_id: chart_id,
            x: 0,
            y: 0,
            width: 0,
            height: 0
        },
        specific_chart_setting: specific_chart_setting
    }

    return chart_setting;
}

