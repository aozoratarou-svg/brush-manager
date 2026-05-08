import React, { useState } from 'react';
import type { Color } from '../types/index';
import { StorageService } from '../services/storage';

interface Props {
  onAddToInventory?: (colorId: string) => void;
  initialHex?: string;
}

export const CustomColorForm: React.FC<Props> = ({ onAddToInventory, initialHex }) => {
  const [name, setName] = useState('');
  const [nameJa, setNameJa] = useState('');
  const [hex, setHex] = useState(initialHex || '#cccccc');

  React.useEffect(() => {
    if (initialHex) setHex(initialHex);
  }, [initialHex]);

  const handleCreate = () => {
    if (!name.trim()) return;
    const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2,6)}`;
    const color: Color = {
      id,
      manufacturerId: 'custom',
      name: name.trim(),
      nameJa: nameJa.trim() || undefined,
      hex,
    };
    StorageService.addCustomColorToCatalog(color as any);
    if (onAddToInventory) onAddToInventory(id);
    // reset
    setName(''); setNameJa(''); setHex(initialHex || '#cccccc');
    alert('色をカタログに追加しました（マイコレクションにも追加されます）');
  };

  return (
    <div style={{padding:20}}>
      <h3>手動で色を登録</h3>
      <div style={{display:'grid',gap:8}}>
        <input placeholder="英語名 (例: Quinacridone Rose)" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="日本語名 (任意)" value={nameJa} onChange={e=>setNameJa(e.target.value)} />
        <input placeholder="#RRGGBB" value={hex} onChange={e=>setHex(e.target.value)} />
        <div style={{display:'flex',gap:8}}>
          <button onClick={handleCreate} style={{padding:'8px 12px',background:'#d4a574',color:'#fff',border:'none',borderRadius:6}}>カタログに追加して登録</button>
        </div>
      </div>
    </div>
  );
};
