// src/services/fileService.ts
import path from 'path';
import fs from 'fs/promises';

// 既存の関数
export const getCSVFilePath = (): string => {
  return path.join(__dirname, '../../2024-10-09.csv');
};

// 新しいファイル削除用関数
export const deleteCSVFile = async (): Promise<void> => {
  const filePath:string = getCSVFilePath();
  await fs.unlink(filePath); // ファイルを非同期で削除
};
