import { pool } from 'src/infra/database/pool.js';
import { Mesurement } from 'src/models/MesurementModel';
import { databaseModuleTableModel } from 'src/models/Database/databaseModuleTableModel';
import { databaseChannelTableModel } from 'src/models/Database/databaseChannelTableModel';
import { databaseDashboardChartsTableModel } from 'src/models/Database/databaseDashboardChartsTableModel';
import { IOModuleFactory_from_Database } from 'src/factories/IOModuleFactoryMethod';
import { DashboardChartsFactory_from_Database } from 'src/factories/DashboardChartFactoryMethods';
import { IOModule,ChartSetting,ChartPosition,IChannelSetting,SystemSettingData } from '@monitoring/shared/model';
import { getIOModuleInputResponse,trendDataRequest } from '@monitoring/shared/api';
import { Result ,ok,err} from '@monitoring/shared/utils';



/**
 * IOモジュールのリストをデータベースに登録
 * @param modules IOモジュールのリスト
 */
export async function registerIOModules(modules: IOModule[]) {
  for (let module of modules) {
    await registerIOModule(module);
  }
}

/**
 * IOモジュールの登録処理
 * @param moduleUuid モジュールのUUID
 * @param moduleName モジュールの名前
 * @param channels チャンネルの情報
 */
