// src/controllers/IOModuleController.ts
import { Request, Response } from 'express';
import * as IOModuleService from 'src/services/IOModuleService';
import { deleteIOModuleRequest } from '@monitoring/shared/api';
import { IOModule,IChannelSetting } from '@monitoring/shared/model';
import { IOModuleStatus } from '@monitoring/shared/enum';
import { Result } from '@monitoring/shared/utils';

export async function startIOModuleInputSamplingInterval(req: Request, res: Response) {
  const response= await IOModuleService.startIOModuleInputSamplingInterval(req.app.locals.broadcast);  // WebSocket送信用のコールバックを渡す
  res.json(response);
};

export const stopIOModuleInputSamplingInterval = (req: Request, res: Response) => {
  IOModuleService.stopIOModuleInputSamplingInterval(req.app.locals.broadcast);
  res.json({ message: 'IOModule input data sampling interval stopped.' });
};

export const getCurrentInputData = (_: Request, res: Response) => {
  const inputDatas = IOModuleService.getCurrentInputData();
  res.json({ input_datas: inputDatas });
};

export const getIOModules = (_: Request, res: Response) => {
  const io_modules = IOModuleService.getAllModules();
  res.json(io_modules);
};

export const addIOModule = async(req: Request<{},{},IOModule>, res: Response) => {
  const result:Result<IOModule> = await IOModuleService.addIOModule(req.body);
  if (result.ok){
    res.status(201).json(result.value);
  }
  else{
    res.status(409).json(result.error);
  }
  
};

export async function updateIOModule(req: Request<{},{},IOModule>, res: Response) {
  const result:Result<IOModuleStatus> = await IOModuleService.updateIOModule(req.body);
  if(result.ok){
    res.json(result.value);
  }
  else{
    res.status(400).json(result.error);
  }
};

export async function addChannel(req: Request<{},{},IChannelSetting>, res: Response) {
  const result:Result<IChannelSetting>=await IOModuleService.addChannel(req.body);
  if(result.ok){
    res.status(201).json(result.value);
  }
  else{
    res.status(409).json(result.error);
  }
}

export const deleteIOModule = (req: Request<{},{},{},deleteIOModuleRequest>, res: Response) => {
  // クエリパラメータからUUIDを取得
  const module_uuid = req.query.module_uuid as string;
  IOModuleService.deleteIOModule(module_uuid);
  res.status(204).send();
};

export const deleteChannel = (req: Request<{},{},IChannelSetting>, res: Response) => {
  IOModuleService.deleteChannel(req.body as IChannelSetting);
  res.status(204).send();
};
