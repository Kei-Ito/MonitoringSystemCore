/**
 * ブラウザのローカルストレージに保存されているデータを取得する。
 * なにも保存されていない場合は空文字列を返す。
 * @param {string} itemName - ローカルストレージのキー名
 * @returns {string} itemNameに対応する値
 */
export function loadLocalStorage(itemName: string): string {
    const localData = localStorage.getItem(itemName);
    if (localData) {
        return localData;
    }
    else {
        return '';
    }
}

/**
 * ブラウザのローカルストレージにデータを保存する。
 * @param {string} itemName ローカルストレージのキー名
 * @param {string} item 保存するデータ
 */
export function saveLocalStorage(itemName: string, item: string) {
    localStorage.setItem(itemName, item);
}