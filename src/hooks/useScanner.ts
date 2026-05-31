import { useState, useCallback, useRef } from 'react';
import { CacheItem, CategoryKey, ScanProgressData } from '../types';

const STATUS_TEXTS = [
  'Mencari berkas cache Node.js & npm...',
  'Menyisir dependensi python virtualenv...',
  'Memindai riwayat chat AI (Claude & Antigravity)...',
  'Menemukan log & cache VS Code & Cursor...',
  'Menganalisis folder Developer & sampah sistem macOS...',
  'Menghitung kapasitas ruang yang bisa dilegakan...',
];

export interface ScannerState {
  items: CacheItem[];
  isScanning: boolean;
  progress: number;
  statusText: string;
  scanningPath: string;
  lastScanned: string | null;
  activeFilter: CategoryKey;
}

export function useScanner() {
  const [state, setState] = useState<ScannerState>({
    items: [],
    isScanning: false,
    progress: 0,
    statusText: STATUS_TEXTS[0],
    scanningPath: 'Menghubungkan ke system files...',
    lastScanned: null,
    activeFilter: 'all',
  });

  const statusIdxRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setFilter = useCallback((filter: CategoryKey) => {
    setState(prev => ({
      ...prev,
      activeFilter: prev.activeFilter === filter ? 'all' : filter,
    }));
  }, []);

  const scan = useCallback(async () => {
    if (state.isScanning) return;

    statusIdxRef.current = 0;

    setState(prev => ({
      ...prev,
      isScanning: true,
      progress: 0,
      statusText: STATUS_TEXTS[0],
      scanningPath: 'Menghubungkan ke system files...',
    }));

    // Animate progress bar
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.progress >= 96) return prev;
        const next = Math.min(prev.progress + Math.floor(Math.random() * 4) + 2, 96);
        statusIdxRef.current++;
        return {
          ...prev,
          progress: next,
          statusText: STATUS_TEXTS[statusIdxRef.current % STATUS_TEXTS.length],
        };
      });
    }, 120);

    // Listen to real-time progress from main process
    window.electronAPI.onScanProgress((data: ScanProgressData) => {
      setState(prev => ({ ...prev, scanningPath: `${data.status}: ${data.path}` }));
    });

    try {
      const results = await window.electronAPI.scanCaches();

      if (intervalRef.current) clearInterval(intervalRef.current);

      setState(prev => ({
        ...prev,
        progress: 100,
        statusText: 'Pemindaian selesai!',
        scanningPath: '',
      }));

      // Brief pause so user sees 100%
      await new Promise<void>(r => setTimeout(r, 300));

      const now = new Date().toLocaleTimeString('id-ID');
      setState(prev => ({
        ...prev,
        items: results,
        isScanning: false,
        progress: 0,
        lastScanned: now,
      }));

    } catch (err) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      console.error('Scan failed:', err);
      setState(prev => ({ ...prev, isScanning: false, progress: 0 }));
    }
  }, [state.isScanning]);

  const cleanItem = useCallback(async (id: string, cleanupCmd: string): Promise<boolean> => {
    const success = await window.electronAPI.cleanCache({ id, cleanupCmd });
    return success;
  }, []);

  return { state, scan, setFilter, cleanItem };
}
