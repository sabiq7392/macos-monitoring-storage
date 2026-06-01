import { useState } from 'react';
import { CacheItem } from '../types';
import { formatBytes, truncatePath, getCategoryColor } from '../utils/format';

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

  const handleContextMenu = () => {
    window.electronAPI.showContextMenu({ path: item.path });
  };

  return (
    <li title={item.path} onContextMenu={handleContextMenu} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors duration-150">
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-1 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border"
              style={{ backgroundColor: `${color}15`, color, borderColor: `${color}30` }}
            >
              {item.category}
            </span>
            {item.name.toLowerCase().includes('node_modules') && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border bg-teal-500/10 text-teal-400 border-teal-500/30">
                node_modules
              </span>
            )}
          </div>
          <span className="text-sm font-semibold text-white truncate block">{item.name}</span>
        </div>
        <span className="text-xs font-mono text-slate-500 truncate block mt-0.5" title={item.path}>
          {truncatePath(item.path, 55)}
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-semibold text-slate-300">{formatBytes(item.size)}</span>
        <button
          className="w-9 h-9 flex items-center justify-center bg-red-500/10 border border-red-500/30 hover:border-red-500 hover:bg-red-500 hover:text-white rounded-lg text-sm transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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

