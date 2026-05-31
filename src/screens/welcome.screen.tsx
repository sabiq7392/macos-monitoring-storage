import React from 'react';

interface Props {
  onStartScan: () => void;
}

export function WelcomeScreen({ onStartScan }: Props) {
  return (
    <div className="welcome-screen glass-card">
      <div className="welcome-bg-gradient" />
      <div className="welcome-logo-glowing">
        <span className="logo-arrow">↻</span>
      </div>
      <h1>Siap membersihkan Mac Anda, bro?</h1>
      <p>
        Junk-Detector akan menyisir seluruh komputer Anda untuk memantau semua file cache &amp;
        hidden files raksasa milik{' '}
        <strong>Node.js, npm, Python, Code Editors (VS Code, Cursor)</strong>, serta log obrolan{' '}
        <strong>AI Caches (Claude &amp; Antigravity)</strong>.
      </p>
      <button className="glowing-btn" id="start-scan-btn" onClick={onStartScan}>
        Mulai Pindai Sekarang
      </button>
    </div>
  );
}
