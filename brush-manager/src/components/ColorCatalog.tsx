import React, { useState } from 'react';
import type { Color } from '../types/index';
import { StorageService } from '../services/storage';

interface ColorCatalogProps {
  colors: Color[];
  onAdd: (colorId: string) => void;
}

export const ColorCatalog: React.FC<ColorCatalogProps> = ({ colors, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ownedColorIds, setOwnedColorIds] = useState<Set<string>>(
    new Set(colors.filter((c) => StorageService.hasColor(c.id)).map((c) => c.id))
  );

  const filteredColors = colors.filter(
    (color) =>
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (color.nameJa && color.nameJa.includes(searchTerm))
  );

  const handleAddColor = (colorId: string) => {
    StorageService.addItem(colorId);
    setOwnedColorIds(new Set([...ownedColorIds, colorId]));
    onAdd(colorId);
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="色名で検索（例：Ultramarine, ウルトラマリン）"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <span style={styles.resultCount}>{filteredColors.length} 件</span>
      </div>

      <div style={styles.colorGrid}>
        {filteredColors.map((color) => {
          const isOwned = ownedColorIds.has(color.id);
          return (
            <div
              key={color.id}
              style={{
                ...styles.colorCard,
                ...(isOwned ? styles.colorCardOwned : {}),
              }}
            >
              <div
                style={{
                  ...styles.colorSwatch,
                  backgroundColor: color.hex,
                }}
              />
              <div style={styles.colorInfo}>
                <h4 style={styles.colorName}>{color.name}</h4>
                {color.nameJa && (
                  <p style={styles.colorNameJa}>{color.nameJa}</p>
                )}
                <p style={styles.colorHex}>{color.hex}</p>
                {color.pigments && (
                  <p style={styles.pigmentInfo}>顔料: {color.pigments.join(', ')}</p>
                )}
              </div>
              <button
                onClick={() => handleAddColor(color.id)}
                disabled={isOwned}
                style={{
                  ...styles.addButton,
                  ...(isOwned ? styles.addButtonDisabled : {}),
                }}
              >
                {isOwned ? '✓ 所有' : '追加'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  searchContainer: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d0c5b9',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
  },
  resultCount: {
    fontSize: '12px',
    color: '#888',
    minWidth: '50px',
    textAlign: 'right' as const,
  },
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  colorCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  colorCardOwned: {
    backgroundColor: '#f9f7f4',
    borderColor: '#8b7d6b',
    opacity: 0.7,
  },
  colorSwatch: {
    width: '100%',
    height: '80px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  colorInfo: {
    flex: 1,
  },
  colorName: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: 600,
    color: '#2c3e50',
  },
  colorNameJa: {
    margin: '2px 0',
    fontSize: '13px',
    color: '#666',
  },
  colorHex: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#999',
  },
  pigmentInfo: {
    margin: '4px 0 0 0',
    fontSize: '11px',
    color: '#aaa',
    fontStyle: 'italic' as const,
  },
  addButton: {
    padding: '10px 16px',
    backgroundColor: '#d4a574',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  addButtonDisabled: {
    backgroundColor: '#d0c5b9',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
};
