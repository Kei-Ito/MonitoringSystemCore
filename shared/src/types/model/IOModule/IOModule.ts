import { IOModuleTypes } from '@shared/enum/IOModuleTypes';
import { IOModuleStatus } from '@shared/enum/IOModuleStatus';
import { IChannelSetting} from '@shared/types/model/IOModule/utils/IChannelSetting';

/**
 * IOモジュールに関する設定をまとめた基底インターフェース
 */
export interface IOModule<
  D = {}, // デバイス固有設定
  IC = {}, // 入力チャンネル固有設定
  OC = {}  // 出力チャンネル固有設定
  >{
    module_uuid: string;         // 各モジュールのユニークID
    module_type: IOModuleTypes;  // モジュールの種類（特定のIOモジュールなど）
    module_name: string;         // モジュールの名前
    status: IOModuleStatus;     // モジュールのステータス（例：active, inactiveなど）
    input_channel_num: number;    // モジュールの入力チャンネル数
    output_channel_num: number;   // モジュールの出力チャンネル数
    created_at: Date;            // モジュールの作成日時
    updated_at: Date;            // モジュールの更新日時
    specific_device_setting: D;   // デバイスに固有の設定
    input_channels: IChannelSetting<IC>[];    // モジュールの入力チャンネル
    output_channels: IChannelSetting<OC>[];   // モジュールの出力チャンネル
    is_editable_input_channel: boolean;       // 入力チャンネルの編集が可能かどうか
    is_editable_output_channel: boolean;      // 出力チャンネルの編集が可能かどうか
}
