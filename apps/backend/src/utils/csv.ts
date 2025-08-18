import { promises as fs } from 'fs';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// ========================================
// 型定義
// ========================================

/**
 * CSV書き込みオプション
 */
interface CSVWriteOptions {
  /** ファイルエンコーディング（デフォルト: 'utf8'） */
  encoding?: BufferEncoding;
  /** 区切り文字（デフォルト: ','） */
  delimiter?: string;
  /** BOMを付けるか（デフォルト: false） */
  withBOM?: boolean;
}

/**
 * オブジェクト配列書き込みオプション
 */
interface CSVObjectWriteOptions extends CSVWriteOptions {
  /** ヘッダー列名（指定しない場合は自動取得） */
  headers?: string[];
}

/**
 * CSVデータ型（2次元配列）
 */
type CSVData = (string | number | boolean | null | undefined)[][];

/**
 * オブジェクト配列型
 */
type ObjectArray<T = Record<string, any>> = T[];

/**
 * CSV読み込みオプション
 */
interface CSVReadOptions {
  /** ファイルエンコーディング（デフォルト: 'utf8'） */
  encoding?: BufferEncoding;
  /** 区切り文字（デフォルト: ','） */
  delimiter?: string;
  /** ヘッダー行をスキップするか（デフォルト: false） */
  skipHeader?: boolean;
  /** 空行をスキップするか（デフォルト: true） */
  skipEmptyLines?: boolean;
  /** 自動で数値型に変換するか（デフォルト: false） */
  autoParseNumbers?: boolean;
}

/**
 * CSV読み込み結果
 */
interface CSVReadResult {
  /** 読み込まれたデータ */
  data: CSVData;
  /** ヘッダー行（存在する場合） */
  headers?: string[];
  /** 読み込まれた行数 */
  rowCount: number;
}

// ========================================
// CSV読み込み関数群
// ========================================

/**
 * CSVファイルを読み込んで2次元配列として返す（非同期）
 * @param filePath 読み込むファイルパス
 * @param options 読み込みオプション
 */
export async function readCSV(
  filePath: string,
  options: CSVReadOptions = {}
): Promise<CSVReadResult> {
  const {
    encoding = 'utf8',
    delimiter = ',',
    skipHeader = false,
    skipEmptyLines = true,
    autoParseNumbers = false
  } = options;

  try {
    // ファイルを読み込み
    const content = await fs.readFile(filePath, encoding);
    
    // BOMを除去
    const cleanContent = content.replace(/^\uFEFF/, '');
    
    // CSVを解析
    const result = parseCSVContent(cleanContent, {
      delimiter,
      skipHeader,
      skipEmptyLines,
      autoParseNumbers
    });

    console.log(`CSV ファイルを読み込みました: ${filePath} (${result.rowCount}行)`);
    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('CSV読み込みエラー:', errorMessage);
    throw new Error(`CSV読み込みに失敗しました: ${errorMessage}`);
  }
}

/**
 * CSVファイルを読み込んで2次元配列として返す（同期）
 * @param filePath 読み込むファイルパス
 * @param options 読み込みオプション
 */
export function readCSVSync(
  filePath: string,
  options: CSVReadOptions = {}
): CSVReadResult {
  const {
    encoding = 'utf8',
    delimiter = ',',
    skipHeader = false,
    skipEmptyLines = true,
    autoParseNumbers = false
  } = options;

  try {
    // ファイルを同期読み込み
    const content = require('fs').readFileSync(filePath, encoding);
    
    // BOMを除去
    const cleanContent = content.replace(/^\uFEFF/, '');
    
    // CSVを解析
    const result = parseCSVContent(cleanContent, {
      delimiter,
      skipHeader,
      skipEmptyLines,
      autoParseNumbers
    });

    console.log(`CSV ファイルを読み込みました: ${filePath} (${result.rowCount}行)`);
    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('CSV読み込みエラー:', errorMessage);
    throw new Error(`CSV読み込みに失敗しました: ${errorMessage}`);
  }
}

