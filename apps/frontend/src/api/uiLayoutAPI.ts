import type { UiLayout } from '@monitoring/shared/api';

import { request } from '@/api/apiClient';

/**
 * UIレイアウト（ダッシュボードやトレンドページのレイアウト）を取得するAPI関数
 * 
 * @returns UIのレイアウト
 */
export const getUiLayouts = () => request<UiLayout>('get', '/ui/layouts/');

/**
 * UIレイアウトを更新するAPI関数
 * （削除や追加を含む）
 * 
 * @param layout - 更新後のレイアウト
 */
export const updateUiLayouts = (layout: UiLayout) => request<void>('post', '/ui/layouts/', layout);