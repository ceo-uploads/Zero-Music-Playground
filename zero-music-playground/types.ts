
export type KitType = 
  | 'TRAP_DRUMS' 
  | 'TECHNO_DRUMS'
  | 'LOFI_DRUMS'
  | 'SNARE_COLLECTION'
  | 'TRAP_SNARES'
  | 'HOUSE_SNARES'
  | 'GRAND_PIANO' 
  | 'ELECTRIC_PIANO'
  | 'FLAMENCO_GUITAR'
  | 'HARP'
  | 'CHURCH_ORGAN'
  | 'BASS_GUITAR' 
  | 'SYNTH_LEAD' 
  | 'SINE_SYNTH' 
  | 'STRINGS' 
  | 'EDM_LEAD' 
  | 'SUB_BASS' 
  | 'HYPER_SAW' 
  | 'SYNTH_BASS' 
  | 'DEEP_SUB';

export type RowIndex = 0 | 1 | 2 | 3;

export interface ADSRSettings {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface CompressorSettings {
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
}

export interface SectorSettings {
  kit: KitType;
  gain: number;
  pan: number;
  low: number;
  mid: number;
  high: number;
  qFactor: number;
  reverb: number;
  
  // Comprehensive Modulation FX
  chorus: number; // Mix
  chorusRate: number;
  chorusDepth: number;
  
  phaser: number; // Mix
  phaserRate: number;
  phaserFeedback: number;
  
  flanger: number; // Mix
  flangerRate: number;
  flangerFeedback: number;

  pitch: number; 
  kickPunch: number;
  pulseMode: boolean; 
  adsr: ADSRSettings;
  distortion: number; 
  subBoost: number;   
  name?: string;
  mute?: boolean;
  filter?: number;
  solo?: boolean;
}

export interface MixerSettings {
  sectors: Record<RowIndex, SectorSettings>;
  masterGain: number;
  bpm: number;
  metronomeOn: boolean;
  masterCompressor: CompressorSettings;
}

export interface NoteTrigger {
  key: string;
  name: string;
  freq: number;
  row: RowIndex;
  drumIndex?: number;
}

export interface ActiveVoice {
  nodes: AudioNode[];
  gainNode: GainNode;
  startTime: number;
}
