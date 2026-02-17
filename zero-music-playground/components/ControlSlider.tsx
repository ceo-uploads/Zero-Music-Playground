
import React from 'react';

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  unit?: string;
}

const ControlSlider: React.FC<ControlSliderProps> = ({ 
  label, value, min, max, step = 1, onChange, unit = "" 
}) => {
  return (
    <div className="flex flex-col gap-2 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <span>{label}</span>
        <span className="text-zinc-200 mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
      />
    </div>
  );
};

export default ControlSlider;
