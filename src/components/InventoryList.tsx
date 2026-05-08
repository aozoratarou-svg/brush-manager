import React from 'react';
import type { InventoryItem, Color, Manufacturer } from '../types/index';

interface InventoryListProps {
  inventory: InventoryItem[];
  allColors: Color[];
  manufacturers: Manufacturer[];
  onRemove: (itemId: string) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  inventory,
  allColors,
  manufacturers,
  onRemove,
}) => {
  // メーカーごとにグループ化
  const groupedByManufacturer: Record<string, InventoryItem[]> = {};
  inventory.forEach((item) => {
    const color = allColors.find((c) => c.id === item.colorId);
    if (color) {
      if (!groupedByManufacturer[color.manufacturerId]) {
        groupedByManufacturer[color.manufacturerId] = [];
      }
      groupedByManufacturer[color.manufacturerId].push(item);
    }
  });

  const getManufacturerName = (manufacturerId: string) => {
    return manufacturers.find((m) => m.id === manufacturerId)?.name || '不明';
  };

  const getManufacturerLogo = (manufacturerId: string) => {
    return manufacturers.find((m) => m.id === manufacturerId)?.logo || '🎨';
  };

  if (inventory.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>🎨</div>
        <h3 style={styles.emptyTitle}>在庫がありません</h3>
        <p style={styles.emptyDescription}>
          メーカーを選択して、色をカタログから追加してください
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        📚 マイコレクション ({inventory.length} 色)
      </h2>

      {Object.entries(groupedByManufacturer).map(([manufacturerId, items]) => (
        <div key={manufacturerId} style={styles.manufacturerSection}>
          <h3 style={styles.manufacturerHeader}>
            <span>{getManufacturerLogo(manufacturerId)}</span>
            {getManufacturerName(manufacturerId)}
            <span style={styles.colorCount}>({items.length})</span>
          </h3>

          <div style={styles.colorList}>
            {items.map((item) => {
              const color = allColors.find((c) => c.id === item.colorId);
              if (!color) return null;

              return (
                <div key={item.id} style={styles.inventoryItem}>
                  <div
                    style={{
                      ...styles.colorSwatchSmall,
                      backgroundColor: color.hex,
                    }}
                  />
                  <div style={styles.itemInfo}>
                    <p style={styles.itemColorName}>{color.name}</p>
                    {color.nameJa && (
                      <p style={styles.itemColorNameJa}>{color.nameJa}</p>
                    )}
                    <p style={styles.itemDate}>
                      登録: {new Date(item.addedDate).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    style={styles.removeButton}
                    title="削除"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    fontSize: '22px',
    color: '#2c3e50',
    marginBottom: '20px',
    fontWeight: 600,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#999',
  },
  emptyIcon: {
    fontSize: '60px',
    marginBottom: '20px',
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: '20px',
    color: '#666',
    marginBottom: '10px',
  },
  emptyDescription: {
    fontSize: '14px',
    color: '#999',
  },
  manufacturerSection: {
    marginBottom: '30px',
  },
  manufacturerHeader: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#2c3e50',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  colorCount: {
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#999',
    marginLeft: 'auto',
  },
  colorList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '12px',
  },
  inventoryItem: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '12px',
    border: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
  },
  colorSwatchSmall: {
    width: '50px',
    height: '50px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemColorName: {
    margin: '0',
    fontSize: '14px',
    fontWeight: 500,
    color: '#2c3e50',
  },
  itemColorNameJa: {
    margin: '2px 0 0 0',
    fontSize: '12px',
    color: '#666',
  },
  itemDate: {
    margin: '4px 0 0 0',
    fontSize: '11px',
    color: '#999',
  },
  removeButton: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#f5e6e0',
    color: '#d16868',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
};