/**
 * CSVファイルを読み込んでオブジェクト配列として返す
 * @param filePath 読み込むファイルパス
 * @param options 読み込みオプション
 */
export async function readCSVAsObjects<T extends Record<string, any> = Record<string, any>>(
  filePath: string,
  options: CSVReadOptions & { headers?: string[] } = {}
): Promise<T[]> {
  const { headers: customHeaders, ...readOptions } = options;
  
  // CSVを読み込み
  const result = await readCSV(filePath, readOptions);
  
  if (result.data.length === 0) {
    return [];
  }

  // ヘッダーを決定
  let headers: string[];
  let dataRows: CSVData;

  if (customHeaders) {
    // カスタムヘッダーが指定されている場合
    headers = customHeaders;
    dataRows = result.data;
  } else if (result.headers) {
    // ファイル内にヘッダーがある場合
    headers = result.headers;
    dataRows = result.data;
  } else {
    // 最初の行をヘッダーとして使用
    headers = result.data[0].map(String);
    dataRows = result.data.slice(1);
  }

  // オブジェクト配列に変換
  const objects: T[] = dataRows.map(row => {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] ?? '';
    });
    return obj as T;
  });

  return objects;
}

/**
 * ストリームを使用してCSVファイルを行単位で読み込む
 * @param filePath 読み込むファイルパス
 * @param callback 各行に対する処理
 * @param options 読み込みオプション
 */
export async function readCSVStream(
  filePath: string,
  callback: (row: (string | number)[], lineNumber: number) => void | Promise<void>,
  options: CSVReadOptions = {}
): Promise<void> {
  const {
    encoding = 'utf8',
    delimiter = ',',
    skipHeader = false,
    skipEmptyLines = true,
    autoParseNumbers = false
  } = options;

  return new Promise((resolve, reject) => {
    const readline = require('readline');
    const readStream = require('fs').createReadStream(filePath, { encoding });
    
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity
    });

    let lineNumber = 0;
    let isFirstLine = true;

    rl.on('line', async (line: string) => {
      try {
        lineNumber++;
        
        // BOMを除去（最初の行のみ）
        if (isFirstLine) {
          line = line.replace(/^\uFEFF/, '');
          isFirstLine = false;
        }

        // 空行をスキップ
        if (skipEmptyLines && line.trim() === '') {
          return;
        }

        // ヘッダー行をスキップ
        if (skipHeader && lineNumber === 1) {
          return;
        }

        // 行を解析
        const row = parseCSVRow(line, delimiter, autoParseNumbers);
        
        // コールバック実行
        await callback(row, lineNumber);
      } catch (error) {
        reject(error);
      }
    });

    rl.on('close', () => {
      console.log(`CSV ストリーム読み込み完了: ${filePath} (${lineNumber}行)`);
      resolve();
    });

    rl.on('error', (error: Error) => {
      reject(new Error(`CSV ストリーム読み込みエラー: ${error.message}`));
    });
  });
}

/**
 * 配列データをCSVファイルに書き込む（非同期）
 * @param filePath 出力ファイルパス
 * @param data 書き込むデータ（2次元配列）
 * @param options オプション
 */
