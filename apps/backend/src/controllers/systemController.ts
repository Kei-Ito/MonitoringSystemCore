import { Request, Response } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * システムシャットダウンAPI
 * Arm64 Debian環境でシステムをシャットダウンします
 */
export async function shutdown(req: Request, res: Response) {
  try {
    console.log('System shutdown requested');
    
    // レスポンスを先に返す（シャットダウン前にクライアントへ通知）
    res.json({ 
      success: true,
      message: 'System shutdown initiated. The system will shut down in a few seconds.' 
    });

    // レスポンス送信後、少し待機してからシャットダウン実行
    setTimeout(async () => {
      try {
        // Debian/Linuxでのシャットダウンコマンド
        // sudo権限が必要な場合があるため、アプリケーションは適切な権限で実行される必要がある
        await execPromise('sudo shutdown -h now');
      } catch (error) {
        console.error('Shutdown command failed:', error);
        // エラーの場合は代替コマンドを試行
        try {
          await execPromise('shutdown -h now');
        } catch (fallbackError) {
          console.error('Fallback shutdown command also failed:', fallbackError);
        }
      }
    }, 1000); // 1秒後にシャットダウン実行

  } catch (err) {
    console.error('Shutdown error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to initiate system shutdown',
      error: err instanceof Error ? err.message : String(err)
    });
  }
}

/**
 * システム再起動API
 * Arm64 Debian環境でシステムを再起動します
 */
export async function reboot(req: Request, res: Response) {
  try {
    console.log('System reboot requested');
    
    res.json({ 
      success: true,
      message: 'System reboot initiated. The system will reboot in a few seconds.' 
    });

    setTimeout(async () => {
      try {
        await execPromise('sudo reboot');
      } catch (error) {
        console.error('Reboot command failed:', error);
        try {
          await execPromise('reboot');
        } catch (fallbackError) {
          console.error('Fallback reboot command also failed:', fallbackError);
        }
      }
    }, 1000);

  } catch (err) {
    console.error('Reboot error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to initiate system reboot',
      error: err instanceof Error ? err.message : String(err)
    });
  }
}
