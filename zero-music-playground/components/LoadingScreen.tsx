
import React, { useState, useEffect } from 'react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    "Synchronizing Matrix Nodes...",
    "Allocating Hyper-LFO Buffers...",
    "Initializing Precision Audio Protocols...",
    "Loading Sample Clusters...",
    "Calibrating Analog ADSR Envelopes...",
    "Establishing Unreal Studio Nexus...",
    "Hydrating Engine..."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // 100 steps * 30ms = 3000ms total

    const statusInterval = setInterval(() => {
      setStatusIndex(prev => (prev + 1) % statuses.length);
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#010208] text-white font-sans overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 space-y-12">
        {/* Animated Logo */}
        <div className="relative group">
          <div className="w-24 h-24 border border-white/20 rounded-3xl flex items-center justify-center font-black italic text-4xl text-white shadow-[0_0_50px_rgba(255,255,255,0.05)] bg-white/5 animate-bounce">
            Z
          </div>
          <div className="absolute -inset-4 border border-cyan-400/20 rounded-[2rem] animate-ping" />
        </div>

        <div className="w-full space-y-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">INITIALIZING</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Zero Matrix Engine v6.9</p>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-end px-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-400/60 animate-pulse">
                  {statuses[statusIndex]}
                </span>
                <span className="text-xs font-black italic text-white/40">{progress}%</span>
             </div>
             
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
             </div>
          </div>
        </div>

        {/* Terminal Text Simulation */}
        <div className="w-full bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-[9px] text-white/30 space-y-1 overflow-hidden h-24 shadow-inner">
           <div className="flex gap-2">
             <span className="text-cyan-400/40 select-none">❯</span>
             <span>CLUSTER_SYNC_COMPLETE</span>
           </div>
           <div className="flex gap-2">
             <span className="text-cyan-400/40 select-none">❯</span>
             <span>BUFFER_STREAM_STABLE [44.1kHz]</span>
           </div>
           <div className="flex gap-2">
             <span className="text-cyan-400/40 select-none">❯</span>
             <span>MODULATION_NEXUS_RESOLVED</span>
           </div>
           <div className="flex gap-2">
             <span className="text-cyan-400/40 select-none">❯</span>
             <span className="animate-pulse">AWAITING_USER_INPUT...</span>
           </div>
        </div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-20">
         <span className="text-[8px] font-black uppercase tracking-[0.8em]">Unreal Studio</span>
         <div className="text-xl font-black italic tracking-tighter">PRESTIGE ARCHITECTURE</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
