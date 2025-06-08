import { ChartConfig } from '@shared/types/model/ChartConfig';

/**
 * UIレイアウト（ダッシュボードやトレンドページのレイアウト）を表すインターフェース
 * 'dashboard' や 'trend' などのキーに対して、ChartConfigの配列を持つオブジェクト
 */
export interface UiLayout {
    [key: string]: ChartConfig[];
}