import type { SystemHealth } from '../model/SystemHealth/SystemHealth';

/**
 * ヘルスチェックAPIレスポンス
 */
export interface HealthCheckResponse {
  success: boolean;
  data: SystemHealth;
}
