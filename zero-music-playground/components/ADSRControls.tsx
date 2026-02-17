
import React from 'react';
import { ADSRSettings } from '../types';
import ControlSlider from './ControlSlider';

interface ADSRControlsProps {
  settings: ADSRSettings;
  onChange: (newAdsr: ADSRSettings) => void;
}

const ADSRControls: React.FC<ADSRControlsProps> = ({ settings, onChange }) => {
  const update = (key: keyof ADSRSettings, val: number) => {
    onChange({ ...settings, [key]: val });
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <ControlSlider label="Attack" min={0.01} max={2} step={0.01} unit="s" value={settings.attack} onChange={v => update('attack', v)} />
      <ControlSlider label="Decay" min={0.01} max={2} step={0.01} unit="s" value={settings.decay} onChange={v => update('decay', v)} />
      <ControlSlider label="Sustain" min={0} max={1} step={0.01} unit="" value={settings.sustain} onChange={v => update('sustain', v)} />
      <ControlSlider label="Release" min={0.01} max={5} step={0.01} unit="s" value={settings.release} onChange={v => update('release', v)} />
    </div>
  );
};

export default ADSRControls;
