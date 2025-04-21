import { ChartTypes } from "@monitoring/shared/enum";

export interface databaseDashboardChartsTableModel {
    chart_id:number; //グラフのID
    module_uuid: string; //グラフに表示するモジュールのUUID
    channel_id: number; //グラフに表示するチャンネルのID
    chart_type: ChartTypes; //グラフの種類
    created_at: Date; //グラフ設定の作成日時
    updated_at: Date; //グラフ設定の更新日時
    specific_chart_setting: string; // グラフに固有の設定
}