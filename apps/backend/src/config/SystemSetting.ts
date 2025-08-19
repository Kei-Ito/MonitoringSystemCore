import * as json from 'src/utils/json';
import { SystemSettingData } from "@monitoring/shared/model";
import { Result } from "@monitoring/shared/utils";

const jsonPath = './LocalData/systemSetting.json';

export class SystemSettingService {
    // シングルトンのインスタンスを保持するための静的プロパティ
    private static _instance: SystemSettingService | null = null;

    /**
     * サンプリング周期（ミリ秒）
     */
    private _systemSetting: SystemSettingData | null = null;

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
            samplingInterval: 1000,
            dataRootPath: "",
            category1list: [],
            category2list: [],
            dashboardViewCategory1Selected: [],
            dashboardViewCategory2Selected: [],
            trendViewCategory1Selected: [],
            trendViewCategory2Selected: []
        };
    }

    /**
     * データベースからシステム設定を読み込む
     */
    public async loadSystemSettingFromDatabase(): Promise<void> {
        const result: Result<SystemSettingData> = await json.loadJson<SystemSettingData>(jsonPath);
        if (result.ok) {
            this._systemSetting = result.value;
        } else {
            await this.setSystemSetting(this.createDefaultSystemSetting());
        }
    }

    /**
     * サンプリング周期を取得する
     */
    public get samplingInterval(): number {
        return this._systemSetting?.samplingInterval ?? 1000;
    }

    /**
     * サンプリング周期を設定し、データベースに保存する
     */
    public set samplingInterval(value: number) {
        if (!this._systemSetting) {
            this._systemSetting = this.createDefaultSystemSetting();
        }
        this._systemSetting = {
            ...this._systemSetting,
            samplingInterval: value
        };
        this.saveSystemSetting();
    }

    /**
     * システム設定をデータベースに保存する
     */
    private async saveSystemSetting(): Promise<void> {
        const systemSetting: SystemSettingData = {
            samplingInterval: this._systemSetting?.samplingInterval ?? 1000,
            dataRootPath: this._systemSetting?.dataRootPath ?? "",
            category1list: this._systemSetting?.category1list ?? [],
            category2list: this._systemSetting?.category2list ?? [],
            dashboardViewCategory1Selected: this._systemSetting?.dashboardViewCategory1Selected ?? [],
            dashboardViewCategory2Selected: this._systemSetting?.dashboardViewCategory2Selected ?? [],
            trendViewCategory1Selected: this._systemSetting?.trendViewCategory1Selected ?? [],
            trendViewCategory2Selected: this._systemSetting?.trendViewCategory2Selected ?? []
        };
        await json.saveJson(jsonPath, systemSetting);
    }

    public async setSystemSetting(setting:SystemSettingData): Promise<void> {
        this._systemSetting = setting;
        this.saveSystemSetting();
    }

    /**
     * システム設定を取得する
     */
    public getSystemSetting(): SystemSettingData {
        return this._systemSetting ?? this.createDefaultSystemSetting();
    }
}

export default SystemSettingService.getInstance();