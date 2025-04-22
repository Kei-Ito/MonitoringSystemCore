import axios from 'axios';
import type { getIsDataExistRequestModel,getIsDataExistResponseModel } from '@monitoring/shared/api';

const protocol = window.location.protocol;
const host = window.location.hostname;
const endpoint = `${protocol}//${host}:2478/api/trend_data/`;

export async function fetchTrendData(channel_id:number,startDate:Date, endDate:Date) {
  try {
    const response = await axios.get(endpoint, {
      params: {
        channel_id: channel_id,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        span: 'Daily'
      }
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function getCsvData(input_channel_ids:number[], date:Date) {
  try {
    const response = await axios.get(`${endpoint}export_csv`, {
      params: {
        input_channel_ids: input_channel_ids,
        date: date.toISOString()
      },
      responseType: 'blob', // Blob形式でレスポンスを取得
    });
    // BlobデータからURLを作成
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    // ダウンロードリンクを作成
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv'; // ファイル名を指定
    link.click();

    // メモリ解放
    window.URL.revokeObjectURL(url);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getIsDataExist(startDate:Date, endDate:Date):Promise<getIsDataExistResponseModel[]> {
  try {
    const response = await axios.get(`${endpoint}is_data_exist`, {
      params: {
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString()
      } as getIsDataExistRequestModel
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCumulativeValue(channel_id:number,startDate:Date, endDate:Date) {
  try {
    const response = await axios.get(`${endpoint}get_cumulative_value`, {
      params: {
        channel_id: channel_id,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        span: 'Daily'
      }
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}