export async function registerIOModule(module: IOModule): Promise<IOModule> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // UUIDが既に存在するかチェック
    const [existingModules] = await connection.query(
      `SELECT module_uuid FROM Modules WHERE module_uuid = ?`,
      [module.module_uuid]
    );

    if ((existingModules as any[]).length > 0) {
      throw new Error(`UUID ${module.module_uuid} は既に登録されています`);
    }

    // IOモジュールをModulesテーブルに登録
    await connection.execute(
      `INSERT INTO Modules (module_uuid,module_type , module_name ,input_channel_num ,is_editable_input_channel ,
                            output_channel_num,is_editable_output_channel ,specific_device_setting) VALUES (?, ?, ?, ?, ?,?,?,?)`,
      [module.module_uuid, module.module_type, module.module_name,
      module.input_channel_num, module.is_editable_input_channel, module.output_channel_num, module.is_editable_output_channel, JSON.stringify(module.specific_device_setting)]);

    // Channelsテーブルに各Inputチャンネルを登録
    for (let index = 0; index < module.input_channels.length; index++) {
      const inputChannel = module.input_channels[index];
      const [result] = await connection.execute(
        `INSERT INTO Channels (module_uuid, channel_name, direction, 
                               channel_number, unit, decimals, 
                               src_min, src_max, dst_min, dst_max,min_threshold,max_threshold, 
                               specific_channel_setting) VALUES (?, ? ,? ,? ,?, ?, ?, ?, ?, ?, ?,?,?)`,
        [module.module_uuid, inputChannel.channel_name, inputChannel.direction,
        inputChannel.channel_number, inputChannel.unit, inputChannel.decimals,
        inputChannel.src_min, inputChannel.src_max, inputChannel.dst_min,
        inputChannel.dst_max,inputChannel.min_threshold,inputChannel.max_threshold ,JSON.stringify(inputChannel.specific_channel_setting)]
      );

      // チャンネルIDを取得
      const channelId = (result as any).insertId;
      module.input_channels[index].channel_id = channelId;

    }

    // Channelsテーブルに各Outputチャンネルを登録
    for (let index = 0; index < module.output_channels.length; index++) {
      const outputChannel = module.output_channels[index];
      const [result] = await connection.execute(
        `INSERT INTO Channels (module_uuid, channel_name, direction, 
                                   channel_number, unit, decimals, 
                                   src_min, src_max, dst_min, dst_max,min_threshold,max_threshold,
                                   specific_channel_setting) VALUES (?, ? ,? ,? ,?, ?, ?, ?, ?, ?,?,?, ?)`,
        [module.module_uuid, outputChannel.channel_name, outputChannel.direction,
        outputChannel.channel_number, outputChannel.unit, outputChannel.decimals,
        outputChannel.src_min, outputChannel.src_max, outputChannel.dst_min,
        outputChannel.dst_max,outputChannel.min_threshold,outputChannel.max_threshold, JSON.stringify(outputChannel.specific_channel_setting)]
      );

      // チャンネルIDを取得
      const channelId = (result as any).insertId;
      module.output_channels[index].channel_id = channelId;
    }

    await connection.commit();
    console.log('IOモジュールとチャンネルの登録が完了しました');
    return module;
  } catch (error) {
    await connection.rollback();
    console.error('IOモジュール登録エラー:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function addChannel(channel: IChannelSetting): Promise<IChannelSetting> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const query = `INSERT INTO Channels 
    (module_uuid, channel_name, direction, channel_number, 
    unit, decimals, src_min, src_max, dst_min, dst_max,min_threshold,max_threshold,
    specific_channel_setting) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;
    const [result] = await connection.execute(query,
      [channel.module_uuid, channel.channel_name, channel.direction, channel.channel_number,
      channel.unit, channel.decimals, channel.src_min, channel.src_max, channel.dst_min, channel.dst_max,channel.min_threshold,channel.max_threshold,
      JSON.stringify(channel.specific_channel_setting)]);
    await connection.commit();
    const channelId = (result as any).insertId;
    if (!channelId) {
      throw new Error('チャンネルIDの取得に失敗しました');
    }
    channel.channel_id = channelId;
    return channel;
  } catch (error) {
    await connection.rollback();
    console.error('チャンネルの追加に失敗しました:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function getModuleList(): Promise<IOModule[]> {
  const connection = await pool.getConnection();

  // データベースから読み込んだモジュールのリストを格納する配列
  const modules: IOModule[] = [];

  try {
    // Modulesテーブルから全モジュールを取得
    const ModuleQuery = `SELECT * FROM Modules`;
    const ChannelQuery = `SELECT * FROM Channels WHERE module_uuid = ? AND direction = ?`;

    let [rows] = await connection.query(ModuleQuery);
    const IOModuleDatas: databaseModuleTableModel[] = rows as databaseModuleTableModel[];

    for (let IOModuleData of IOModuleDatas) {

      // 入力チャンネルの設定をデータベースから取得 
      [rows] = await connection.query(ChannelQuery, [IOModuleData.module_uuid, "input"]);
      const inputChannelDatas = rows as databaseChannelTableModel[];

      // 出力チャンネルの設定をデータベースから取得
      [rows] = await connection.query(ChannelQuery, [IOModuleData.module_uuid, "output"]);
      const outputChannelDatas = rows as databaseChannelTableModel[];

      const module = IOModuleFactory_from_Database(IOModuleData, inputChannelDatas, outputChannelDatas);
      modules.push(module);
    }

    console.log('モジュールリストを取得しました');
    return modules; // 取得したモジュールリストを返す
  } catch (error) {
    console.error('モジュールリスト取得エラー:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateIOModules(modules: IOModule[]) {
  for (let module of modules) {
    await updateIOModule(module);
  }
}

export async function updateIOModule(module: IOModule) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    // モジュール情報の更新(モジュール名のみ更新可能
    const query = `UPDATE Modules SET module_name = ? WHERE module_uuid = ?`;
    const [result] = await connection.execute(query, [module.module_name, module.module_uuid]);
    if ((result as any).affectedRows === 0) {
      throw new Error(`UUID ${module.module_uuid} のモジュールは存在しません`);
    }

    // チャンネル情報の更新
    const updateChannelQuery = `UPDATE Channels SET channel_name = ?, unit = ?,
                                decimals = ?, src_min = ? , src_max = ? ,
                                dst_min = ? , dst_max = ? ,min_threshold= ? , max_threshold = ?, specific_channel_setting = ? 
                                 WHERE module_uuid = ? AND channel_id = ?`;

    // 入力チャンネルの更新
    for (let inputChannel of module.input_channels) {
      await connection.execute(updateChannelQuery, [inputChannel.channel_name, inputChannel.unit, inputChannel.decimals,
      inputChannel.src_min, inputChannel.src_max, inputChannel.dst_min, inputChannel.dst_max,inputChannel.min_threshold,inputChannel.max_threshold,
      JSON.stringify(inputChannel.specific_channel_setting), module.module_uuid, inputChannel.channel_id]);
    }

    // 出力チャンネルの更新
    for (let outputChannel of module.output_channels) {
      await connection.execute(updateChannelQuery, [outputChannel.channel_name, outputChannel.unit, outputChannel.decimals,
      outputChannel.src_min, outputChannel.src_max, outputChannel.dst_min, outputChannel.dst_max,outputChannel.min_threshold,outputChannel.max_threshold,
      JSON.stringify(outputChannel.specific_channel_setting), module.module_uuid, outputChannel.channel_id]);
    }

    console.log('IOモジュールの更新が完了しました');
  }
  catch (error) {
    console.error('IOモジュール更新エラー:', error);
    throw error;
  }
  finally {
    connection.release();
  }
}

/**
 * センサデータの保存処理
 * @param dataArray 保存するデータの配列
 */
export async function saveInputDatas(input_datas: getIOModuleInputResponse) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO Measurements (input_channel_id, value, timestamp)
      VALUES (?, ?, ?)
    `;
    for (let i = 0; i < input_datas.channels.length; i++) {
      await connection.execute(insertQuery, [input_datas.channels[i].channel_id, input_datas.channels[i].input_data, new Date(input_datas.timestamp)]);
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * トレンドデータの取得処理
 * @param request トレンドデータ取得リクエスト
 * @returns トレンドデータの配列
 */
export async function getTrendData(request: trendDataRequest): Promise<Mesurement[]> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const query = `
      SELECT 
        m.value, 
        m.timestamp
      FROM 
        Measurements m
      JOIN 
        Channels c ON m.input_channel_id = c.channel_id
      WHERE 
        c.channel_id = ? 
        AND c.direction = 'input'
        AND m.timestamp BETWEEN ? AND ?
      ORDER BY 
        m.timestamp ASC;
    `;
    // パラメータを使用してクエリを実行
    const [rows] = await connection.execute(query,
      [ request.channel_id, new Date(request.start_time), new Date(request.end_time)]);

     // データを型に適合させて変換
     const trendData: Mesurement[] = (rows as any[]).map(row => ({
      value: Number(row.value), // 明示的に数値に変換
      timestamp: new Date(row.timestamp), // Date型に変換
    }));

    return trendData;
  }
  catch (error) {
    console.error('トレンドデータ取得エラー:', error);
    throw error;
  }
  finally {
    connection.release();
  }
};

export async function getDataExistDateList(startDate: Date,endDate:Date): Promise<string[]> {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT DATE(timestamp) AS date_part
      FROM Measurements
      WHERE timestamp BETWEEN ? AND ?
      GROUP BY DATE(timestamp);`;
    // パラメータを使用してクエリを実行
    const [rows] = await connection.execute(query,
      [ startDate, endDate ]);
      const existingDates = (rows as any[]).map(r => r.date_part);
      return existingDates;  
  }
  catch (error) {
    console.error('トレンドデータ存在確認エラー:', error);
    throw error;
  }
  finally {
    connection.release();
  }
}



