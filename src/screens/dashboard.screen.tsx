import React from 'react';
import { CacheItem } from '../types';
import { CategoryKey } from '../types';
import { CategoryCard } from './CategoryCard';
import { CacheItemCard } from './CacheItemCard';
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
    <>
      {/* Total stat card */}
      <section className="overview-section">
        <div className="glass-card main-stat-card">
          <div className="card-bg-gradient" />
          <div className="stat-content">
            <p className="stat-label">TOTAL CACHE</p>
            <h1 id="total-size">{formatBytes(totalBytes)}</h1>
            <p className="stat-desc">
              Dapat segera dibersihkan untuk melegakan penyimpanan sistem Anda
            </p>
          </div>
        </div>

        {/* Category filter grid */}
        <div className="overview-grid">
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
      </section>

      {/* Cache list */}
      <section className="list-section">
        <div className="section-header">
          <h2>Detail Folder Cache</h2>
          <div className="header-actions">
            <button
              id="refresh-btn"
              className="refresh-btn-premium"
              onClick={handleRescan}
              disabled={state.isScanning}
            >
              <span className="refresh-icon-spin">↻</span> Pindai Ulang
            </button>
            <span id="scan-time" className="scan-time-text">
              {state.lastScanned
                ? `Terakhir diperbarui: ${state.lastScanned}`
                : 'Terakhir diperbarui: Sedang memindai...'}
            </span>
          </div>
        </div>

        <div className="glass-card list-card">
          {filteredItems.length === 0 ? (
            <div id="empty-state" className="empty-state">
              <div className="success-icon">✓</div>
              <h3>Sistem Anda Bersih!</h3>
              <p>Tidak ada cache atau file sampah yang terdeteksi.</p>
            </div>
          ) : (
            <ul id="cache-list" className="cache-list-items">
              {filteredItems.map(item => (
                <CacheItemCard key={item.id} item={item} onCleaned={handleCleaned} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
