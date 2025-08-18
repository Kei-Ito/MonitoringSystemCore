import * as api from 'src/api/IOModuleAPI';
import * as json from 'src/utils/json';
import SystemSettingService from 'src/config/SystemSetting';
import { IOModule,IChannelSetting } from '@monitoring/shared/model';
import { IOModuleStatusResponse,getIOModuleInputResponse } from '@monitoring/shared/api';
import { IOModuleStatus } from '@monitoring/shared/enum';
import { Result, ok, err } from '@monitoring/shared/utils';

const jsonFilePath: string = './LocalData/ioModuleSetting.json';
let currentInputDatas: getIOModuleInputResponse[] = []; // 現在のセンサ値
let io_modules: IOModule[] = []; // 空の配列として初期化
let intervalId: NodeJS.Timeout | null = null; // インターバルID

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
 * インターバル処理の中で実行されるセンサーデータ取得メソッド
 * @param broadcast 
 */
async function getIOModuleInput(broadcast: (data: any) => void){
  currentInputDatas = [];
  // 1. すべてのモジュールに対して並行してgetIOModuleInputを呼び出す
  const promises = io_modules.map(async (module) => {
    const response: Result<getIOModuleInputResponse> = await api.getIOModuleInput(module);
    if (response.ok) {

      
      const input_datas = response.value;
      // センサーデータを正規化
      input_datas.channels.forEach(channel => {
        const channel_setting = module.input_channels.find(channel_setting => channel_setting.channel_uuid === channel.channel_uuid);
        if (channel_setting) {
          channel.input_data = NormalizeData(channel.input_data, channel_setting);
        }
      });
      currentInputDatas.push(input_datas);
      // データベースにセンサーデータを保存
      //database.saveInputDatas(input_datas);
    } else {
      console.error('Error fetching Input data:', response.error);
    }
  });

  // 2. 全部の処理が完了するまで待つ
  await Promise.all(promises);

  const  payload = {
    type: 'IOModuleData',
    data: currentInputDatas,
  }

  // 3. 全部終わったらまとめてフロントへ送信
  broadcast(payload);
};

function NormalizeData(data: number, channel: IChannelSetting): number {
  return (data-channel.normalize.src_min)*(channel.normalize.dst_max-channel.normalize.dst_min)/(channel.normalize.src_max-channel.normalize.src_min)+channel.normalize.dst_min;
}

/**
 * インターバル処理の開始メソッド
 * @param broadcast 
 */
export async function startIOModuleInputSamplingInterval(broadcast: (data: any) => void): Promise<IOModuleStatusResponse[]> {
  if (!intervalId) {
    // IOモジュールの状態を同期(ハードウェア側のエラー等で、マイクロサービス側がリスタートしていた場合に状態を同期する必要がある)
    await fetchAllIOModules(io_modules);
    intervalId = setInterval(() => getIOModuleInput(broadcast), SystemSettingService.samplingInterval); // 1秒ごとにデータを取得
    broadcast({ type: 'StartSampling' });
  }
  const response: IOModuleStatusResponse[] = io_modules.map(module => { return { module_uuid: module.module_uuid, status: module.status } });
  return response;
};

/**
 * インターバル処理の停止メソッド
 */
export function stopIOModuleInputSamplingInterval(broadcast: (data: any) => void): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    broadcast({ type: 'StopSampling' });
  }
};

export function getIsSamplingIntervalRunning(): boolean {
  if (intervalId) {
    return true;
  } else {
    return false;
  }
}
export function setSamplingInterval(broadcast: (data: any) => void, value: number) {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  intervalId = setInterval(() => getIOModuleInput(broadcast), value);
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
    
    return ok(void 0);
  }
  else {
    return err(result.error);
  }
}