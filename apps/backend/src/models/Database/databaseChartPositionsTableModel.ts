export interface databaseChartPositionTableModel {
    chart_id: number; //グラフのID
    position_x: number; //グラフのX座標
    position_y: number; //グラフのY座標
    created_at: Date; //グラフの作成日時
    updated_at: Date; //グラフ表示位置の更新日時
}