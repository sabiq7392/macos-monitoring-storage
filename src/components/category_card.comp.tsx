import { CategoryKey } from '../types';
import { formatBytes, getCategoryColor } from '../utils/format';

interface Props {
  categoryKey: CategoryKey;
  label: string;
  bytes: number;
  totalBytes: number;
  active: boolean;
  onToggle: (key: CategoryKey) => void;
}

export function CategoryCard({ categoryKey, label, bytes, totalBytes, active, onToggle }: Props) {
  const color = getCategoryColor(categoryKey);
  const pct = totalBytes > 0 ? (bytes / totalBytes) * 100 : 0;

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none hover:-translate-y-0.5 active:translate-y-0 ${
        active
          ? 'border-transparent shadow-[0_0_15px_-3px_rgba(0,0,0,0.1)]'
          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
      }`}
      id={`card-${categoryKey.toLowerCase().replace(/[^a-z]/g, '')}`}
      style={active ? { borderColor: color, backgroundColor: `${color}14` } : undefined}
      onClick={() => onToggle(categoryKey)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onToggle(categoryKey)}
    >
      <h3 className="text-xs font-semibold mb-1 transition-colors duration-200 text-slate-400" style={active ? { color } : undefined}>{label}</h3>
      <p className="text-lg font-bold text-white mb-2 transition-colors duration-200" style={active ? { color } : undefined}>
        {formatBytes(bytes)}
      </p>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}

