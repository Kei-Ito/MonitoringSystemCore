import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { SystemSettingService } from '../config/SystemSetting.js';
import type { SystemHealth } from '@monitoring/shared/model';

const execAsync = promisify(exec);

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
   * UUIDを使用してドライブをマウント
   */
  private async mountDriveByUUID(uuid: string, mountPoint: string): Promise<boolean> {
    try {
      // マウントポイントのディレクトリが存在しない場合は作成
      try {
        await fs.promises.access(mountPoint);
      } catch {
        await fs.promises.mkdir(mountPoint, { recursive: true });
        console.log(`Created mount point: ${mountPoint}`);
      }

      // sudoを使ってマウント実行
      const mountCommand = `sudo mount -U ${uuid} ${mountPoint}`;
      console.log(`Attempting to mount drive with UUID: ${uuid} to ${mountPoint}`);
      
      await execAsync(mountCommand);
      console.log(`✓ Successfully mounted drive: ${mountPoint}`);
      return true;
    } catch (error) {
      console.error(`✗ Failed to mount drive:`, error);
      return false;
    }
  }

  /**
   * ドライブマウント状態をチェック
   */
  public async checkDriveMount(): Promise<void> {
    const configService = SystemSettingService.getInstance();
    const systemSetting = configService.getSystemSetting();
    const dataRootPath = systemSetting.dataRootPath;
    const driveUUID = systemSetting.driveUUID;
    
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
      console.warn(`⚠ Drive not accessible: ${dataRootPath}`);
      
      // UUIDが設定されている場合はマウントを試行
      if (driveUUID) {
        console.log(`Attempting to mount drive with UUID: ${driveUUID}`);
        const mountSuccess = await this.mountDriveByUUID(driveUUID, dataRootPath);
        
        if (mountSuccess) {
          // マウント成功後、再度アクセス確認
          try {
            await fs.promises.access(dataRootPath, fs.constants.R_OK | fs.constants.W_OK);
            this.healthStatus.drivesMounted = true;
            console.log(`✓ Drive mounted and verified: ${dataRootPath}`);
            return;
          } catch (verifyError) {
            this.healthStatus.drivesMounted = false;
            this.healthStatus.errors.push(`Drive mounted but not accessible: ${dataRootPath}`);
            console.error(`✗ Drive mounted but verification failed: ${dataRootPath}`);
          }
        } else {
          this.healthStatus.drivesMounted = false;
          this.healthStatus.errors.push(`Failed to mount drive with UUID: ${driveUUID}`);
        }
      } else {
        this.healthStatus.drivesMounted = false;
        this.healthStatus.errors.push(`Drive not accessible and UUID not configured: ${dataRootPath}`);
        console.error(`✗ Drive not mounted and UUID not set: ${dataRootPath}`);
      }
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
