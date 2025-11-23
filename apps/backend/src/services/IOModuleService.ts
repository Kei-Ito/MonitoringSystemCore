import * as api from 'src/api/IOModuleAPI';
import * as json from 'src/utils/json';
import SystemSettingService from 'src/config/SystemSetting';
import { IOModule,IChannelSetting } from '@monitoring/shared/model';
import { IOModuleStatusResponse,getIOModuleInputResponse } from '@monitoring/shared/api';
import { IOModuleStatus } from '@monitoring/shared/enum';
import { Result, ok, err } from '@monitoring/shared/utils';
import { saveInputDatas } from './dataSaveService';

const jsonFilePath: string = './LocalData/ioModuleSetting.json';
let currentInputDatas: getIOModuleInputResponse[] = []; // 現在のセンサ値
let io_modules: IOModule[] = []; // 空の配列として初期化
const intervalIds: Map<string, NodeJS.Timeout> = new Map(); // インターバルID（sampling_interval_uuid -> タイマー）
let isSamplingStopped: boolean = false; // サンプリング停止フラグ

// インターバルごとのチャンネルマッピングキャッシュ
interface IntervalChannelMapping {
  modules: IOModule[]; // このインターバルを使用するモジュールのリスト
  channelUuidsByModule: Map<string, Set<string>>; // module_uuid -> channel_uuids
}
const intervalChannelMap: Map<string, IntervalChannelMapping> = new Map();

// TODO:仮実装なので、要修正
enum DeviceHealthEnum {
    Good = "Good", // 健康
    Caution= "Caution", // 警告
    Error = "Error", // エラー
    Stop = "Stop" ,//消灯中
    WarmingUp = "WarmingUp",//安定待ち
    CoolingDown = "CoolingDown",//冷却中
    Unknown = "Unknown", // 不明
}

/**
 * IOモジュールの初期化メソッド
 * @returns 初期化したIOモジュールのリスト
 */
export async function initializeIOModules(): Promise<void> {
  const result = await json.loadJson<IOModule[]>(jsonFilePath);
  if (result.ok) {
    io_modules = result.value;
  } else {
    console.error('IOモジュールの設定ファイルの読み込みに失敗しました:', result.error);
    // 初期化に失敗した場合は空の配列を使用
    io_modules = [];
  }

  // IOモジュールの初期化
  await fetchAllIOModules(io_modules);
}


/**
 * IOモジュールの状態をハードウェア制御ソフトウェアと同期するメソッド
 * IOモジュールのstatusプロパティを更新する
 * IOモジュールのステータスを個別に更新するような処理を実装するときに使用することを想定
 * @returns 
 */
export const fetchIOModule = async (module: IOModule): Promise<IOModuleStatus> => {
  return (await api.fetchIOModule(module)).status;
};

/**
 * すべてのIOモジュールの状態をハードウェア制御ソフトウェアと同期するメソッド
 * IOモジュールのstatusプロパティを更新する
 */
export const fetchAllIOModules = async (current_modules: IOModule[]): Promise<void> => {
  const fetched_response = await api.fetchAllIOModules(current_modules);

  for (const response of fetched_response) {
    const index = io_modules.findIndex(io_module => io_module.module_uuid === response.module_uuid);
    if (index !== -1) {
      io_modules[index].status = response.status;
    }
  }
}

/**
 * インターバルとチャンネルのマッピングを構築
 */
function buildIntervalChannelMapping(): void {
  intervalChannelMap.clear();
  
  // 各モジュールの入力チャンネルをインターバルごとに分類
  for (const module of io_modules) {
    for (const channel of module.input_channels) {
      const intervalUuid = channel.sampling_interval_uuid;
      if (!intervalUuid) continue; // 空文字列の場合はスキップ
      
      if (!intervalChannelMap.has(intervalUuid)) {
        intervalChannelMap.set(intervalUuid, {
          modules: [],
          channelUuidsByModule: new Map()
        });
      }
      
      const mapping = intervalChannelMap.get(intervalUuid)!;
      
      // モジュールをリストに追加（重複を防ぐ）
      if (!mapping.modules.find(m => m.module_uuid === module.module_uuid)) {
        mapping.modules.push(module);
      }
      
      // チャンネルUUIDを記録
      if (!mapping.channelUuidsByModule.has(module.module_uuid)) {
        mapping.channelUuidsByModule.set(module.module_uuid, new Set());
      }
      mapping.channelUuidsByModule.get(module.module_uuid)!.add(channel.channel_uuid);
    }
  }
  
  console.log(`インターバルマッピングを構築: ${intervalChannelMap.size}個のインターバル`);
}

