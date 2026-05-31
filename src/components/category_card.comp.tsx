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
      className={`glass-card mini-card${active ? ' active' : ''}`}
      id={`card-${categoryKey.toLowerCase().replace(/[^a-z]/g, '')}`}
      style={active ? { borderColor: color, background: `${color}14` } : undefined}
      onClick={() => onToggle(categoryKey)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onToggle(categoryKey)}
    >
      <h3 style={active ? { color } : undefined}>{label}</h3>
      <p className="mini-value" style={active ? { color } : undefined}>
        {formatBytes(bytes)}
      </p>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}66` }}
        />
      </div>
    </div>
  );
}
