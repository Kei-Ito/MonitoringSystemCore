import { request } from './apiClient';
import type { Result } from '@monitoring/shared/utils';
import type { ApiError } from '@monitoring/shared/api';

/**
 * システムをシャットダウンする
 */
export const shutdownSystem = (): Promise<Result<{ success: boolean; message: string }, ApiError>> => {
  return request({
    method: 'POST',
    url: '/system/shutdown'
  });
};

/**
 * システムを再起動する
 */
export const rebootSystem = (): Promise<Result<{ success: boolean; message: string }, ApiError>> => {
  return request({
    method: 'POST',
    url: '/system/reboot'
  });
};
