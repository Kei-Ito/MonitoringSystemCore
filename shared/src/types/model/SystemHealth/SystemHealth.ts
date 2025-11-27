/**
 * システムヘルスチェック結果
 */
export interface SystemHealth {
  drivesMounted: boolean;
  dataRootPath: string;
  errors: string[];
}
