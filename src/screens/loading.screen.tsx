import React from 'react';

interface Props {
  progress: number;
  statusText: string;
  scanningPath: string;
}

export function LoadingScreen({ progress, statusText, scanningPath }: Props) {
  const pct = Math.min(progress, 100);
  return (
    <div className="glass-card loading-screen">
      <div className="loading-bg-gradient" />
      <div className="loading-content-wrapper">
        <div className="loading-spinner-wrapper">
          <div className="glowing-spinner" />
        </div>
        <div className="loading-text-wrapper">
          <h3 id="loading-title" className="loading-title">
            Sedang Menyisir Penyimpanan... ({pct}%)
          </h3>
          <p className="loading-status-text">{statusText}</p>
        </div>
      </div>
      <div className="loading-bar-track">
        <div
          id="loading-bar-fill"
          className="loading-bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div id="loading-path" className="loading-path-text">
        {scanningPath}
      </div>
    </div>
  );
}
