// Types shared across the app

export interface CacheItem {
  id: string;
  name: string;
  category: 'Node.js' | 'Python' | 'Developer/macOS' | 'Editor' | 'AI';
  path: string;
  size: number;
  cleanupCmd: string;
}

export type CategoryKey = CacheItem['category'] | 'all';

export interface ScanProgressData {
  path: string;
  status: string;
  progress?: number;
}

// Extend the Window type so TypeScript knows about electronAPI
declare global {
  interface Window {
    electronAPI: {
      scanCaches: () => Promise<CacheItem[]>;
      cleanCache: (args: { id: string; cleanupCmd: string }) => Promise<boolean>;
      onScanProgress: (cb: (data: ScanProgressData) => void) => void;
      onTriggerScan: (cb: () => void) => void;
      onHotReload: (cb: () => void) => void;
      showContextMenu: (args: { path: string }) => void;
    };
  }
}
