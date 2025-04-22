import { databaseDashboardChartsTableModel } from "src/models/Database/databaseDashboardChartsTableModel";
import { ChartSetting,ChartTypeMap, createChartForInitialization,ChartPosition } from "@monitoring/shared/model";
import { ChartTypes } from "@monitoring/shared/enum";

/**
 * データベースから取得したデータをもとにIOModuleを生成するファクトリメソッド
 * @summary バックエンドのデータベース仕様に依存するメソッドなのでバックエンドのみに実装する
 * @param IOModuleDatas データベースから取得したIOModuleのデータ
 * @param InputChannelDatas データベースから取得したInputChannelのデータ
 * @param OutputChannelDatas データベースから取得したOutputChannelのデータ
 * @returns IOモジュールのインスタンス
 */
export function DashboardChartsFactory_from_Database<
    T extends ChartTypes
>(DashboardChartData: databaseDashboardChartsTableModel & { chart_type: T },
    chart_position: ChartPosition
): ChartSetting {

    const specific_chart_setting = JSON.parse(DashboardChartData.specific_chart_setting) as ChartTypeMap[T];

    const chart = GenerateChartSetting(DashboardChartData, specific_chart_setting, chart_position);

    return chart;
}

function GenerateChartSetting(DashboardChartData: databaseDashboardChartsTableModel, specificChartSetting: any, chart_position: ChartPosition): ChartSetting {
    let chart: ChartSetting = createChartForInitialization(DashboardChartData.chart_id, DashboardChartData.chart_type);
    chart.module_uuid = DashboardChartData.module_uuid;
    chart.channel_id = DashboardChartData.channel_id;
    chart.specific_chart_setting = specificChartSetting;
    chart.chart_position = chart_position;

    return chart;
}