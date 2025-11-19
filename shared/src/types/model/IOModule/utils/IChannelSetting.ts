import { NormalizeConfig,ThresholdConfig } from "@shared/types/model/IOModule/utils";
/**
 * チャンネル設定の基底インターフェース。固有の設定を追加する場合はこのインターフェースを継承してプロパティを追加する。
 */
export interface IChannelSetting<T={}> {
    readonly module_uuid: string; //所属するモジュールのUUID
    channel_uuid: string; //チャンネルのID(登録時に連番で振られる)
    channel_name: string; //チャンネルの名前
    readonly direction: "input" | "output";//チャンネルの役割（入力か出力か）
    channel_number: number; //所属するモジュール内でのチャンネルの番号  
    unit: string; //チャンネルの単位
    decimals: number; //チャンネルの小数点以下桁数
    sampling_interval_uuid: string; //サンプリングインターバルのUUID
    normalize: NormalizeConfig; //正規化設定
    threshold: ThresholdConfig; //閾値設定
    created_at: Date; //チャンネルの作成日時
    updated_at: Date; //チャンネルの更新日時
    specific_channel_setting: T; //チャンネルに固有の設定
}
