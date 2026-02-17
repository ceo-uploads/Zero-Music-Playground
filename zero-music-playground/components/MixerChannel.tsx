
import React from 'react';
// Fix: Import SectorSettings instead of the missing ChannelSettings
import { SectorSettings } from '../types';

interface MixerChannelProps {
  settings: SectorSettings;
  onChange: (settings: SectorSettings) => void;
}

const MixerChannel: React.FC<MixerChannelProps> = ({ settings, onChange }) => {
  // Fix: Use SectorSettings in the update function
  const update = (key: keyof SectorSettings, val: any) => {
    onChange({ ...settings, [key]: val });
  };

  return (
    <div className="flex flex-col items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-36 shadow-2xl relative group hover:border-cyan-500/40 transition-all">
      <div className="text-[9px] font-black text-white/40 mb-5 tracking-[0.3em] uppercase truncate w-full text-center border-b border-white/5 pb-3">
        {settings.name || 'Channel'}
      </div>
      
      <div className="space-y-5 w-full">
        <div className="grid grid-cols-1 gap-4">
           <Knob label="HIGH" value={settings.high} min={-12} max={12} onChange={v => update('high', v)} unit="dB" color="cyan" />
           <Knob label="MID" value={settings.mid} min={-12} max={12} onChange={v => update('mid', v)} unit="dB" color="cyan" />
           <Knob label="LOW" value={settings.low} min={-12} max={12} onChange={v => update('low', v)} unit="dB" color="cyan" />
        </div>
        
        <div className="py-3 border-y border-white/5 my-3">
          {/* Fix: Handle optional filter property */}
          <Knob label="DJ FILTER" value={settings.filter || 0} min={-100} max={100} onChange={v => update('filter', v)} color="magenta" />
        </div>

        <div className="flex gap-4 items-end h-32 pt-2">
           {/* LED Level Meter Simulation */}
           <div className="w-2 flex flex-col gap-0.5 h-full justify-end">
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} className={`w-full h-1.5 rounded-sm ${i < 2 ? 'bg-red-500/20' : i < 4 ? 'bg-yellow-500/20' : 'bg-cyan-500/20'} ${!settings.mute && Math.random() > 0.3 ? 'animate-pulse' : ''}`} />
              ))}
           </div>
           
           <div className="flex-1 flex flex-col gap-1 items-center h-full">
             <input 
               type="range" 
               min="0" max="1.5" step="0.01" 
               value={settings.gain} 
               onChange={e => update('gain', parseFloat(e.target.value))}
               className="w-full accent-cyan-400 h-28 appearance-none bg-white/5 rounded-full [writing-mode:bt-lr] cursor-ns-resize vertical-slider" 
             />
             <span className="text-[8px] font-bold text-white/30 uppercase mt-2">Level</span>
           </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button 
          className={`w-8 h-8 rounded-lg text-[9px] font-black flex items-center justify-center border transition-all ${settings.mute ? 'bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white/5 border-white/10 text-white/40'}`} 
          onClick={() => update('mute', !settings.mute)}>M</button>
        <button 
          className={`w-8 h-8 rounded-lg text-[9px] font-black flex items-center justify-center border transition-all ${settings.solo ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 border-white/10 text-white/40'}`} 
          onClick={() => update('solo', !settings.solo)}>S</button>
      </div>
    </div>
  );
};

const Knob: React.FC<{ label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void; color: 'cyan' | 'magenta' }> = 
({ label, value, min, max, unit = "", onChange, color }) => (
  <div className="flex flex-col items-center gap-2 group/knob">
    <div className="flex justify-between w-full px-1">
      <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">{label}</span>
      <span className={`text-[7px] font-mono font-bold ${color === 'cyan' ? 'text-cyan-400' : 'text-fuchsia-400'}`}>{value}{unit}</span>
    </div>
    <div className="relative w-full h-1 bg-white/5 rounded-full overflow-hidden">
       <div 
         className={`h-full transition-all duration-75 ${color === 'cyan' ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)]'}`} 
         style={{ width: `${((value - min) / (max - min)) * 100}%` }} 
       />
       <input 
         type="range" min={min} max={max} step="0.1" value={value} 
         onChange={e => onChange(parseFloat(e.target.value))}
         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
       />
    </div>
  </div>
);

export default MixerChannel;
