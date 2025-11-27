import { request } from './apiClient';
import type { Result } from '@monitoring/shared/utils';
import type { ApiError } from '@monitoring/shared/api';
import type { HealthCheckResponse } from '@monitoring/shared/api';

/**
 * システムヘルスチェック
 */
export const getHealthCheck = (): Promise<Result<HealthCheckResponse, ApiError>> => {
  return request({
    method: 'GET',
    url: '/health/check'
  });
};
