import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { CategoryCard } from './components/CategoryCard';
import { CacheItemCard } from './components/CacheItemCard';
import { useScanner } from './hooks/useScanner';
import { formatBytes } from './utils/format';
import { CategoryKey } from './types';

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'Node.js',         label: 'Node.js & npm' },
  { key: 'Python',          label: 'Python' },
  { key: 'Developer/macOS', label: 'Developer/macOS' },
  { key: 'Editor',          label: 'Editor Caches' },
  { key: 'AI',              label: 'AI Caches' },
];

type Screen = 'welcome' | 'scanning' | 'dashboard';

export default function App() {
  const { state, scan, setFilter, cleanItem } = useScanner();
  const [screen, setScreen] = React.useState<Screen>('welcome');

  // Transition to correct screen based on scan state
  useEffect(() => {
    if (state.isScanning) {
      setScreen('scanning');
    } else if (state.items.length > 0) {
      setScreen('dashboard');
    }
  }, [state.isScanning, state.items.length]);

  // Listen for tray "trigger-scan" event
  useEffect(() => {
    window.electronAPI.onTriggerScan(() => {
      setScreen('scanning');
      scan();
    });
  }, [scan]);

  const handleStartScan = () => {
    setScreen('scanning');
    scan();
  };

  const handleRescan = () => {
    setScreen('scanning');
    scan();
  };

  const handleCleaned = () => {
    // Re-scan after a successful cleanup
    setScreen('scanning');
    scan();
  };

  // Derived stats
  const totalBytes = state.items.reduce((s, i) => s + i.size, 0);
  const bytesByCategory = (key: string): number =>
    state.items.filter(i => i.category === key).reduce((s, i) => s + i.size, 0);

  const filteredItems =
    state.activeFilter === 'all'
      ? state.items
      : state.items.filter(i => i.category === state.activeFilter);

  return (
    <div className="app">
      <Header isScanning={state.isScanning} />

      <main className="dashboard">
        {/* ── Welcome ─────────────────────────────── */}
        {screen === 'welcome' && (
          <WelcomeScreen onStartScan={handleStartScan} />
        )}

        {/* ── Scanning ────────────────────────────── */}
        {screen === 'scanning' && (
          <LoadingScreen
            progress={state.progress}
            statusText={state.statusText}
            scanningPath={state.scanningPath}
          />
        )}

        {/* ── Dashboard ───────────────────────────── */}
        {screen === 'dashboard' && (
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
        )}
      </main>
    </div>
  );
}
