import type { ApiError } from '@monitoring/shared/api';
import { err, ok, type Result } from '@monitoring/shared/utils';
import axios, { AxiosError, type Method } from 'axios';

export interface requestParams {
  method: Method;
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  signal?: AbortSignal;
}

function toApiError(e: unknown): ApiError {
  if (axios.isAxiosError(e)) {
    return {
      message: e.message,
      status: e.response?.status,
      code: e.code,
      data: e.response?.data,
    };
  }
  return { message: (e as Error).message };
}

const api = axios.create({
  baseURL: `/api`,
  timeout: 1000,
});

// 成功・失敗ログを一括管理するためのインターセプター
api.interceptors.response.use(
  (res) => { console.debug(res.config.url, res.data); return res; },
  (error: AxiosError) => Promise.reject(error)
);

/** apiリクエストを一括管理するメソッド */
export async function request<T>(
  { method, url, data, params, signal }: requestParams
): Promise<Result<T,ApiError>> {
  try {
    const res = await api.request<T>({ method, url, data, params, signal });
    return ok(res.data);
  } catch (e) {
    // responseに届かない場合に備えてインターセプターではなくここでcatchする
    console.error({url,e});
    return err(toApiError(e));
  }
}
