import fs from 'fs';
import { SystemSettingService } from '../config/SystemSetting.js';
import type { SystemHealth } from '@monitoring/shared/model';

/**
 * グローバルなヘルスチェック状態
 */
class HealthCheckService {
  private static instance: HealthCheckService;
  private healthStatus: SystemHealth = {
    drivesMounted: true,
    dataRootPath: '',
    errors: []
  };

  private constructor() {}

  public static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

  /**
   * ドライブマウント状態をチェック
   */
  public async checkDriveMount(): Promise<void> {
    const configService = SystemSettingService.getInstance();
    const dataRootPath = configService.getSystemSetting().dataRootPath;
    
    this.healthStatus.dataRootPath = dataRootPath;
    this.healthStatus.errors = [];

    if (!dataRootPath) {
      this.healthStatus.drivesMounted = false;
      this.healthStatus.errors.push('dataRootPath is not configured in system settings');
      console.warn('⚠ dataRootPath is not configured');
      return;
    }

    try {
      await fs.promises.access(dataRootPath, fs.constants.R_OK | fs.constants.W_OK);
      this.healthStatus.drivesMounted = true;
      console.log(`✓ Drive mounted successfully: ${dataRootPath}`);
    } catch (error) {
      this.healthStatus.drivesMounted = false;
      this.healthStatus.errors.push(`Drive not accessible: ${dataRootPath}`);
      console.error(`✗ Drive not mounted: ${dataRootPath}`);
    }
  }

  /**
   * 現在のヘルスチェック状態を取得
   */
  public getHealthStatus(): SystemHealth {
    return { ...this.healthStatus };
  }
}

export default HealthCheckService;
