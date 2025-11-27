import { Request, Response, RequestHandler } from 'express';
import HealthCheckService from '../services/healthCheckService';
import type { HealthCheckResponse } from '@monitoring/shared/api';

/**
 * システムヘルスチェック
 */
export const getHealthCheck: RequestHandler = async (req: Request, res: Response) => {
  try {
    const healthService = HealthCheckService.getInstance();
    
    // 最新状態を再チェック
    await healthService.checkDriveMount();
    
    const healthStatus = healthService.getHealthStatus();
    
    const response: HealthCheckResponse = {
      success: true,
      data: healthStatus
    };
    
    res.json(response);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
}
