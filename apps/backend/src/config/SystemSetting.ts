import * as database from "src/services/databaseService";
import { SystemSettingData } from "@monitoring/shared/model";
import { Result } from "@monitoring/shared/utils";

export class SystemSettingService {
    // シングルトンのインスタンスを保持するための静的プロパティ
    private static _instance: SystemSettingService | null = null;

    /**
     * サンプリング周期（ミリ秒）
     */
    private _samplingInterval: number = 1000;

    /**
     * コンストラクタをprivateにすることで、外部からのインスタンス生成を禁止する
     */
    private constructor() {
    }

    /**
     * シングルトンのインスタンスを取得する
     */
    public static getInstance(): SystemSettingService {
        if (!SystemSettingService._instance) {
            SystemSettingService._instance = new SystemSettingService();
        }
        return SystemSettingService._instance;
    }

    private createDefaultSystemSetting(): SystemSettingData {
        return {
            samplingInterval: 1000
        };
    }

    /**
     * データベースからシステム設定を読み込む
     */
    public async loadSystemSettingFromDatabase(): Promise<void> {
        const result: Result<SystemSettingData> = await database.getSystemSetting();
        if (result.ok) {
            this._samplingInterval = result.value.samplingInterval;
        } else {
            await database.registerSystemSetting(this.createDefaultSystemSetting());
            await this.setSystemSetting(this.createDefaultSystemSetting());
        }
    }

    /**
     * サンプリング周期を取得する
     */
    public get samplingInterval(): number {
        return this._samplingInterval;
    }

    /**
     * サンプリング周期を設定し、データベースに保存する
     */
    public set samplingInterval(value: number) {
        this._samplingInterval = value;
        this.saveSystemSetting();
    }

    /**
     * システム設定をデータベースに保存する
     */
    private async saveSystemSetting(): Promise<void> {
        const systemSetting = {
            samplingInterval: this._samplingInterval
        };
        await database.setSystemSetting(systemSetting);
    }

    public async setSystemSetting(setting:SystemSettingData): Promise<void> {
        this._samplingInterval = setting.samplingInterval;
        this.saveSystemSetting();
    }

    /**
     * システム設定を取得する
     */
    public getSystemSetting(): SystemSettingData {
        return {
            samplingInterval: this._samplingInterval
        };
    }
}

export default SystemSettingService.getInstance();