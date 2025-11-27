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
  private async mountDriveByUUID(uuid: string): Promise<{ success: boolean; mountPoint?: string }> {
    try {
      // udisksctlを使用してマウント（sudoなし、自動的にマウントポイントが作成される）
      const mountCommand = `udisksctl mount -b /dev/disk/by-uuid/${uuid}`;
      console.log(`Attempting to mount drive with UUID: ${uuid}`);
      
      const { stdout, stderr } = await execAsync(mountCommand);
      
      // udisksctlの出力からマウントポイントを抽出
      // 例: "Mounted /dev/sda1 at /media/linaro/HD-WHAU3"
      const mountPointMatch = stdout.match(/at\s+(.+?)[\.\s]*$/);
      const mountPoint = mountPointMatch ? mountPointMatch[1].trim() : undefined;
      
      if (mountPoint) {
        console.log(`✓ Successfully mounted drive at: ${mountPoint}`);
        return { success: true, mountPoint };
      } else {
        console.log(`✓ Drive mounted but mount point could not be determined`);
        console.log(`Output: ${stdout}`);
        return { success: true };
      }
    } catch (error: any) {
      // ドライブが既にマウントされている場合のエラーを処理
      if (error.stderr?.includes('already mounted') || error.message?.includes('already mounted')) {
        console.log(`ℹ Drive with UUID ${uuid} is already mounted`);
        // 既存のマウントポイントを取得
        try {
          const { stdout } = await execAsync(`findmnt -rno TARGET /dev/disk/by-uuid/${uuid}`);
          const existingMountPoint = stdout.trim();
          if (existingMountPoint) {
            console.log(`✓ Existing mount point: ${existingMountPoint}`);
            return { success: true, mountPoint: existingMountPoint };
          }
        } catch (findError) {
          console.warn(`Could not determine existing mount point`);
        }
        return { success: true };
      }
      
      console.error(`✗ Failed to mount drive:`, error.message || error);
      return { success: false };
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
        const mountResult = await this.mountDriveByUUID(driveUUID);
        
        if (mountResult.success) {
          // マウント成功後、設定されたパスまたは実際のマウントポイントでアクセス確認
          const pathToCheck = mountResult.mountPoint || dataRootPath;
          
          try {
            await fs.promises.access(pathToCheck, fs.constants.R_OK | fs.constants.W_OK);
            this.healthStatus.drivesMounted = true;
            
            // 実際のマウントポイントが設定パスと異なる場合は警告
            if (mountResult.mountPoint && mountResult.mountPoint !== dataRootPath) {
              console.warn(`⚠ Drive mounted at ${mountResult.mountPoint}, but configured path is ${dataRootPath}`);
              this.healthStatus.errors.push(
                `Drive mounted at different location: ${mountResult.mountPoint} (configured: ${dataRootPath})`
              );
            } else {
              console.log(`✓ Drive mounted and verified: ${pathToCheck}`);
            }
            return;
          } catch (verifyError) {
            this.healthStatus.drivesMounted = false;
            this.healthStatus.errors.push(`Drive mounted but not accessible: ${pathToCheck}`);
            console.error(`✗ Drive mounted but verification failed: ${pathToCheck}`);
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