/**
 * インターバル処理の中で実行されるセンサーデータ取得メソッド
 * @param broadcast 
 * @param samplingIntervalUuid サンプリングインターバルのUUID
 */
async function getIOModuleInput(broadcast: (data: any) => void, samplingIntervalUuid: string){
  // 停止フラグがtrueの場合は処理をスキップ
  if (isSamplingStopped) {
    return;
  }
  
  let status :DeviceHealthEnum = DeviceHealthEnum.Unknown; // 初期状態は不明
  const deviceStatuses: Record<string, DeviceHealthEnum> = {
    "照射炉1": DeviceHealthEnum.Unknown,
    "照射炉2": DeviceHealthEnum.Unknown,
    "照射炉3": DeviceHealthEnum.Unknown
  };
  // 各デバイスごとのアラート・警告フラグ
  const deviceAlerts: Record<string, boolean> = {
    "照射炉1": false,
    "照射炉2": false,
    "照射炉3": false
  };
  const deviceWarnings: Record<string, boolean> = {
    "照射炉1": false,
    "照射炉2": false,
    "照射炉3": false
  };

  // キャッシュからマッピングを取得
  const mapping = intervalChannelMap.get(samplingIntervalUuid);
  if (!mapping || mapping.modules.length === 0) {
    // このインターバルに属するチャンネルがない
    return;
  }

  const targetModules = mapping.modules;
  const promises = targetModules.map(async (module) => {

    const response: Result<getIOModuleInputResponse> = await api.getIOModuleInput(module);
    if (response.ok) {
      const input_datas = response.value;
      
      // キャッシュからチャンネルUUIDのセットを取得
      const targetChannelUuids = mapping.channelUuidsByModule.get(module.module_uuid);
      if (!targetChannelUuids) return;
      
      // センサーデータを正規化+閾値を基に判定
      input_datas.channels = input_datas.channels.filter(channel => targetChannelUuids.has(channel.channel_uuid));
      input_datas.channels.forEach(channel => {
        const channel_setting = module.input_channels.find(channel_setting => channel_setting.channel_uuid === channel.channel_uuid);
        if (channel_setting) {
          if (channel.channel_uuid=="10041") {
            deviceStatuses["照射炉1"] = convertStatus(channel.input_data);
            status = deviceStatuses["照射炉1"];
          } else if (channel.channel_uuid=="10091") {
            deviceStatuses["照射炉2"] = convertStatus(channel.input_data);
          } else if (channel.channel_uuid=="10141") {
            deviceStatuses["照射炉3"] = convertStatus(channel.input_data);
          }

          // デバイス名の特定
          let deviceName = "";
          if (channel_setting.channel_name.includes("照射炉1")) deviceName = "照射炉1";
          else if (channel_setting.channel_name.includes("照射炉2")) deviceName = "照射炉2";
          else if (channel_setting.channel_name.includes("照射炉3")) deviceName = "照射炉3";

          channel.input_data = NormalizeData(channel.input_data, channel_setting);
          // 閾値を基に判定(nullなら実質的に閾値なし)
          if (deviceName) {
            if (channel.input_data < (channel_setting.threshold.alert_min_threshold ?? -Infinity) || 
                channel.input_data > (channel_setting.threshold.alert_max_threshold ?? +Infinity)) {
              deviceAlerts[deviceName] = true;
            }
            if (channel.input_data < (channel_setting.threshold.warning_min_threshold ?? -Infinity) || 
                channel.input_data > (channel_setting.threshold.warning_max_threshold ?? +Infinity)) {
              deviceWarnings[deviceName] = true;
            }
          }
          
        }
      });
      
      // このインターバルで取得したチャンネルがある場合のみ保存
      if (input_datas.channels.length > 0) {
        // 全体キャッシュを更新（モジュール単位でマージ）
        const cacheIndex = currentInputDatas.findIndex(data => data.module_uuid === module.module_uuid);
        if (cacheIndex === -1) {
          currentInputDatas.push(input_datas);
        } else {
          // 既存のチャンネルデータを更新
          input_datas.channels.forEach(newChannel => {
            const existingChannelIndex = currentInputDatas[cacheIndex].channels.findIndex(
              ch => ch.channel_uuid === newChannel.channel_uuid
            );
            if (existingChannelIndex === -1) {
              currentInputDatas[cacheIndex].channels.push(newChannel);
            } else {
              currentInputDatas[cacheIndex].channels[existingChannelIndex] = newChannel;
            }
          });
          // タイムスタンプを更新
          currentInputDatas[cacheIndex].timestamp = input_datas.timestamp;
        }
      }
    } else {
      console.error('Error fetching Input data:', response.error);
    }
  });

  
  // 2. 全部の処理が完了するまで待つ
  await Promise.all(promises);

  // 3. 今回収集したデータを抽出（フィルタリング済み）
  const intervalInputDatas: getIOModuleInputResponse[] = [];
  const channelMeta = new Map<string, { name: string, unit: string }>();

  for (const module of targetModules) {
    const cachedData = currentInputDatas.find(data => data.module_uuid === module.module_uuid);
    if (cachedData) {
      // キャッシュからチャンネルUUIDのセットを取得
      const targetChannelUuids = mapping.channelUuidsByModule.get(module.module_uuid);
      if (!targetChannelUuids) continue;
      
      const filteredChannels = cachedData.channels.filter(ch => targetChannelUuids.has(ch.channel_uuid));
      
      if (filteredChannels.length > 0) {
        intervalInputDatas.push({
          ...cachedData,
          channels: filteredChannels
        });

        // メタデータを収集
        filteredChannels.forEach(ch => {
            const setting = module.input_channels.find(s => String(s.channel_uuid) === String(ch.channel_uuid));
            if (setting) {
                channelMeta.set(String(ch.channel_uuid), {
                    name: setting.channel_name,
                    unit: setting.unit
                });
            }
        });
      }
    }
  }

  saveInputDatas(intervalInputDatas, channelMeta); // このインターバルで収集したデータのみ保存
  
  //ステータスを更新
  // statusはチャンネルデータの処理中に更新される可能性がある
  for (const deviceName of Object.keys(deviceStatuses)) {
    if (deviceStatuses[deviceName] === DeviceHealthEnum.Good) {
      if (deviceAlerts[deviceName]) {
        deviceStatuses[deviceName] = DeviceHealthEnum.Error;
      } else if (deviceWarnings[deviceName]) {
        deviceStatuses[deviceName] = DeviceHealthEnum.Caution;
      }
    }
  }
  status = deviceStatuses["照射炉1"];

  const  payload = {
    type: 'IOModuleData',
    data: intervalInputDatas,
    status: status,
    deviceStatuses: deviceStatuses,
    samplingIntervalUuid: samplingIntervalUuid
  }

  // 4. 全部終わったらまとめてフロントへ送信
  broadcast(payload);
};

