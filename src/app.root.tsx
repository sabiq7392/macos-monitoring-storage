import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Header } from './components/header.comp';
import { WelcomeScreen } from './screens/welcome.screen';
import { LoadingScreen } from './screens/loading.screen';
import { Dashboard } from './screens/dashboard.screen';
import { useScanner } from './hooks/use_scanner.hook';
import { CategoryKey } from './types';

export default function App() {
  const { state, scan, setFilter, cleanItem } = useScanner();
  const navigate = useNavigate();

  // Helper: after a successful clean, rescan and navigate to dashboard
  const handleCleaned = async () => {
    await scan();
    navigate('/dashboard');
  };

  // Wrapper for start scan that also changes route
  const handleStartScan = async () => {
    navigate('/scanning');
    await scan();
  };

  // Derived stats used by Dashboard
  const totalBytes = state.items.reduce((s, i) => s + i.size, 0);
  const bytesByCategory = (key: CategoryKey) =>
    state.items.filter(i => i.category === key).reduce((s, i) => s + i.size, 0);
  const filteredItems =
    state.activeFilter === 'all'
      ? state.items
      : state.items.filter(i => i.category === state.activeFilter);

  return (
    <>
      <Header isScanning={state.isScanning} />
      <main className="dashboard">
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route
            path="/welcome"
            element={<WelcomeScreen onStartScan={handleStartScan} />}
          />
          <Route
            path="/scanning"
            element={
              <LoadingScreen
                progress={state.progress}
                statusText={state.statusText}
                scanningPath={state.scanningPath}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                state={state}
                totalBytes={totalBytes}
                bytesByCategory={bytesByCategory}
                filteredItems={filteredItems}
                setFilter={setFilter}
                handleRescan={handleStartScan}
                handleCleaned={handleCleaned}
              />
            }
          />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </main>
    </>
  );
}
