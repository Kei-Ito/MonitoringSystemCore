// src/utils/result.ts

export type Result<T> = 
  | { ok: true; value: T }         // 成功時
  | { ok: false; error: string };  // エラー時

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err<T>(error: string): Result<T> {
  return { ok: false, error };
}
