import { CacheItem } from '../types';
import { CategoryKey } from '../types';
import { CategoryCard } from '../components/category_card.comp';
import { CacheItemCard } from '../components/cache_item_card.comp';
import { formatBytes } from '../utils/format';

interface DashboardProps {
  state: any; // using any for simplicity, you can replace with proper type later
  totalBytes: number;
  bytesByCategory: (key: CategoryKey) => number;
  filteredItems: CacheItem[];
  setFilter: (key: CategoryKey) => void;
  handleRescan: () => void;
  handleCleaned: () => void;
}

export function Dashboard({
  state,
  totalBytes,
  bytesByCategory,
  filteredItems,
  setFilter,
  handleRescan,
  handleCleaned,
}: DashboardProps) {
  const CATEGORIES: { key: CategoryKey; label: string }[] = [
    { key: 'Node.js', label: 'Node.js & npm' },
    { key: 'Python', label: 'Python' },
    { key: 'Developer/macOS', label: 'Developer/macOS' },
    { key: 'Editor', label: 'Editor Caches' },
    { key: 'AI', label: 'AI Caches' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
      {/* Left column – 5 cols */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Total stat card */}
        <div className="relative overflow-hidden p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(45,212,191,0.12),transparent_60%)] pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-teal-400 tracking-[0.2em] uppercase mb-2">TOTAL CACHE</p>
            <h1 id="total-size" className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              {formatBytes(totalBytes)}
            </h1>
            <p className="text-xs text-slate-400">
              Dapat segera dibersihkan untuk melegakan penyimpanan sistem Anda
            </p>
          </div>
        </div>

        {/* Category filter grid */}
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.key}
              categoryKey={cat.key}
              label={cat.label}
              bytes={bytesByCategory(cat.key)}
              totalBytes={totalBytes}
              active={state.activeFilter === cat.key}
              onToggle={setFilter}
            />
          ))}
        </div>
      </div>

      {/* Right column – 7 cols */}
      <div className="lg:col-span-7 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight">Detail Folder Cache</h2>
          <div className="flex items-center gap-3">
            <button
              id="refresh-btn"
              className="w-9 h-9 flex items-center justify-center bg-teal-500/10 border border-teal-500/30 hover:border-teal-500/80 text-teal-400 hover:text-teal-300 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handleRescan}
              disabled={state.isScanning}
              title="Pindai Ulang"
            >
              <span className={`text-base font-bold ${state.isScanning ? 'animate-spin inline-block' : 'inline-block'}`}>↻</span>
            </button>
            <span id="scan-time" className="text-[10px] text-slate-500">
              {state.lastScanned
                ? `Terakhir diperbarui: ${state.lastScanned}`
                : 'Terakhir diperbarui: Sedang memindai...'}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden shadow-xl">
          {filteredItems.length === 0 ? (
            <div id="empty-state" className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/35 flex items-center justify-center text-3xl text-teal-400 mb-4 animate-pulse">
                ✓
              </div>
              <h3 className="text-base font-bold text-white mb-1">Sistem Anda Bersih!</h3>
              <p className="text-xs text-slate-400">Tidak ada cache atau file sampah yang terdeteksi.</p>
            </div>
          ) : (
            <ul id="cache-list" className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {filteredItems.map(item => (
                <CacheItemCard key={item.id} item={item} onCleaned={handleCleaned} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

