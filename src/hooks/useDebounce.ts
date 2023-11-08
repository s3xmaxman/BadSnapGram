import { useEffect, useState } from "react";

// https://codesandbox.io/s/react-query-debounce-ted8o?file=/src/useDebounce.js

// 値のデバウンス(一定時間後に値を反映させる)を行うカスタムフック
export default function useDebounce<T>(value: T, delay: number): T {

  // デバウンス後の値を保持する状態
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {

    // delayミリ秒後に値を反映させるタイマーをセット
    const handler = setTimeout(() => {  
      setDebouncedValue(value);
    }, delay);

  
    // クリーンアップ関数でタイマーを削除
    return () => {
      clearTimeout(handler);
    };

  // valueかdelayが変更された時に効果発火
  }, [value, delay]);

  // デバウンス後の値を返す
  return debouncedValue;
}