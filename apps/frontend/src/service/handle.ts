// services/handle.ts
import type { ApiError } from '@monitoring/shared/api';      // 上で定義した構造体
import { err, ok, type Result } from '@monitoring/shared/utils';
import { useToast } from 'vue-toastification';

const toast = useToast();

/** ----------------------------------------------------------
 * APIリクエスト用の共通ハンドラ
 * ----------------------------------------------------------
 * @template R   API が返す成功値の型
 * @template U   onSuccess が返す値（void で十分なら省略可）

 * apiCall   : () => Promise<Result<R,ApiError>>  API を呼び出す関数
 * onSuccess : (val: R) => U            成功時に実行するコールバック
 * successMsg: string | undefined       トーストの成功文言（不要なら undefined）
 * errorMsg  : string | undefined       トーストの失敗文言（不要なら undefined）
 */
export async function handleApiRequest<R, U = void>({
  apiCall,
  onSuccess,
  successMsg,
  errorMsg,
}: {
  apiCall: () => Promise<Result<R,ApiError>>;          // 必須
  onSuccess?: (val: R) => U;                  // 成功時のコールバック
  successMsg?: string;                        // 成功トースト
  errorMsg?: string;                          // 失敗トースト
}): Promise<Result<U,ApiError>> {
  const res = await apiCall();                // 必ず resolve する Result

  if (!res.ok) {
    if (errorMsg) toast.error(errorMsg);
    return err<ApiError>(res.error);          // Result<ApiError>
  }

  try {
    const value = onSuccess?.(res.value) as U;
    if (successMsg) toast.success(successMsg);
    return ok<U,ApiError>(value as U);                
  } catch (e) {
    // onSuccess 内の例外も ApiError に包んで返す
    const fail: ApiError = { message: (e as Error).message };
    toast.error(errorMsg ?? '処理中にエラーが発生しました');
    return err<ApiError>(fail);
  }
}
