import React from 'react';
import type { Manufacturer } from '../types/index';

interface ManufacturerSelectorProps {
  manufacturers: Manufacturer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const ManufacturerSelector: React.FC<ManufacturerSelectorProps> = ({
  manufacturers,
  selectedId,
  onSelect,
}) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>メーカーを選択</h2>
      <div style={styles.gridContainer}>
        {manufacturers.map((mfr) => (
          <button
            key={mfr.id}
            onClick={() => onSelect(mfr.id)}
            style={{
              ...styles.manufacturerButton,
              ...(selectedId === mfr.id ? styles.manufacturerButtonActive : {}),
            }}
          >
            <div style={styles.logo}>{mfr.logo}</div>
            <div style={styles.manufacturerName}>{mfr.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '20px',
    fontWeight: 600,
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  manufacturerButton: {
    padding: '20px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: 500,
  },
  manufacturerButtonActive: {
    borderColor: '#8b7d6b',
    backgroundColor: '#f5f3f0',
    boxShadow: '0 4px 12px rgba(139, 125, 107, 0.15)',
  },
  logo: {
    fontSize: '40px',
  },
  manufacturerName: {
    color: '#2c3e50',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
