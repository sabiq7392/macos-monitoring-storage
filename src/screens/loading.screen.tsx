import { ScanMode } from '../types';

interface Props {
  progress: number;
  statusText: string;
  scanningPath: string;
  modes: ScanMode[];
}

const MODE_DETAILS: Record<ScanMode, { label: string; icon: string; classes: string }> = {
  developer: {
    label: 'Cache Developer',
    icon: '💻',
    classes: 'bg-teal-500/10 border-teal-500/30 text-teal-300',
  },
  leftover: {
    label: 'Sisa Aplikasi',
    icon: '🗑️',
    classes: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  },
  hidden: {
    label: 'Berkas Tersembunyi',
    icon: '👁️',
    classes: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300',
  },
};

export function LoadingScreen({ progress, statusText, scanningPath, modes }: Props) {
  const pct = Math.round(Math.min(progress, 100));
  return (
    <div className="relative flex flex-col items-center gap-6 p-10 my-8 mx-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(45,212,191,0.08),transparent_70%)] pointer-events-none" />
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="w-14 h-14 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
        <div className="text-center">
          <h3 id="loading-title" className="text-lg font-bold text-white tracking-tight">
            Sedang Menyisir Penyimpanan... ({pct}%)
          </h3>
          <p className="text-slate-400 text-sm mt-1">{statusText}</p>
        </div>
      </div>

      {modes && modes.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 py-1">
          {modes.map(mode => {
            const detail = MODE_DETAILS[mode];
            if (!detail) return null;
            return (
              <span
                key={mode}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm shadow-sm transition-all duration-300 ${detail.classes}`}
              >
                <span>{detail.icon}</span>
                <span>{detail.label}</span>
              </span>
            );
          })}
        </div>
      )}

      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          id="loading-bar-fill"
          className="h-full bg-gradient-to-r from-teal-400 to-teal-300 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(45,212,191,0.5)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div id="loading-path" className="text-slate-500 text-xs font-mono text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
        {scanningPath}
      </div>
    </div>
  );
}