function NormalizeData(data: number, channel: IChannelSetting): number {
  return (data-channel.normalize.src_min)*(channel.normalize.dst_max-channel.normalize.dst_min)/(channel.normalize.src_max-channel.normalize.src_min)+channel.normalize.dst_min;
}

function convertStatus(inputData: number): DeviceHealthEnum {
  switch (inputData) {
    case 0: return DeviceHealthEnum.Stop;
    case 1: return DeviceHealthEnum.WarmingUp;
    case 2: return DeviceHealthEnum.Good;
    case 3: return DeviceHealthEnum.CoolingDown;
    default: return DeviceHealthEnum.Unknown;
  }
}

/**
 * インターバル処理の開始メソッド
 * @param broadcast 
 */
export async function startIOModuleInputSamplingInterval(broadcast: (data: any) => void): Promise<IOModuleStatusResponse[]> {
  // 停止フラグをリセット
  isSamplingStopped = false;
  
  // IOモジュールの状態を同期(ハードウェア側のエラー等で、マイクロサービス側がリスタートしていた場合に状態を同期する必要がある)
  await fetchAllIOModules(io_modules);
  
  // インターバルとチャンネルのマッピングを構築
  buildIntervalChannelMapping();
  
  // システム設定からサンプリングインターバル設定を取得
  const systemSetting = SystemSettingService.getSystemSetting();
  const samplingIntervals = systemSetting.samplingIntervals;
  
  if (!samplingIntervals) {
    console.error('サンプリングインターバルが設定されていません');
    return [];
  }
  
  // 各サンプリングインターバルに対してタイマーを設定
  for (const interval of samplingIntervals) {
    if (!intervalIds.has(interval.uuid)) {
      const timerId = setInterval(
        () => getIOModuleInput(broadcast, interval.uuid),
        interval.period
      );
      intervalIds.set(interval.uuid, timerId);
      console.log(`サンプリング開始: ${interval.name} (${interval.period}ms)`);
    }
  }
  
  broadcast({ type: 'StartSampling' });
  
  const response: IOModuleStatusResponse[] = io_modules.map(module => { return { module_uuid: module.module_uuid, status: module.status } });
  return response;
};

