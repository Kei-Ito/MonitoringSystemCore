import { ChartTypes } from "@shared/enum";
import { ChartConfig } from "@shared/types/model/ChartConfig";
import { gridLayoutFactory } from "@shared/types/model/ChartConfig";
import * as Charts from "@shared/types/model/ChartConfig/Charts"
import { v4 as uuidv4 } from "uuid"



// ハンドラのマッピング
const SpecificChartSetting: Record<ChartTypes, any> = {
    [ChartTypes.GaugeChart]: Charts.createGaugeChartSpecificSetting(),
    // TODO: 必要があれば、HorizontalBarChartの固有設定を保存するデータ構造を作成する
    [ChartTypes.HorizontalBarChart]: ()=> Charts.createHorizontalBarChartSpecificSetting(),
    // 新規モジュールタイプを追加するときはここにハンドラを登録
    // 例: [IOModuleTypes.XYZModule]: new XYZModuleHandler(),
    [ChartTypes.LineChart]: Charts.createLineChartSpecificSetting(),
    [ChartTypes.BarChart]: Charts.createBarChartSpecificSetting(),
};


export function createChartForInitialization(chart_type: ChartTypes): ChartConfig {

    const specific_chart_setting = SpecificChartSetting[chart_type];
    if (!specific_chart_setting) {
        throw new Error(`ChartType :${chart_type} はファクトリメソッドで未対応です。`);
    }

    const chart_uuid = uuidv4();

    const chart_setting: ChartConfig = {
        chart_uuid: chart_uuid,
        chart_type: chart_type,
        channel_uuids: [],
        chart_title: "",
        chart_unit: "",
        grid_layout: gridLayoutFactory(chart_uuid),
        //TODO: 要検討、EChartsの仕様に合わせるか？
        chart_options: specific_chart_setting,
        category1:null,
        category2:null,
    }

    return chart_setting;
}

