export interface databaseChannelTableModel {
    channel_id: number; //チャンネルのID(登録時に連番で振られる)
    module_uuid: string; //所属するモジュールのUUID
    channel_name: string; //チャンネルの名前
    direction: "input" | "output";//チャンネルの役割（入力か出力か）
    channel_number: number; //所属するモジュール内でのチャンネルの番号
    unit: string; //チャンネルの単位
    decimals: number; //チャンネルの小数点以下桁数
    src_min: number; //チャンネルの最小値
    src_max: number; //チャンネルの最大値
    dst_min: number; //チャンネルの変換後の最小値
    dst_max: number; //チャンネルの変換後の最大値
    min_threshold: number; //チャンネルの最小閾値
    max_threshold: number; //チャンネルの最大閾値
    created_at: Date; //チャンネルの作成日時
    updated_at: Date; //チャンネルの更新日時
    specific_channel_setting: string; // チャンネルに固有の設定
}