/**
 * IOモジュールの削除処理
 * @param module IOモジュールのオブジェクト
 */
export async function deleteIOModule(module: IOModule) {
  const connection = await pool.getConnection();
  console.log('IOモジュール削除処理を開始します');

  try {
    await connection.beginTransaction();
    const moduleUuid: string = module.module_uuid;
    // モジュールの削除
    const query = `DELETE FROM Modules WHERE module_uuid = ?`;
    const [result] = await connection.execute(query, [moduleUuid]);

    if ((result as any).affectedRows === 0) {
      throw new Error(`UUID ${moduleUuid} のモジュールは存在しません`);
    }

    await connection.commit();
    console.log('IOモジュールと関連データの削除が完了しました');
  } catch (error) {
    await connection.rollback();
    console.error('IOモジュール削除エラー:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteChannel(channel_id: number): Promise<void> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const query = `DELETE FROM Channels WHERE channel_id = ?`;
    const [result] = await connection.execute(query, [channel_id]);
    if ((result as any).affectedRows === 0) {
      throw new Error(`channel_id ${channel_id} のチャンネルは存在しません`);
    }
    await connection.commit();
  }
  catch (error) {
    await connection.rollback();
    console.error('チャンネル削除エラー:', error);
    throw error;
  }
  finally {
    connection.release();
  }
}

export async function getCsvData(input_channel_ids: number[], date: Date): Promise<any> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const placeholders = input_channel_ids.map(() => '?').join(','); // "?,?,?"

    const channel_name_query = `
    SELECT 
      *
    FROM 
      Channels c
    WHERE 
      c.channel_id IN (${placeholders})
      AND c.direction = 'input'; 
    `;

    //CSVのヘッダー情報
    const [headers] = await connection.execute(channel_name_query, [...input_channel_ids]);
    const csvHeader = "時間," + (headers as databaseChannelTableModel[]).map((header) => `${header.channel_name}(${header.unit})`).join(",") + "\n";

    const query = `
      SELECT 
        m.value, 
        m.timestamp,
        c.channel_id
      FROM 
        Measurements m
      JOIN 
        Channels c ON m.input_channel_id = c.channel_id
      WHERE 
        c.channel_id IN (${placeholders}) 
        AND c.direction = 'input' 
        AND m.timestamp BETWEEN ? AND ?
      ORDER BY 
        m.timestamp ASC;
    `;
    // パラメータを使用してクエリを実行
    // connection.executeだと配列を渡しても展開してくれないので、queryを使用
    const [rows] = await connection.execute(query,
      [...input_channel_ids, date, new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)]);

    const timeMap: { [time: string]: { [channel_id: number]: number } } = {};
    for (let row of rows as any[]) {
      const time = row.timestamp.toLocaleString();
      if (!timeMap[time]) {
        timeMap[time] = {};
      }
      timeMap[time][row.channel_id] = row.value;
    }

    // タイムスタンプをソート（時系列順）
    const sortedTimes = Object.keys(timeMap).sort();

    // 各タイムスタンプごとにCSV行を生成
    // 形式：時間,チャネル1値,チャネル2値,...
    const csvBody = sortedTimes.map(timeStr => {
      const rowData = timeMap[timeStr];
      // channelIdsの順序で値を取得。存在しない場合は空文字。
      const values = input_channel_ids.map(chId => (rowData[chId] !== undefined) ? rowData[chId] : '');
      return `${timeStr},${values.join(',')}`;
    }).join('\n');

    // 最終的なCSV文字列
    const bom = '\uFEFF'; // BOMを定義, Excelでの文字化け対策
    const csvData = bom + csvHeader + csvBody + "\n";
    return csvData;
  }
  catch (error) {
    console.error('CSVデータ取得エラー:', error);
    throw error;
  }
  finally {
    connection.release();
  }
}

