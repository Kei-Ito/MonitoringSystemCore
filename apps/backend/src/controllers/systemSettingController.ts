import { Request, Response } from 'express';
import { SystemSettingService } from '@/config/SystemSetting';
import { setSamplingInterval } from '@/services/IOModuleService';
import { SystemSettingData } from '@monitoring/shared/types/model';

const systemSettingService = SystemSettingService.getInstance();

export async function getSystemSetting(req: Request, res: Response) {
  try {
    const systemSetting:SystemSettingData = systemSettingService.getSystemSetting();
    res.json(systemSetting);
  } catch (err) {
    res.status(409).json({ message: err });
  }
}

export async function setSamplingIntervalController(req: Request<{},{},{samplingInterval:number}>, res: Response) {
    systemSettingService.samplingInterval = req.body.samplingInterval;
    setSamplingInterval(req.app.locals.broadcast,systemSettingService.samplingInterval);
    res.json({ message: 'Sampling interval updated.' });
}
