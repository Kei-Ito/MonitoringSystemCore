export interface OutputChannel {
    module_uuid: string;         // 所属するモジュールのUUID
    output_channel_number: number;  // 出力チャンネルの番号
    output_channel_name: string;  // 出力チャンネルの名前
    created_at: Date;            // 出力チャンネルの作成日時
    updated_at: Date;            // 出力チャンネルの更新日時
}