export async function addDashboardChart(chart: ChartSetting) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const chartQuery = `
      INSERT INTO DashboardCharts (chart_id, module_uuid, channel_id, chart_type, specific_chart_setting)
      VALUES (?, ?, ?, ?, ?)
    `;
    const positionQuery = `
      INSERT INTO ChartPositions (chart_id, x, y, width, height)
      VALUES (?, ?, ?, ?, ?)
    `;

    // チャート情報の登録
    await connection.execute(chartQuery, [chart.chart_id, chart.module_uuid, chart.channel_id, chart.chart_type, JSON.stringify(chart.specific_chart_setting)]);

    // チャートの位置情報の登録
    await connection.execute(positionQuery, [chart.chart_id, chart.chart_position.x, chart.chart_position.y, chart.chart_position.width, chart.chart_position.height]);

    await connection.commit();
    console.log('ダッシュボードグラフの追加が完了しました');
    return;
  } catch (error) {
    await connection.rollback();
    console.error('ダッシュボードグラフ追加エラー:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export async function getDashboardChartList() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const dashboardChartsQuery = `
      SELECT 
        * 
      FROM 
        DashboardCharts
    `;
    const chartPositionsQuery = `
      SELECT
        *
      FROM
        ChartPositions
      `;
    const [dashboardChartsRows] = await connection.execute(dashboardChartsQuery);
    const dashboardCharts = dashboardChartsRows as databaseDashboardChartsTableModel[];
    const [chartPositionsRows] = await connection.execute(chartPositionsQuery);
    const chartPositions = chartPositionsRows as ChartPosition[];

    //デシリアライズ後のチャート情報を格納する配列
    const Charts: ChartSetting[] = [];

    for (let dashboardChart of dashboardCharts) {
      let chartPosition = chartPositions.find((chartPosition) => chartPosition.chart_id === dashboardChart.chart_id);
      if (!chartPosition) {
        throw new Error(`chart_id ${dashboardChart.chart_id} のチャート位置情報が見つかりません`);
      }
      else {
        const chart = DashboardChartsFactory_from_Database(dashboardChart, chartPosition);
        Charts.push(chart);
      }

    }

    return Charts;
  }
  catch (error) {
    console.error('ダッシュボードグラフ取得エラー:', error);
    throw error;
  }
  finally {
    connection.release();
  }
}

export async function updateDashboardCharts(charts: ChartSetting[]) {
  for (let chart of charts) {
    await updateDashboardChart(chart);
  }
}

export async function updateDashboardChart(chart: ChartSetting) {
  console.log('updateDashboardChart');
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const chartQuery = `
      UPDATE DashboardCharts SET module_uuid = ?, channel_id = ?, chart_type = ?, specific_chart_setting = ?
      WHERE chart_id = ?
    `;
    const positionQuery = `
      UPDATE ChartPositions SET x = ?, y = ?, width = ?, height = ?
      WHERE chart_id = ?
    `;

    // チャート情報の更新
    await connection.execute(chartQuery, [chart.module_uuid, chart.channel_id, chart.chart_type, JSON.stringify(chart.specific_chart_setting), chart.chart_id]);

    // チャートの位置情報の更新
    await connection.execute(positionQuery, [chart.chart_position.x, chart.chart_position.y, chart.chart_position.width, chart.chart_position.height, chart.chart_id]);

    await connection.commit();
    console.log('ダッシュボードグラフの更新が完了しました');
  } catch (error) {
    await connection.rollback();
    console.error('ダッシュボードグラフ更新エラー:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * システム設定の取得メソッド。設定が保存されていない場合はエラーを返す
 * @returns 
 */
export async function getSystemSetting():Promise<Result<SystemSettingData>> {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT 
        * 
      FROM 
        SystemSetting
    `;
    const [rows] = await connection.execute(query);
    if ((rows as any[]).length === 0) {
      return err('SystemSettingテーブルにデータが存在しません');
    }
    const systemSetting = rows as SystemSettingData[];
    return ok(systemSetting[0]);
  }
  catch (error: any) {
    console.error('システム設定取得エラー:', error);
    return err(error.message);
  }
  finally {
    connection.release();
    console.log('システム設定の取得が完了しました');
  }
}

export async function registerSystemSetting(systemSetting: SystemSettingData) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const query = `
      INSERT INTO SystemSetting (samplingInterval) VALUES (?)
    `;
    await connection.execute(query, [systemSetting.samplingInterval]);
    await connection.commit();
  }
  catch (error) {
    await connection.rollback();
    console.error('システム設定登録エラー:', error);
    throw error;
  }
  finally {
    connection.release();
    console.log('システム設定の登録が完了しました');
  }
}

export async function setSystemSetting(systemSetting: SystemSettingData) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const query = `
      UPDATE SystemSetting SET samplingInterval = ?
    `;
    await connection.execute(query, [systemSetting.samplingInterval]);
    await connection.commit();
  }
  catch (error) {
    await connection.rollback();
    console.error('システム設定更新エラー:', error);
    throw error;
  }
  finally {
    connection.release();
    console.log('システム設定を更新しました');
  }
}