/**
 * インターバル処理の停止メソッド
 */
export function stopIOModuleInputSamplingInterval(broadcast: (data: any) => void): void {
  // 停止フラグを立てる（実行中の処理も停止させる）
  isSamplingStopped = true;
  
  // すべてのインターバルを停止
  for (const [uuid, timerId] of intervalIds.entries()) {
    clearInterval(timerId);
    console.log(`サンプリング停止: ${uuid}`);
  }
  intervalIds.clear();
  broadcast({ type: 'StopSampling' });
};

export function getIsSamplingIntervalRunning(): boolean {
  return intervalIds.size > 0;
}
export function restartSampling(broadcast: (data: any) => void) {
  // 現在動作中の場合は、一度停止して再開
  if (intervalIds.size > 0) {
    stopIOModuleInputSamplingInterval(broadcast);
    startIOModuleInputSamplingInterval(broadcast);
  }
}

// 最新のセンサーデータを返す関数
export const getCurrentInputData = () => currentInputDatas;


/**
 * IOモジュールのリストをフロントエンドへ渡すためのメソッド
 * @returns IOモジュールのリスト 
 */
export const getAllModules = (): IOModule[] => {
  return io_modules;
};

/**
 * IOモジュールの追加メソッド
 * @param module 追加するIOモジュールのオブジェクト
 * @returns 
 */
export async function addIOModule(newIOModule: IOModule): Promise<Result<IOModule>> {

  const result = await api.addIOModule(newIOModule);

  if (result.ok) {
    // モジュールの初期化に成功していたら、IOモジュールのリストに追加し、データベースに登録
    let initialized_module = result.value;
    io_modules.push(initialized_module);
    await json.saveJson<IOModule[]>(jsonFilePath, io_modules); // JSONファイルに保存
    
    // サンプリング中の場合はマッピングを再構築
    if (intervalIds.size > 0) {
      buildIntervalChannelMapping();
    }
    
    return ok(initialized_module);
  }
  else {
    console.error('Failed to initialize IOModule', result.error);
    return err(result.error);
  }
};

export async function addChannel(channel: IChannelSetting): Promise<Result<IChannelSetting>> {

  const result = await api.addChannel(channel);

  if (result.ok) {
    if (channel.direction == "input") {
      io_modules.find(module => module.module_uuid === channel.module_uuid)?.input_channels.push(channel);
    }
    else {
      io_modules.find(module => module.module_uuid === channel.module_uuid)?.output_channels.push(channel);
    }

    await json.saveJson<IOModule[]>(jsonFilePath, io_modules); // JSONファイルに保存
    
    // 入力チャンネルでサンプリング中の場合はマッピングを再構築
    if (channel.direction === "input" && intervalIds.size > 0) {
      buildIntervalChannelMapping();
    }

    return ok(channel);
  }
  else {
    return err(result.error);
  }
}

