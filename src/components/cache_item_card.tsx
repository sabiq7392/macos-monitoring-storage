import React, { useState } from 'react';
import { CacheItem } from '../types';
import { formatBytes, truncatePath, getCategoryColor, categoryClass } from '../utils/format';

interface Props {
  item: CacheItem;
  onCleaned: () => void;
}

export function CacheItemCard({ item, onCleaned }: Props) {
  const [cleaning, setCleaning] = useState(false);

  const handleClean = async () => {
    const ok = confirm(
      `Apakah Anda yakin ingin membersihkan "${item.name}"?\n\nPath:\n${item.path}\n\nTindakan ini tidak dapat dibatalkan!`,
    );
    if (!ok) return;

    setCleaning(true);
    const success = await window.electronAPI.cleanCache({ id: item.id, cleanupCmd: item.cleanupCmd });
    setCleaning(false);

    if (success) {
      onCleaned();
    } else {
      alert('Gagal membersihkan cache ini.');
    }
  };

  const color = getCategoryColor(item.category);
  const badgeClass = categoryClass(item.category);

  return (
    <li className="cache-item">
      <div className="item-info">
        <div className="item-title-col">
          <div className="item-badges-row">
            <span className={`item-badge ${badgeClass}`}>{item.category}</span>
            {item.name.toLowerCase().includes('node_modules') && (
              <span className="item-badge node-modules-badge">node_modules</span>
            )}
          </div>
          <span className="item-name">{item.name}</span>
        </div>
        <span className="item-path" title={item.path}>
          {truncatePath(item.path, 55)}
        </span>
      </div>
      <div className="item-action-row">
        <span className="item-size">{formatBytes(item.size)}</span>
        <button
          className="clean-btn"
          id={`clean-${item.id}`}
          title="Bersihkan Cache"
          onClick={handleClean}
          disabled={cleaning}
        >
          {cleaning ? '⏳' : '🗑️'}
        </button>
      </div>
    </li>
  );
}
