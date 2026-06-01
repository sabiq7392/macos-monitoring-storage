interface Props {
  onStartScan: () => void;
}


export function WelcomeScreen({ onStartScan }: Props) {
  return (
    <div className="relative flex flex-col items-center  justify-center text-center bo p-8 md:p-12 my-8 mx-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-teal-500/30">
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
        Junk-Detector memindai seluruh komputer Anda secara aman untuk mendeteksi tumpukan file cache raksasa yang memperlambat sistem.
      </p>

      {/* Call to Action Button */}
      <button
        className="mt-8 px-12 py-3.5 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-900 rounded-full font-black text-xs md:text-sm uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] active:translate-y-0 cursor-pointer"
        id="start-scan-btn"
        onClick={onStartScan}
      >
        Mulai Pindai Sekarang
      </button>
    </div>
  );
}

