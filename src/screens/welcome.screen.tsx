import { useState } from 'react';
import { ScanMode } from '../types';

interface Props {
  onStartScan: (modes: ScanMode[]) => void;
}

const SCAN_MODES: { key: ScanMode; icon: string; title: string; desc: string }[] = [
  {
    key: 'developer',
    icon: '💻',
    title: 'Developer Cache',
    desc: 'Node.js, Python, Editor, AI — scan bawaan',
  },
  {
    key: 'leftover',
    icon: '🗑️',
    title: 'Leftover Apps',
    desc: 'Sisa file dari aplikasi yang sudah di-uninstall',
  },
  {
    key: 'hidden',
    icon: '👁️',
    title: 'Hidden Files',
    desc: 'File & folder tersembunyi besar yang tak terlihat di Finder',
  },
];

export function WelcomeScreen({ onStartScan }: Props) {
  const [selectedModes, setSelectedModes] = useState<Set<ScanMode>>(new Set(['developer']));

  const toggleMode = (mode: ScanMode) => {
    setSelectedModes(prev => {
      const next = new Set(prev);
      if (next.has(mode)) {
        next.delete(mode);
      } else {
        next.add(mode);
      }
      return next;
    });
  };

  const handleScan = () => {
    if (selectedModes.size === 0) return;
    onStartScan([...selectedModes]);
  };

  return (
    <div className="relative flex flex-col items-center justify-center text-center p-8 md:p-12 my-8 mx-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-teal-500/30">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(45,212,191,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cybernetic Glowing Scanner Visual */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-500/20 animate-[spin_20s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border border-teal-500/40 animate-[spin_10s_linear_infinite_reverse]" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-teal-500/20 to-purple-500/20 border border-white/10 animate-[pulse_2s_infinite]" />
        <div className="relative w-16 h-16 rounded-full bg-slate-950/80 border border-teal-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.3)]">
          <span className="text-3xl text-teal-400 animate-pulse select-none">⚡</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 mt-2">
        Siap Bersihkan Mac Anda, Bro?
      </h1>
      <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md mt-3">
        Pilih apa yang ingin dipindai, lalu klik tombol scan. Junk-Detector akan bekerja secara aman dan cepat.
      </p>

      {/* Scan Mode Toggles */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 w-full max-w-xl">
        {SCAN_MODES.map(({ key, icon, title, desc }) => {
          const active = selectedModes.has(key);
          return (
            <button
              key={key}
              id={`mode-${key}`}
              onClick={() => toggleMode(key)}
              className={[
                'flex flex-col items-center gap-2 px-4 py-4 rounded-xl border text-left cursor-pointer transition-all duration-200 select-none',
                active
                  ? 'bg-teal-500/15 border-teal-400/60 shadow-[0_0_16px_rgba(45,212,191,0.15)]'
                  : 'bg-slate-800/40 border-white/10 hover:border-white/25 hover:bg-slate-800/70',
              ].join(' ')}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="text-xl">{icon}</span>
                <span className={`text-xs font-bold tracking-wide ${active ? 'text-teal-300' : 'text-slate-200'}`}>
                  {title}
                </span>
                {/* Checkmark indicator */}
                <span className={`ml-auto w-4 h-4 rounded-full flex items-center justify-center border text-[9px] transition-all duration-200 ${active ? 'bg-teal-400 border-teal-400 text-slate-900' : 'border-slate-600 text-transparent'}`}>
                  ✓
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug text-left">{desc}</p>
            </button>
          );
        })}
      </div>

      {/* Call to Action Button */}
      <button
        className="mt-7 px-12 py-3.5 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-900 rounded-full font-black text-xs md:text-sm uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] active:translate-y-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        id="start-scan-btn"
        onClick={handleScan}
        disabled={selectedModes.size === 0}
      >
        {selectedModes.size === 0 ? 'Pilih minimal 1 mode' : `Mulai Pindai (${selectedModes.size} mode)`}
      </button>
    </div>
  );
}


