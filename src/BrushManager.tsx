import React, { useState, useEffect, useLayoutEffect } from 'react';
import { manufacturers, colorCatalog } from './data/catalog';
import type { InventoryItem } from './types/index';
import { StorageService } from './services/storage';
import { ManufacturerSelector } from './components/ManufacturerSelector';
import { ColorCatalog } from './components/ColorCatalog';
import { InventoryList } from './components/InventoryList';
import { CustomColorForm } from './components/CustomColorForm';
import { CameraCapture } from './components/CameraCapture';

type ViewMode = 'catalog' | 'inventory' | 'manual' | 'camera';

const BrushManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [allColors, setAllColors] = useState<any[]>(colorCatalog);
  const isInitialLoad = React.useRef(true);

  // Load inventory and colors before render
  useLayoutEffect(() => {
    const loaded = StorageService.loadInventory();
    const customColors = StorageService.loadCatalog();
    setInventory(loaded);
    setAllColors([...colorCatalog, ...customColors]);
  }, []);

  // Skip save on initial render
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    StorageService.saveInventory(inventory);
  }, [inventory]);

  const handleAddColor = (colorId: string) => {
    const item = StorageService.addItem(colorId);
    setInventory([...inventory, item]);
  };

  const handleRemoveItem = (itemId: string) => {
    StorageService.removeItem(itemId);
    setInventory(inventory.filter((item) => item.id !== itemId));
  };

  const getCurrentColors = (): any[] => {
    if (selectedManufacturer) {
      return allColors.filter(c => c.manufacturerId === selectedManufacturer);
    }
    return [];
  };

  const handleSelectManufacturer = (manufacturerId: string) => {
    setSelectedManufacturer(manufacturerId);
    setViewMode('catalog');
  };

  const handleAddCustomColor = (colorId: string) => {
    const item = StorageService.addItem(colorId);
    setInventory([...inventory, item]);
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>🎨 My Watercolor Collection</h1>
        <p style={styles.subtitle}>色見本管理 - Watercolor Inventory</p>
      </header>

      <nav style={styles.nav}>
        <button
          onClick={() => setViewMode('catalog')}
          style={{
            ...styles.navButton,
            ...(viewMode === 'catalog' ? styles.navButtonActive : {}),
          }}
        >
          📖 カタログから登録
        </button>
        <button
          onClick={() => setViewMode('manual')}
          style={{
            ...styles.navButton,
            ...(viewMode === 'manual' ? styles.navButtonActive : {}),
          }}
        >
          ✍️ 手動で登録
        </button>
        <button
          onClick={() => setViewMode('camera')}
          style={{
            ...styles.navButton,
            ...(viewMode === 'camera' ? styles.navButtonActive : {}),
          }}
        >
          📷 カメラで登録
        </button>
        <button
          onClick={() => setViewMode('inventory')}
          style={{
            ...styles.navButton,
            ...(viewMode === 'inventory' ? styles.navButtonActive : {}),
          }}
        >
          📚 マイコレクション ({inventory.length})
        </button>
      </nav>

      <main style={styles.main}>
        {viewMode === 'catalog' && (
          <div style={styles.content}>
            <ManufacturerSelector
              manufacturers={manufacturers}
              selectedId={selectedManufacturer}
              onSelect={handleSelectManufacturer}
            />
            {selectedManufacturer && (
              <ColorCatalog
                colors={getCurrentColors()}
                onAdd={handleAddColor}
              />
            )}
          </div>
        )}

        {viewMode === 'manual' && (
          <div style={styles.content}>
            <CustomColorForm onAddToInventory={handleAddCustomColor} />
          </div>
        )}

        {viewMode === 'camera' && (
          <div style={styles.content}>
            <CameraCapture onAddToInventory={handleAddCustomColor} />
          </div>
        )}

        {viewMode === 'inventory' && (
          <InventoryList
            inventory={inventory}
            allColors={allColors}
            manufacturers={manufacturers}
            onRemove={handleRemoveItem}
          />
        )}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          💡 ヒント: 各メーカーから色を検索して追加してください。複数デバイスで同期する場合は設定で保存方法を変更できます。
        </p>
      </footer>
    </div>
  );
};

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#faf8f6',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '30px 20px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '32px',
    fontWeight: 700,
    color: '#2c3e50',
  },
  subtitle: {
    margin: '0',
    fontSize: '14px',
    color: '#999',
    fontWeight: 400,
  },
  nav: {
    display: 'flex',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  navButton: {
    padding: '12px 24px',
    backgroundColor: '#f5f3f0',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#666',
  },
  navButtonActive: {
    backgroundColor: '#d4a574',
    border: '1px solid #d4a574',
    color: '#fff',
  },
  main: {
    flex: 1,
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    paddingBottom: '40px',
  },
  content: {
    backgroundColor: '#fff',
  },
  footer: {
    backgroundColor: '#f5f3f0',
    borderTop: '1px solid #e0e0e0',
    padding: '20px',
    textAlign: 'center' as const,
    marginTop: 'auto',
  },
  footerText: {
    margin: '0',
    fontSize: '13px',
    color: '#999',
  },
};

export default BrushManager;
