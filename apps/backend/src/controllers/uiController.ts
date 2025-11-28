import { Request, Response } from 'express';
import * as uiService from 'src/services/uiService';

export const getLayouts = (_: Request, res: Response) => {
  const layouts = uiService.getLayouts();
  res.json(layouts);
};

export const updateLayouts = async (req: Request, res: Response) => {
  try {
    const layouts = req.body;
    await uiService.saveLayouts(layouts);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to update layouts' });
  }
};
