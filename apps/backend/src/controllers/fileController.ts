// src/controllers/fileController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import { getCSVFilePath, deleteCSVFile } from 'src/services/fileService';

// 既存のCSVダウンロード関数
export const downloadCSV = (req: Request, res: Response) => {
  const filePath = getCSVFilePath();

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist');
      return res.status(404).send('File not found');
    }

    res.download(filePath, 'sample.csv', (err) => {
      if (err) {
        console.error('Error during file download', err);
        res.status(500).send('Error downloading file');
      }
    });
  });
};

// 新しいファイル削除用のコントローラー関数
export const deleteCSV = async (req: Request, res: Response) => {
  try {
    await deleteCSVFile(); // ファイル削除サービス呼び出し
    res.status(200).send('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Error deleting file');
  }
};
