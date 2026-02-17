
import React from 'react';

interface SectorEQProps {
  low: number;
  mid: number;
  high: number;
  color: string;
  onChange: (key: 'low' | 'mid' | 'high', val: number) => void;
  onReset: () => void;
}

const SectorEQ: React.FC<SectorEQProps> = ({ low, mid, high, color, onChange, onReset }) => {
  const norm = (v: number) => ((v + 12) / 24) * 100;

  return (
    <div className="relative w-full h-24 bg-black/40 border border-white/5 rounded-[1.5rem] overflow-hidden group/eq shadow-inner transition-all hover:border-white/10">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 100">
        <line x1="0" y1="25" x2="300" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="300" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        
        <path
          d={`M 0 ${100 - norm(low)} C 50 ${100 - norm(low)}, 100 ${100 - norm(mid)}, 150 ${100 - norm(mid)} C 200 ${100 - norm(mid)}, 250 ${100 - norm(high)}, 300 ${100 - norm(high)}`}
          fill="none"
          stroke={color}
          strokeWidth="3"
          className="transition-all duration-300"
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />

        <circle cx="50" cy={100 - norm(low)} r="4" fill={color} className="shadow-lg" />
        <circle cx="150" cy={100 - norm(mid)} r="4" fill={color} className="shadow-lg" />
        <circle cx="250" cy={100 - norm(high)} r="4" fill={color} className="shadow-lg" />
      </svg>
      
      <div className="absolute inset-0 flex">
        <input type="range" min="-12" max="12" step="0.5" value={low} onChange={(e) => onChange('low', parseFloat(e.target.value))} className="w-1/3 opacity-0 cursor-ns-resize h-full" />
        <input type="range" min="-12" max="12" step="0.5" value={mid} onChange={(e) => onChange('mid', parseFloat(e.target.value))} className="w-1/3 opacity-0 cursor-ns-resize h-full" />
        <input type="range" min="-12" max="12" step="0.5" value={high} onChange={(e) => onChange('high', parseFloat(e.target.value))} className="w-1/3 opacity-0 cursor-ns-resize h-full" />
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onReset(); }}
        className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-[6px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all z-10"
      >
        Reset EQ
      </button>
      
      <div className="absolute bottom-1.5 left-0 w-full flex justify-around text-[6px] font-black text-white/20 uppercase tracking-[0.3em] pointer-events-none">
        <span>Low Shelf</span>
        <span>Peaking</span>
        <span>High Shelf</span>
      </div>
    </div>
  );
};

export default SectorEQ;
