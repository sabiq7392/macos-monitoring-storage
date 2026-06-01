interface Props {
  isScanning: boolean;
}

export function Header({ isScanning }: Props) {
  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl [ -webkit-app-region:drag] select-none min-h-[64px]">
      <div className="relative flex items-center justify-between w-full [ -webkit-app-region:no-drag]">
        {/* Left side spacer to balance the layout for absolute centering */}
        <div className="w-1/3" />

        {/* Absolute Center Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.6)] animate-pulse" />
          <span className="text-xs font-black tracking-[0.25em] text-white">JUNK-DETECTOR</span>
        </div>

        {/* Right side status badge */}
        <div className="w-1/3 flex justify-end">
          <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 rounded-full px-3 py-1 shadow-[0_0_15px_rgba(45,212,191,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
              {isScanning ? 'Sedang Memindai...' : 'Monitoring Aktif'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

