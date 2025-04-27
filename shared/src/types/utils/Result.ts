export type Result<T,E= string> = 
  | { ok: true; value: T }         // 成功時
  | { ok: false; error: E };  // エラー時

export function ok<T,E=string>(value: T): Result<T,E> {
  return { ok: true, value };
}

export function err<E=string>(error: E): Result<never,E> {
  return { ok: false, error };
}

export function isOk<T, E>(r: Result<T, E>): r is { ok: true; value: T } {
  return r.ok;
}

export function isErr<T, E>(r: Result<T, E>): r is { ok: false; error: E } {
  return !r.ok;
}