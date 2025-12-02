import * as json from 'src/utils/json';
import { SystemSettingData, SamplingInterval } from "@monitoring/shared/model";
import { Result } from "@monitoring/shared/utils";
import { v4 as uuidv4 } from 'uuid';

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
        const interval1: SamplingInterval = {
            uuid: uuidv4(),
            name: '高速サンプリング',
            period: 60000,
            requiresAdmin: false
        };
        const interval2: SamplingInterval = {
            uuid: uuidv4(),
            name: '低速サンプリング',
            period: 300000,
            requiresAdmin: false
        };
        return {
            samplingIntervals: [interval1, interval2],
            dataRootPath: "",
            driveUUID: "",
            dataRetentionDays: 365, // デフォルト: 1年間
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
            const defaultSetting = this.createDefaultSystemSetting();
            let needsSave = false;
            
            // samplingIntervalsがない場合はデフォルトを設定
            if (!this._systemSetting.samplingIntervals) {
                this._systemSetting.samplingIntervals = defaultSetting.samplingIntervals;
                needsSave = true;
            } else {
                // 既存のサンプリングインターバルにrequiresAdminがない場合はデフォルト値を設定
                for (const interval of this._systemSetting.samplingIntervals) {
                    if (interval.requiresAdmin === undefined) {
                        interval.requiresAdmin = false;
                        needsSave = true;
                    }
                }
            }
            
            // dataRetentionDaysがない場合はデフォルトを設定
            if (this._systemSetting.dataRetentionDays === undefined) {
                this._systemSetting.dataRetentionDays = defaultSetting.dataRetentionDays;
                needsSave = true;
            }
            
            if (needsSave) {
                await this.saveSystemSetting();
            }
        } else {
            await this.setSystemSetting(this.createDefaultSystemSetting());
        }
    }


    /**
     * システム設定をデータベースに保存する
     */
    private async saveSystemSetting(): Promise<void> {
        const defaultSetting = this.createDefaultSystemSetting();
        const systemSetting: SystemSettingData = {
            samplingIntervals: this._systemSetting?.samplingIntervals ?? defaultSetting.samplingIntervals,
            dataRootPath: this._systemSetting?.dataRootPath ?? "",
            driveUUID: this._systemSetting?.driveUUID ?? "",
            dataRetentionDays: this._systemSetting?.dataRetentionDays ?? defaultSetting.dataRetentionDays,
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