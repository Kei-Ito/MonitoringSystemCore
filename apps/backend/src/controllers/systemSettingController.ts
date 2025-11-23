import { Request, Response } from 'express';
import { SystemSettingService } from 'src/config/SystemSetting';
import { restartSampling } from 'src/services/IOModuleService';
import { SystemSettingData, SamplingInterval } from '@monitoring/shared/model';
import { v4 as uuidv4 } from 'uuid';

const systemSettingService = SystemSettingService.getInstance();

export async function getSystemSetting(req: Request, res: Response) {
  try {
    const systemSetting:SystemSettingData = systemSettingService.getSystemSetting();
    res.json(systemSetting);
  } catch (err) {
    res.status(409).json({ message: err });
  }
}


/**
 * サンプリングインターバル一覧を取得
 */
export async function getSamplingIntervals(req: Request, res: Response) {
  try {
    const systemSetting: SystemSettingData = systemSettingService.getSystemSetting();
    res.json(systemSetting.samplingIntervals || []);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

/**
 * サンプリングインターバルを追加
 */
export async function addSamplingInterval(req: Request<{},{},{name: string, period: number}>, res: Response) {
  try {
    const { name, period } = req.body;
    
    if (!name || !period || period <= 0) {
      return res.status(400).json({ message: '名前と周期が必要です' });
    }
    
    const systemSetting = systemSettingService.getSystemSetting();
    const newInterval: SamplingInterval = {
      uuid: uuidv4(),
      name,
      period
    };
    
    // 2つのインターバルが既に存在する場合はエラー
    if (systemSetting.samplingIntervals.length >= 2) {
      return res.status(400).json({ message: 'サンプリングインターバルは最大2個までです' });
    }
    
    await systemSettingService.setSystemSetting({
      ...systemSetting,
      samplingIntervals: [...systemSetting.samplingIntervals, newInterval] 
    });
    
    // サンプリング中の場合は再起動
    restartSampling(req.app.locals.broadcast);
    
    res.json(newInterval);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

/**
 * サンプリングインターバルを更新
 */
export async function updateSamplingIntervals(req: Request<{uuid: string},{},{name?: string, period?: number}>, res: Response) {
  try {
    const { uuid } = req.params;
    const { name, period } = req.body;
    
    if (!name && !period) {
      return res.status(400).json({ message: '更新する項目がありません' });
    }
    
    if (period !== undefined && period <= 0) {
      return res.status(400).json({ message: '周期は0より大きい値です' });
    }
    
    const systemSetting = systemSettingService.getSystemSetting();
    const intervalIndex = systemSetting.samplingIntervals.findIndex(i => i.uuid === uuid);
    
    if (intervalIndex === -1) {
      return res.status(404).json({ message: 'サンプリングインターバルが見つかりません' });
    }
    
    const updatedInterval: SamplingInterval = {
      ...systemSetting.samplingIntervals[intervalIndex],
      ...(name && { name }),
      ...(period && { period })
    };
    
    const updatedIntervals = [...systemSetting.samplingIntervals];
    updatedIntervals[intervalIndex] = updatedInterval;
    
    await systemSettingService.setSystemSetting({
      ...systemSetting,
      samplingIntervals: updatedIntervals
    });
    
    // サンプリング中の場合は再起動
    restartSampling(req.app.locals.broadcast);
    
    res.json(updatedInterval);
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

/**
 * サンプリングインターバルを削除
 */
export async function deleteSamplingInterval(req: Request<{uuid: string}>, res: Response) {
  try {
    const { uuid } = req.params;
    
    const systemSetting = systemSettingService.getSystemSetting();
    
    if (systemSetting.samplingIntervals.length <= 1) {
      return res.status(400).json({ message: '最低1個のサンプリングインターバルが必要です' });
    }
    
    const filteredIntervals = systemSetting.samplingIntervals.filter(i => i.uuid !== uuid);
    
    if (filteredIntervals.length === systemSetting.samplingIntervals.length) {
      return res.status(404).json({ message: 'サンプリングインターバルが見つかりません' });
    }
    
    // 削除されたインターバルを使用しているチャンネルのチェックはフロントエンドで行うことを想定
    
    await systemSettingService.setSystemSetting({
      ...systemSetting,
      samplingIntervals: filteredIntervals
    });
    
    // サンプリング中の場合は再起動
    restartSampling(req.app.locals.broadcast);
    
    res.json({ message: 'Sampling interval deleted.' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
}
