/**
 * ブラウザのローカルストレージに保存されているカラーを取得する。
 * なにも保存されていない場合はinfo(青)を返す。
 * @returns {string} color
 */
export function loadLocalStorageColor():string{
  const localStorageColor = localStorage.getItem('color');
    if(localStorageColor){
        return localStorageColor;
    }
    else{
        return 'info';
    }
}

export function saveLocalStorageColor(color:string){
    localStorage.setItem('color', color);
}