import { databaseDashboardChartsTableModel } from "src/models/Database/databaseDashboardChartsTableModel";
import { ChartConfig, createChartForInitialization } from "@monitoring/shared/model";
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
>(DashboardChartData: databaseDashboardChartsTableModel & { chart_type: T }
): ChartConfig {

    const specific_chart_setting = JSON.parse(DashboardChartData.specific_chart_setting);

    const chart = GenerateChartSetting(DashboardChartData, specific_chart_setting);

    return chart;
}

function GenerateChartSetting(DashboardChartData: databaseDashboardChartsTableModel, specificChartSetting: any): ChartConfig {
    let chart: ChartConfig = createChartForInitialization(DashboardChartData.chart_type);
    chart.chart_options = specificChartSetting;

    return chart;
}