export async function writeCSV(
  filePath: string,
  data: CSVData,
  options: CSVWriteOptions = {}
): Promise<void> {
  const {
    encoding = 'utf8',
    delimiter = ',',
    withBOM = false
  } = options;

  try {
    // ディレクトリが存在しない場合は作成
    const dir = dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    // CSVデータを生成
    const csvContent = arrayToCSV(data, delimiter);
    
    // BOMを付ける場合
    const finalContent = withBOM ? '\uFEFF' + csvContent : csvContent;

    // ファイルに書き込み
    await fs.writeFile(filePath, finalContent, encoding);
    
    console.log(`CSV ファイルが正常に作成されました: ${filePath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('CSV書き込みエラー:', errorMessage);
    throw new Error(`CSV書き込みに失敗しました: ${errorMessage}`);
  }
}

/**
 * 配列データをCSVファイルに書き込む（同期）
 * @param filePath 出力ファイルパス
 * @param data 書き込むデータ（2次元配列）
 * @param options オプション
 */
export function writeCSVSync(
  filePath: string,
  data: CSVData,
  options: CSVWriteOptions = {}
): void {
  const {
    encoding = 'utf8',
    delimiter = ',',
    withBOM = false
  } = options;

  try {
    // ディレクトリが存在しない場合は作成
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // CSVデータを生成
    const csvContent = arrayToCSV(data, delimiter);
    
    // BOMを付ける場合
    const finalContent = withBOM ? '\uFEFF' + csvContent : csvContent;

    // ファイルに同期書き込み
    require('fs').writeFileSync(filePath, finalContent, encoding);
    
    console.log(`CSV ファイルが正常に作成されました: ${filePath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('CSV書き込みエラー:', errorMessage);
    throw new Error(`CSV書き込みに失敗しました: ${errorMessage}`);
  }
}

/**
 * オブジェクト配列をCSVファイルに書き込む
 * @param filePath 出力ファイルパス
 * @param objects オブジェクト配列
 * @param options オプション
 */
export async function writeCSVFromObjects<T extends Record<string, any>>(
  filePath: string,
  objects: ObjectArray<T>,
  options: CSVObjectWriteOptions = {}
): Promise<void> {
  if (!Array.isArray(objects) || objects.length === 0) {
    throw new Error('オブジェクト配列が空か無効です');
  }

  const { headers, ...writeOptions } = options;
  
  // ヘッダーを取得（指定がない場合は最初のオブジェクトのキーを使用）
  const csvHeaders = headers || Object.keys(objects[0]);
  
  // データを2次元配列に変換
  const data: CSVData = [csvHeaders];
  objects.forEach(obj => {
    const row = csvHeaders.map(header => obj[header] ?? '');
    data.push(row);
  });

  await writeCSV(filePath, data, writeOptions);
}

/**
 * CSVファイルにデータを追記する
 * @param filePath 出力ファイルパス
 * @param data 追記するデータ
 * @param options オプション
 */
export async function appendCSV(
  filePath: string,
  data: CSVData,
  options: Pick<CSVWriteOptions, 'delimiter'> = {}
): Promise<void> {
  const { delimiter = ',' } = options;

  try {
    const csvContent = arrayToCSV(data, delimiter);
    await fs.appendFile(filePath, '\n' + csvContent, 'utf8');
    
    console.log(`CSV ファイルにデータを追記しました: ${filePath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('CSV追記エラー:', errorMessage);
    throw new Error(`CSV追記に失敗しました: ${errorMessage}`);
  }
}

/**
 * ストリームを使用して大きなCSVファイルを書き込む
 * @param filePath 出力ファイルパス
 * @param data 書き込むデータ
 * @param options オプション
 */
export async function writeCSVStream(
  filePath: string,
  data: CSVData,
  options: CSVWriteOptions = {}
): Promise<void> {
  const { delimiter = ',', withBOM = false } = options;

  return new Promise((resolve, reject) => {
    try {
      // ディレクトリを作成
      const dir = dirname(filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const writeStream = createWriteStream(filePath, { encoding: 'utf8' });

      writeStream.on('error', (error) => {
        console.error('ストリーム書き込みエラー:', error);
        reject(new Error(`ストリーム書き込みに失敗しました: ${error.message}`));
      });

      writeStream.on('finish', () => {
        console.log(`CSV ファイル（ストリーム）が作成されました: ${filePath}`);
        resolve();
      });

      // BOMを書き込み
      if (withBOM) {
        writeStream.write('\uFEFF');
      }

      // データを行ごとに書き込み
      data.forEach((row, index) => {
        const csvRow = rowToCSV(row, delimiter);
        if (index < data.length - 1) {
          writeStream.write(csvRow + '\n');
        } else {
          writeStream.write(csvRow);
        }
      });

      writeStream.end();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      reject(new Error(`ストリーム初期化に失敗しました: ${errorMessage}`));
    }
  });
}

// ========================================
// CSV解析ユーティリティ関数
// ========================================

/**
 * CSV内容を解析して構造化データに変換
 * @param content CSV文字列
 * @param options 解析オプション
 */
function parseCSVContent(
  content: string,
  options: {
    delimiter: string;
    skipHeader: boolean;
    skipEmptyLines: boolean;
    autoParseNumbers: boolean;
  }
): CSVReadResult {
  const { delimiter, skipHeader, skipEmptyLines, autoParseNumbers } = options;
  
  const lines = content.split(/\r?\n/);
  const data: CSVData = [];
  let headers: string[] | undefined;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 空行をスキップ
    if (skipEmptyLines && line.trim() === '') {
      continue;
    }
    
    // 行を解析
    const row = parseCSVRow(line, delimiter, autoParseNumbers);
    
    // 最初の行をヘッダーとして保存（skipHeaderがfalseの場合）
    if (i === 0 && !skipHeader) {
      headers = row.map(String);
    }
    
    // データに追加（ヘッダー行を除外する場合）
    if (!(i === 0 && !skipHeader)) {
      data.push(row);
    }
  }
  
  return {
    data,
    headers,
    rowCount: data.length
  };
}

/**
 * CSV行を解析して配列に変換
 * @param line CSV行文字列
 * @param delimiter 区切り文字
 * @param autoParseNumbers 自動数値変換フラグ
 */
function parseCSVRow(
  line: string,
  delimiter: string,
  autoParseNumbers: boolean
): (string | number)[] {
  const result: (string | number)[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // エスケープされたクォート
        current += '"';
        i++; // 次の文字をスキップ
      } else {
        // クォートの開始/終了
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      // フィールドの区切り
      result.push(parseValue(current.trim(), autoParseNumbers));
      current = '';
    } else {
      // 通常の文字
      current += char;
    }
  }
  
  // 最後のフィールド
  result.push(parseValue(current.trim(), autoParseNumbers));
  
  return result;
}

/**
 * 値を適切な型に変換
 * @param value 文字列値
 * @param autoParseNumbers 自動数値変換フラグ
 */
function parseValue(value: string, autoParseNumbers: boolean): string | number {
  if (!autoParseNumbers) {
    return value;
  }
  
  // 数値として解析を試行
  const trimmed = value.trim();
  if (trimmed === '') {
    return '';
  }
  
  const num = Number(trimmed);
  if (!isNaN(num) && isFinite(num)) {
    return num;
  }
  
  return value;
}

/**
 * 2次元配列をCSV形式の文字列に変換
 * @param data 変換するデータ
 * @param delimiter 区切り文字
 */
export function arrayToCSV(data: CSVData, delimiter: string = ','): string {
  return data.map(row => rowToCSV(row, delimiter)).join('\n');
}

/**
 * 1次元配列をCSV行に変換
 * @param row 行データ
 * @param delimiter 区切り文字
 */
export function rowToCSV(
  row: (string | number | boolean | null | undefined)[],
  delimiter: string = ','
): string {
  return row.map(field => escapeCSVField(String(field ?? ''))).join(delimiter);
}

/**
 * CSVフィールドをエスケープ
 * @param field フィールド値
 */
export function escapeCSVField(field: string): string {
  // フィールドにカンマ、改行、ダブルクォートが含まれる場合はダブルクォートで囲む
  if (field.includes(',') || field.includes('\n') || field.includes('\r') || field.includes('"')) {
    // ダブルクォートを二重にしてエスケープ
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * CSVデータの妥当性を検証
 * @param data 検証するデータ
 */
export function validateCSVData(data: unknown): data is CSVData {
  return Array.isArray(data) && 
         data.length > 0 && 
         data.every(row => Array.isArray(row));
}

// ========================================
// 使用例とテスト
// ========================================

/**
 * 使用例を実行する関数
 */
export async function runExamples(): Promise<void> {
  try {
    // サンプルデータ
    const sampleData: CSVData = [
      ['名前', '年齢', '職業'],
      ['田中太郎', 30, 'エンジニア'],
      ['佐藤花子', 25, 'デザイナー'],
      ['山田次郎', 35, 'マネージャー']
    ];

    // 1. 基本的な非同期書き込み
    await writeCSV('./output/sample.csv', sampleData, {
      withBOM: true // Excel対応のためBOMを付加
    });

    // 2. 同期書き込み
    writeCSVSync('./output/sample_sync.csv', sampleData);

    // 3. オブジェクト配列の書き込み（型安全）
    interface Person {
      name: string;
      age: number;
      job: string;
    }

    const objectData: Person[] = [
      { name: '田中太郎', age: 30, job: 'エンジニア' },
      { name: '佐藤花子', age: 25, job: 'デザイナー' },
      { name: '山田次郎', age: 35, job: 'マネージャー' }
    ];

    await writeCSVFromObjects('./output/sample_objects.csv', objectData, {
      headers: ['name', 'age', 'job'],
      withBOM: true
    });

    // 4. データ追記
    const additionalData: CSVData = [
      ['鈴木一郎', 28, 'セールス']
    ];
    await appendCSV('./output/sample.csv', additionalData);

    // 5. ストリーム書き込み（大きなデータ向け）
    const bigData: CSVData = [['User', 'Age', 'Job']];
    for (let i = 0; i < 10000; i++) {
      bigData.push([`User${i}`, Math.floor(Math.random() * 100), `Job${i % 10}`]);
    }
    await writeCSVStream('./output/big_data.csv', bigData);

    // 6. データ妥当性検証
    const testData: unknown = [['test'], ['data']];
    if (validateCSVData(testData)) {
      console.log('データ妥当性チェック: OK');
      await writeCSV('./output/validated_data.csv', testData);
    }

    console.log('\n=== CSV読み込み例 ===');

    // 7. 基本的な読み込み
    const readResult = await readCSV('./output/sample.csv', {
      autoParseNumbers: true
    });
    console.log('読み込み結果:');
    console.log('- ヘッダー:', readResult.headers);
    console.log('- データ行数:', readResult.rowCount);
    console.log('- 最初の2行:', readResult.data.slice(0, 2));

    // 8. オブジェクト配列として読み込み
    interface ReadPerson {
      名前: string;
      年齢: number;
      職業: string;
    }

    const people = await readCSVAsObjects<ReadPerson>('./output/sample.csv');
    console.log('オブジェクト配列として読み込み:');
    console.log(people);

    // 9. ストリーム読み込み（大きなファイル用）
    console.log('ストリーム読み込みテスト:');
    let processedRows = 0;
    await readCSVStream('./output/big_data.csv', async (row, lineNumber) => {
      if (lineNumber <= 5) { // 最初の5行だけ表示
        console.log(`行 ${lineNumber}:`, row);
      }
      processedRows++;
    }, {
      skipHeader: true,
      autoParseNumbers: true
    });
    console.log(`合計 ${processedRows} 行を処理しました`);

    // 10. 同期読み込み
    const syncResult = readCSVSync('./output/sample_sync.csv');
    console.log('同期読み込み結果:', syncResult.rowCount, '行');

    // 11. カスタムヘッダーでオブジェクト読み込み
    const customHeaderData = await readCSVAsObjects('./output/sample_objects.csv', {
      headers: ['名前', '年齢', '職業'],
      skipHeader: true // 元のヘッダーをスキップ
    });
    console.log('カスタムヘッダー読み込み:', customHeaderData);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('例の実行でエラーが発生しました:', errorMessage);
  }
}

// 直接実行された場合は例を実行（Node.js環境でのテスト用）
if (require.main === module) {
  runExamples();
}