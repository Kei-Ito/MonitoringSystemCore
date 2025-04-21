// src/models/sensorModel.ts
import { IOModuleTypes } from '@monitoring/shared/enum';

export interface databaseModuleTableModel {
  module_uuid: string;         // 各センサのユニークID
  module_type: IOModuleTypes;  // センサの種類（特定のIOモジュールなど）
  module_name: string;         // センサの名前
  input_channel_num: number;    // センサの入力チャンネル数
  output_channel_num: number;   // センサの出力チャンネル数
  specific_device_setting: string;   // デバイスに固有の設定
  created_at: string;     // 作成日時
  updated_at: string;     // 更新日時
  is_editable_input_channel: boolean;       // 入力チャンネルの編集が可能かどうか
  is_editable_output_channel: boolean;      // 出力チャンネルの編集が可能かどうか
}