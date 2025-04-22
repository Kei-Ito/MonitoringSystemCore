import { createPool, Pool } from 'mysql2/promise';
import { dbConfig } from 'src/config/databaseConfig';

// データベースの初期化時に使用するPool 
let initPool: Pool | undefined;
// データベースの通常使用時に使用するPool
let mainPool: Pool | undefined;

function createPoolWithoutDatabase() {
  if (!initPool) {
    initPool = createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });
  }
  return initPool;
}

function createPoolWithDatabase() {
  if (!mainPool) {
    mainPool = createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      connectionLimit: 10,
    });
  }
  return mainPool;
}

/**
 * データベースの初期化処理(テーブルがない場合に作成)
 */
export async function initializeDatabase() {
    initPool = createPoolWithoutDatabase();
    const connection = await initPool.getConnection();
    try {
      // データベースの作成（存在しない場合）
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
      await connection.query(`USE ${dbConfig.database}`);
  
      // Modulesテーブルの作成
      await connection.query(`
        CREATE TABLE IF NOT EXISTS Modules (
          module_uuid VARCHAR(36) PRIMARY KEY,
          module_type VARCHAR(50),
          module_name VARCHAR(255),
          input_channel_num INT,
          is_editable_input_channel BOOLEAN,
          output_channel_num INT,
          is_editable_output_channel BOOLEAN,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          specific_device_setting JSON
        )
      `);
  
      // Channelsテーブルの作成
      await connection.query(`
        CREATE TABLE IF NOT EXISTS Channels (
          channel_id BIGINT AUTO_INCREMENT PRIMARY KEY,
          module_uuid VARCHAR(36),
          channel_name VARCHAR(255),
          direction VARCHAR(10),
          channel_number INT,
          unit VARCHAR(255),
          decimals INT,
          src_min FLOAT,
          src_max FLOAT,
          dst_min FLOAT,
          dst_max FLOAT,
          min_threshold FLOAT,
          max_threshold FLOAT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          specific_channel_setting JSON,
          FOREIGN KEY (module_uuid) REFERENCES Modules(module_uuid) ON DELETE CASCADE
        )
      `);
  
      // Measurementsテーブルの作成
      await connection.query(`
        CREATE TABLE IF NOT EXISTS Measurements (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          input_channel_id BIGINT,
          value DECIMAL(10, 2),
          timestamp DATETIME,
          FOREIGN KEY (input_channel_id) REFERENCES Channels(channel_id) ON DELETE CASCADE
        )
      `);
      
      // Usersテーブルの作成
      await connection.query(`
        CREATE TABLE IF NOT EXISTS Users (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255),
          password VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )`);
      
      // Dashboardに表示するグラフに関する設定テーブルの作成
      await connection.query(`
        CREATE TABLE IF NOT EXISTS DashboardCharts (
          chart_id INT PRIMARY KEY,
          module_uuid VARCHAR(36),
          channel_id INT,
          chart_type VARCHAR(36),
          specific_chart_setting JSON,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )`);
      
      // グラフの表示位置に関する設定テーブルの作成
      await connection.query(`
        CREATE TABLE IF NOT EXISTS ChartPositions (
          chart_id INT PRIMARY KEY,
          x INT,
          y INT,
          width INT,
          height INT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (chart_id) REFERENCES DashboardCharts(chart_id) ON DELETE CASCADE
          )`);

      // システム設定テーブルの作成
      await connection.query(`
          CREATE TABLE IF NOT EXISTS SystemSetting (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            samplingInterval INT
              )`);
              
      // データの集計値を保存するテーブルの作成
      await connection.query(`
        CREATE TABLE IF NOT EXISTS CumulativeData (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          date DATE,
          channel_id BIGINT,
          value DECIMAL(10, 2),
          FOREIGN KEY (channel_id) REFERENCES Channels(channel_id) ON DELETE CASCADE
            )`);
      
      console.log('データベースとテーブルの初期化が完了しました');
    } catch (error) {
      console.error('データベース初期化エラー:', error);
      throw error;
    } finally {
      connection.release();
      await initPool.end();
      initPool = undefined;
      createPoolWithDatabase();
    }
  }



  export const pool = mainPool!==undefined ? mainPool : createPoolWithDatabase();