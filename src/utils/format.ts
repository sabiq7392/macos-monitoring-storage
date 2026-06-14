import { CategoryKey } from '../types';

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function truncatePath(path: string, maxLength = 50): string {
  if (!path) return '';
  if (path.length <= maxLength) return path;
  const charsToShow = maxLength - 3;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return `${path.slice(0, frontChars)}...${path.slice(path.length - backChars)}`;
}

export function getCategoryColor(category: CategoryKey): string {
  const map: Record<CategoryKey, string> = {
    all:              '#94a3b8',
    'Node.js':        '#2dd4bf',
    'Python':         '#a78bfa',
    'Developer/macOS':'#60a5fa',
    'Editor':         '#fb923c',
    'AI':             '#f472b6',
    'Leftover App':   '#fbbf24',
    'Hidden File':    '#e879f9',
  };
  return map[category] ?? '#94a3b8';
}

/** Convert a category string to a valid CSS class suffix */
export function categoryClass(category: string): string {
  return category.toLowerCase().replace(/[^a-z]/g, '');
}
