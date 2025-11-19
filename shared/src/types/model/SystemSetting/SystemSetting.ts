import { SamplingInterval } from './samplingInterval';

export interface SystemSettingData {
    samplingInterval: number; // 既存の設定(後方互換性のため保持)
    samplingIntervals: [SamplingInterval, SamplingInterval]; // 2種類のインターバル設定
    dataRootPath: string;
    category1list: string[];
    category2list: string[];
    dashboardViewCategory1Selected: string[];
    dashboardViewCategory2Selected: string[];
    trendViewCategory1Selected: string[];
    trendViewCategory2Selected: string[];
}  