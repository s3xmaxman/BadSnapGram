import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToUrl = (file: File) => {
  // ファイルオブジェクトをURLに変換する 
  URL.createObjectURL(file);
}

// 日付文字列をフォーマットして返す
export function formatDateString(dateString: string) {

  // 日付フォーマットのオプションを設定
  const options: Intl.DateTimeFormatOptions = { 
    year: "numeric", // 年(数字)
    month: "short", // 月(短縮名)
    day: "numeric", // 日(数字)
  };

  // 日付文字列からDateオブジェクトを作成
  const date = new Date(dateString); 

  // 日本のロケールでフォーマット
  const formattedDate = date.toLocaleDateString("ja-JP", options);

  // 時刻をフォーマット
  const time = date.toLocaleTimeString([], {
    hour: "numeric", // 時(数字)
    minute: "2-digit", // 分(2桁)
  });

  // 日付と時刻を結合して返す
  return `${formattedDate} at ${time}`;
}


// タイムスタンプをフォーマットする
export const multiFormatDateString = (timestamp: string = ""): string => {

  // タイムスタンプを秒に変換
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  
  // Dateオブジェクトを作成
  const date: Date = new Date(timestampNum * 1000);
  
  // 現在の日時
  const now: Date = new Date();

  // 日時の差分を計算
  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    
    // 30日以上前なら通常のフォーマット
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    
    // 1日前なら"1日前"
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} 日前`;
    
    // 1日から30日前なら"x日前"
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} 日前`;
    
    // 1時間以上前なら"x時間前" 
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} 時間前`;
    
    // 1分以上前なら"x分前"
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} 分前`;
    
    // それ以外は"今"
    default:
      return "今";
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};
