import React from 'react';

export type BrushShape = 'round' | 'flat' | 'catsTongue';

interface BrushGraphicProps {
  shape: BrushShape;
  color?: string;
  className?: string;
}

/**
 * 筆のグラフィックを表示するコンポーネント。
 * 後で本物の画像やより詳細なSVGに簡単に差し替えられるように、独立したコンポーネントとして設計しています。
 */
export const BrushGraphic: React.FC<BrushGraphicProps> = ({ shape, color = '#6b7280', className = '' }) => {
  // 後で画像を差し替える場合は、ここを `<img>` タグ等に変更するだけで済みます
  return (
    <div className={`brush-graphic-container ${className}`}>
      <svg viewBox="0 0 100 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {/* 筆の柄（共通） */}
        <rect x="40" y="80" width="20" height="120" rx="10" fill="#e5e7eb" />
        <rect x="35" y="80" width="30" height="30" rx="3" fill="#d1d5db" />
        
        {/* 筆の毛先（形状によって変わる部分） */}
        {shape === 'round' && (
          <path d="M 35 80 Q 50 10 65 80 Z" fill={color} />
        )}
        
        {shape === 'flat' && (
          <path d="M 35 80 L 35 30 Q 50 20 65 30 L 65 80 Z" fill={color} />
        )}
        
        {shape === 'catsTongue' && (
          <path d="M 35 80 Q 30 40 50 15 Q 70 40 65 80 Z" fill={color} />
        )}
      </svg>
    </div>
  );
};
