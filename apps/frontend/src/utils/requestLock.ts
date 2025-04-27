export class RequestLock<Key = string> {
    private readonly inFlight = new Set<Key>();
  
    /** true なら同じキーの処理が進行中 */
    isLocked(key: Key) {
      return this.inFlight.has(key);
    }
  
    /** 処理開始時に呼ぶ。多重なら false を返す */
    tryLock(key: Key): boolean {
      if (this.inFlight.has(key)) return false;
      this.inFlight.add(key);
      return true;
    }
  
    /** finally で必ず呼ぶ */
    release(key: Key) {
      this.inFlight.delete(key);
    }
  }