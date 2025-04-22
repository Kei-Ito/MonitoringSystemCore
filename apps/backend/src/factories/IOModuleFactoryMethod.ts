
import { databaseModuleTableModel } from "src/models/Database/databaseModuleTableModel";
import { databaseChannelTableModel } from "src/models/Database/databaseChannelTableModel";
import { IOModule,IChannelSetting,createModuleForInitialization,ModuleTypeMap } from "@monitoring/shared/model";
import { IOModuleStatus ,IOModuleTypes} from "@monitoring/shared/enum";

/**
 * データベースから取得したデータをもとにIOModuleを生成するファクトリメソッド
 * @summary バックエンドのデータベース仕様に依存するメソッドなのでバックエンドのみに実装する
 * @param IOModuleDatas データベースから取得したIOModuleのデータ
 * @param InputChannelDatas データベースから取得したInputChannelのデータ
 * @param OutputChannelDatas データベースから取得したOutputChannelのデータ
 * @returns IOモジュールのインスタンス
 */
export function IOModuleFactory_from_Database<
T extends IOModuleTypes
>(IOModuleDatas: databaseModuleTableModel & { module_type: T }, // module_typeをTで表現,
  InputChannelDatas: databaseChannelTableModel[],
  OutputChannelDatas: databaseChannelTableModel[]): IOModule {

  // IOModuleの型を生成
  type ModuleType<T extends IOModuleTypes> = ModuleTypeMap[T];

  // ユーティリティ型を定義して、input_channelsとoutput_channelsのジェネリック型を取得
  type DeviceSettingGenericType = ModuleType<T>['specific_device_setting'];
  type InputChannelGenericType = ModuleType<T>['input_channels'][number]['specific_channel_setting'];
  type OutputChannelGenericType =  ModuleType<T>['output_channels'][number]['specific_channel_setting'];

  const specific_device_setting = DeviceSettingFactory_from_Database<DeviceSettingGenericType>(IOModuleDatas.specific_device_setting);
  const input_channels = ChannelFactory_from_Database<InputChannelGenericType>(InputChannelDatas);
  const output_channels = ChannelFactory_from_Database<OutputChannelGenericType>(OutputChannelDatas);

  
  const module = GenerateIOModule<DeviceSettingGenericType, InputChannelGenericType, OutputChannelGenericType>(IOModuleDatas, specific_device_setting, input_channels, output_channels);
  
  return module;
}

function GenerateIOModule<S extends{},T extends{},U extends{}>(IOModuleDatas: databaseModuleTableModel, specificDeviceSetting:S,InputChannels: IChannelSetting<T>[], OutputChannels: IChannelSetting<U>[]): IOModule {
  let module :IOModule = createModuleForInitialization(IOModuleDatas.module_uuid, IOModuleDatas.module_name, IOModuleDatas.module_type);
  module.module_uuid = IOModuleDatas.module_uuid;
  module.module_type=IOModuleDatas.module_type;
  module.module_name=IOModuleDatas.module_name;
  module.status = IOModuleStatus.Unknown;
  module.input_channel_num = InputChannels.length;
  module.output_channel_num = OutputChannels.length;
  module.created_at = new Date(IOModuleDatas.created_at);
  module.updated_at = new Date(IOModuleDatas.updated_at);
  module.specific_device_setting = specificDeviceSetting;
  module.input_channels = InputChannels;
  module.output_channels = OutputChannels;
  module.is_editable_input_channel = IOModuleDatas.is_editable_input_channel;
  module.is_editable_output_channel = IOModuleDatas.is_editable_output_channel;

  return module;
}

function DeviceSettingFactory_from_Database<T>(specific_device_setting: string): T {
  return JSON.parse(specific_device_setting);
}

/**
 * データベースから取得したデータをもとにChannelSettingを生成するファクトリメソッド
 * @summary バックエンドのデータベース仕様に依存するメソッドなのでバックエンドのみに実装する
 * @param ChannelDatas データベースから取得したChannelのデータ
 * @returns ChannelSettingのインスタンス
 */
function ChannelFactory_from_Database<T>(ChannelDatas: databaseChannelTableModel[]): IChannelSetting<T>[] {

  const channelSettings: IChannelSetting<T>[] = [];

  for (const channel_data of ChannelDatas) {

    const spiecific_channel_setting: T = JSON.parse(channel_data.specific_channel_setting);
    const channel: IChannelSetting<T> = {
      module_uuid: channel_data.module_uuid,
      channel_id: channel_data.channel_id,
      channel_name: channel_data.channel_name,
      direction: channel_data.direction,
      channel_number: channel_data.channel_number,
      unit: channel_data.unit,
      decimals: channel_data.decimals,
      src_min: channel_data.src_min,
      src_max: channel_data.src_max,
      dst_min: channel_data.dst_min,
      dst_max: channel_data.dst_max,
      min_threshold: channel_data.min_threshold,
      max_threshold: channel_data.max_threshold,
      created_at: channel_data.created_at,
      updated_at: channel_data.updated_at,
      specific_channel_setting: spiecific_channel_setting
    };
    channelSettings.push(channel);
  }

  return channelSettings;
}

