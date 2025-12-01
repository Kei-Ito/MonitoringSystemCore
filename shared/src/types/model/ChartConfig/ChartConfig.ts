import { ChartTypes } from '@shared/enum/ChartTypes';
import { TrendPresetMode } from '@shared/enum/TrendPresetMode';

import { GridLayout } from './utils/GridLayout';

export interface ChartConfig {
    readonly chart_uuid: string;
    chart_type:ChartTypes;
    channel_uuids: string[];
    chart_title: string;
    chart_unit: string;
    grid_layout: GridLayout; 
    chart_options: any;
    category1: string|null;
    category2: string|null;
}

export interface ChartOptions {
    isCumulative?: boolean;
    cumulativeIntervalMinutes?: number;
    /** 個別の表示区間設定を使用するかどうか */
    useCustomDateRange?: boolean;
    /** 個別のプリセットモード */
    customPresetMode?: TrendPresetMode;
    /** カスタム期間の開始日（ISO 8601形式の文字列） */
    customStartDate?: string;
    /** カスタム期間の終了日（ISO 8601形式の文字列） */
    customEndDate?: string;
}
