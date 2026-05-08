// メーカー情報
export interface Manufacturer {
  id: string;
  name: string;
  nameJa?: string;
  logo: string; // ロゴURL or emoji
  region: 'JP' | 'EU' | 'US';
  website?: string;
}

// 色見本
export interface Color {
  id: string;
  manufacturerId: string;
  name: string;
  nameJa?: string;
  hex: string;
  pigments?: string[];
  lightfastness?: string; // 耐光性グレード
  imageUrl?: string;
  notes?: string;
}

// ユーザーの在庫
export interface InventoryItem {
  id: string;
  colorId: string;
  addedDate: number; // タイムスタンプ
  quantity?: number;
  notes?: string;
}

// アプリの状態
export interface AppState {
  inventory: InventoryItem[];
  favoriteColors?: string[];
}
