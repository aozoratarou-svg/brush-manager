import type { InventoryItem } from '../types/index';

const STORAGE_KEY = 'brush-manager-inventory';

export const StorageService = {
  // 在庫をローカルストレージに保存
  saveInventory: (inventory: InventoryItem[]): void => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          inventory,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error('Failed to save inventory:', error);
    }
  },

  // 在庫をローカルストレージから読み込み
  loadInventory: (): InventoryItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.inventory || [];
      }
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
    return [];
  },

  // アイテムを追加
  addItem: (colorId: string): InventoryItem => {
    const item: InventoryItem = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      colorId,
      addedDate: Date.now(),
    };
    const inventory = StorageService.loadInventory();
    inventory.push(item);
    StorageService.saveInventory(inventory);
    return item;
  },

  // アイテムを削除
  removeItem: (itemId: string): void => {
    const inventory = StorageService.loadInventory();
    const updated = inventory.filter((item) => item.id !== itemId);
    StorageService.saveInventory(updated);
  },

  // 在庫内の色IDで検索
  hasColor: (colorId: string): boolean => {
    const inventory = StorageService.loadInventory();
    return inventory.some((item) => item.colorId === colorId);
  },

  // メーカー別に集計
  getInventoryByManufacturer: (
    manufacturerId: string,
    allColors: any[]
  ): string[] => {
    const inventory = StorageService.loadInventory();
    return inventory
      .filter((item) => {
        const color = allColors.find((c) => c.id === item.colorId);
        return color?.manufacturerId === manufacturerId;
      })
      .map((item) => item.colorId);
  },
  // カタログ永続化（ユーザーが追加した色を保存）
  saveCatalog: (catalog: any[]): void => {
    try {
      localStorage.setItem('brush-manager-catalog', JSON.stringify({ catalog, updatedAt: new Date().toISOString() }));
    } catch (error) {
      console.error('Failed to save catalog:', error);
    }
  },

  loadCatalog: (): any[] => {
    try {
      const data = localStorage.getItem('brush-manager-catalog');
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.catalog || [];
      }
    } catch (error) {
      console.error('Failed to load catalog:', error);
    }
    return [];
  },

  addCustomColorToCatalog: (color: any): void => {
    const existing = StorageService.loadCatalog();
    existing.push(color);
    StorageService.saveCatalog(existing);
  },
};