/**
 * IOモジュールの設定更新メソッド
 * @param moduleData フロントエンドで更新したIOモジュールの設定
 * @returns 設定更新後のIOモジュールオブジェクト
 */
export async function updateIOModule(moduleData: IOModule): Promise<Result<IOModuleStatus>> {
  const result = await api.updateIOModule(moduleData);
  if (result.ok) {

    const index = io_modules.findIndex(io_module => io_module.module_uuid === moduleData.module_uuid);
    if (index === -1) {
      return err('IOModule not found')
    };

    io_modules[index] = moduleData;// バックエンド内のIOモジュールのリストを更新
    io_modules[index].status = result.value; // ステータスを更新
    await json.saveJson<IOModule[]>(jsonFilePath, io_modules); // JSONファイルに保存
    
    // サンプリング中の場合はマッピングを再構築
    if (intervalIds.size > 0) {
      buildIntervalChannelMapping();
    }
    
    return ok(result.value);
  } else {
    console.log("failed to update module");
    return err(result.error);
  }
};

/**
 * IOモジュールの削除メソッド
 * @param uuid 削除するIOモジュールのUUID
 * @returns 
 */
export const deleteIOModule = async (module_uuid: string): Promise<void> => {
  const index = io_modules.findIndex(io_module => io_module.module_uuid === module_uuid);
  if (index === -1) return;

  // センサーの終了処理(APIを呼び出して実際の終了処理を実行)
  api.finalizeIOModule(io_modules[index]);

  // バックエンド内のIOモジュールのリストから削除
  io_modules.splice(index, 1);

  // JSONファイルに保存
  await json.saveJson<IOModule[]>(jsonFilePath, io_modules);
  
  // サンプリング中の場合はマッピングを再構築
  if (intervalIds.size > 0) {
    buildIntervalChannelMapping();
  }

  return;
};

export async function deleteChannel(channel_setting: IChannelSetting): Promise<Result<void>> {
  const result = await api.deleteChannel(channel_setting);
  if (result.ok) {
    console.log("deleted channel");

    let index: number | undefined;
    const io_module_index = io_modules.findIndex(io_module => io_module.module_uuid === channel_setting.module_uuid);
    if (io_module_index === -1) {
      console.log("指定されたIOモジュールが見つかりません。");
      return err("指定されたIOモジュールが見つかりません。");
    }
    if (channel_setting.direction === "input") {
      index = io_modules[io_module_index].input_channels.findIndex((channel:IChannelSetting) => channel.channel_uuid === channel_setting.channel_uuid);
      if (index === -1) {
        console.log(`Type of channel_uuid: ${typeof channel_setting.channel_uuid}`);
        console.log("指定された入力チャンネルが見つかりません。");
        console.log(`APIの指定${channel_setting.channel_uuid} ： IOモジュールの指定`);
        console.log(io_modules[io_module_index]);
        return err("チャンネルの削除に失敗しました。");
      }
      io_modules[io_module_index].input_channels.splice(index, 1);
    } else {
      index = io_modules[io_module_index].output_channels.findIndex((channel:IChannelSetting) => channel.channel_uuid === channel_setting.channel_uuid);
      if (index === -1) {
        console.log("指定された出力チャンネルが見つかりません。");
        return err("チャンネルの削除に失敗しました。");
      }
      io_modules[io_module_index].output_channels.splice(index, 1);
    }

    // JSONファイルに保存
    await json.saveJson<IOModule[]>(jsonFilePath, io_modules); // JSONファイルに保存
    
    // 入力チャンネルでサンプリング中の場合はマッピングを再構築
    if (channel_setting.direction === "input" && intervalIds.size > 0) {
      buildIntervalChannelMapping();
    }
    
    return ok(void 0);
  }
  else {
    return err(result.error);
  }
}