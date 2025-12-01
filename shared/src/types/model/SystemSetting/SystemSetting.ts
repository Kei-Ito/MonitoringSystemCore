import { SamplingInterval } from './samplingInterval';

export interface SystemSettingData {
    samplingIntervals: SamplingInterval[]; // 2種類のインターバル設定
    dataRootPath: string;
    driveUUID?: string; // ドライブのUUID（マウントに使用）
    dataRetentionDays: number; // データ保存期間（日数）。この期間を過ぎたデータは自動削除される
    category1list: string[];
    category2list: string[];
    dashboardViewCategory1Selected: string[];
    dashboardViewCategory2Selected: string[];
    trendViewCategory1Selected: string[];
    trendViewCategory2Selected: string[];
}  