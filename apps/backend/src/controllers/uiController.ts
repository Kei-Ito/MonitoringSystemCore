import { Request, Response } from 'express';
import * as uiService from 'src/services/uiService';

export const getLayouts = (_: Request, res: Response) => {
  const layouts = uiService.getLayouts();
  res.json(layouts);
};
