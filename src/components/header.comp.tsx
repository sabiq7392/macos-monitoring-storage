interface Props {
  isScanning: boolean;
}

export function Header({ isScanning }: Props) {
  return (
    <header className="app-header">
      <div className="logo-area">
        <div className="logo-pulse" />
        <span className="logo-text">JUNK-DETECTOR</span>
      </div>
      <div className="status-badge">
        <span className="pulse-green" />
        <span className="badge-text">
          {isScanning ? 'Sedang Memindai...' : 'Monitoring Real-time Aktif'}
        </span>
      </div>
    </header>
  );
}
