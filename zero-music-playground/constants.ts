
import { NoteTrigger, KitType } from './types';

// Using the official Tone.js audio assets host which is more reliable than JSDelivr for these specific files
const BASE_URL = 'https://tonejs.github.io/audio';

export const KIT_SAMPLES: Record<KitType, string[]> = {
  'TRAP_DRUMS': [
    `${BASE_URL}/drum-samples/808/kick.mp3`,
    `${BASE_URL}/drum-samples/808/snare.mp3`,
    `${BASE_URL}/drum-samples/808/hihat.mp3`,
    `${BASE_URL}/drum-samples/808/openhat.mp3`,
    `${BASE_URL}/drum-samples/808/clap.mp3`,
    `${BASE_URL}/drum-samples/808/cowbell.mp3`,
    `${BASE_URL}/drum-samples/808/rim.mp3`,
    `${BASE_URL}/drum-samples/808/conga1.mp3`,
    `${BASE_URL}/drum-samples/808/tom1.mp3`,
    `${BASE_URL}/drum-samples/808/kick.mp3`
  ],
  'TECHNO_DRUMS': [
    `${BASE_URL}/drum-samples/909/kick.mp3`,
    `${BASE_URL}/drum-samples/909/snare.mp3`,
    `${BASE_URL}/drum-samples/909/hihat.mp3`,
    `${BASE_URL}/drum-samples/909/openhat.mp3`,
    `${BASE_URL}/drum-samples/909/clap.mp3`,
    `${BASE_URL}/drum-samples/909/cowbell.mp3`,
    `${BASE_URL}/drum-samples/909/rim.mp3`,
    `${BASE_URL}/drum-samples/909/tom1.mp3`,
    `${BASE_URL}/drum-samples/909/tom2.mp3`,
    `${BASE_URL}/drum-samples/909/tom3.mp3`
  ],
  'LOFI_DRUMS': [
    `${BASE_URL}/drum-samples/CR78/kick.mp3`,
    `${BASE_URL}/drum-samples/CR78/snare.mp3`,
    `${BASE_URL}/drum-samples/CR78/hihat.mp3`,
    `${BASE_URL}/drum-samples/CR78/openhat.mp3`,
    `${BASE_URL}/drum-samples/808/clap.mp3`,
    `${BASE_URL}/drum-samples/CR78/cowbell.mp3`,
    `${BASE_URL}/drum-samples/CR78/rim.mp3`,
    `${BASE_URL}/drum-samples/CR78/conga.mp3`,
    `${BASE_URL}/drum-samples/CR78/tom.mp3`,
    `${BASE_URL}/drum-samples/CR78/metallic.mp3`
  ],
  'SNARE_COLLECTION': [
    `${BASE_URL}/drum-samples/909/snare.mp3`,
    `${BASE_URL}/drum-samples/808/snare.mp3`,
    `${BASE_URL}/drum-samples/CR78/snare.mp3`,
    `${BASE_URL}/drum-samples/909/clap.mp3`,
    `${BASE_URL}/drum-samples/808/clap.mp3`,
    `${BASE_URL}/drum-samples/CR78/rim.mp3`,
    `${BASE_URL}/drum-samples/909/rim.mp3`,
    `${BASE_URL}/drum-samples/CR78/metallic.mp3`,
    `${BASE_URL}/drum-samples/808/cowbell.mp3`,
    `${BASE_URL}/drum-samples/909/cowbell.mp3`
  ],
  'TRAP_SNARES': [
    `${BASE_URL}/drum-samples/808/snare.mp3`,
    `${BASE_URL}/drum-samples/808/clap.mp3`,
    `${BASE_URL}/drum-samples/808/rim.mp3`,
    `${BASE_URL}/drum-samples/808/cowbell.mp3`,
    `${BASE_URL}/drum-samples/808/snare.mp3`,
    `${BASE_URL}/drum-samples/808/clap.mp3`,
    `${BASE_URL}/drum-samples/808/snare.mp3`,
    `${BASE_URL}/drum-samples/808/clap.mp3`,
    `${BASE_URL}/drum-samples/808/snare.mp3`,
    `${BASE_URL}/drum-samples/808/clap.mp3`
  ],
  'HOUSE_SNARES': [
    `${BASE_URL}/drum-samples/909/snare.mp3`,
    `${BASE_URL}/drum-samples/909/clap.mp3`,
    `${BASE_URL}/drum-samples/909/rim.mp3`,
    `${BASE_URL}/drum-samples/909/snare.mp3`,
    `${BASE_URL}/drum-samples/909/clap.mp3`,
    `${BASE_URL}/drum-samples/909/snare.mp3`,
    `${BASE_URL}/drum-samples/909/clap.mp3`,
    `${BASE_URL}/drum-samples/909/snare.mp3`,
    `${BASE_URL}/drum-samples/909/clap.mp3`,
    `${BASE_URL}/drum-samples/909/snare.mp3`
  ],
  'GRAND_PIANO': [`${BASE_URL}/salamander/C4.mp3`],
  'ELECTRIC_PIANO': [`${BASE_URL}/casio/A1.mp3`],
  'FLAMENCO_GUITAR': [`${BASE_URL}/berklee/guit_electric_clean_A2.mp3`],
  'HARP': [`${BASE_URL}/casio/A1.mp3`], // Fallback for harp
  'CHURCH_ORGAN': [`${BASE_URL}/casio/A1.mp3`], // Fallback for organ
  'BASS_GUITAR': [`${BASE_URL}/casio/A1.mp3`],
  'STRINGS': [`${BASE_URL}/salamander/A4.mp3`],
  'SYNTH_LEAD': [`${BASE_URL}/casio/A1.mp3`],
  'EDM_LEAD': [`${BASE_URL}/casio/A1.mp3`], 
  'SUB_BASS': [`${BASE_URL}/casio/A1.mp3`], 
  'HYPER_SAW': [`${BASE_URL}/casio/A1.mp3`], 
  'SINE_SYNTH': [`${BASE_URL}/casio/A1.mp3`], 
  'SYNTH_BASS': [`${BASE_URL}/casio/A1.mp3`], 
  'DEEP_SUB': [`${BASE_URL}/casio/A1.mp3`]
};

const f = (note: string, octave: number) => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const baseFreq = 440; // A4
  const semitones = notes.indexOf(note) + (octave - 4) * 12 - 9;
  return baseFreq * Math.pow(2, semitones / 12);
};

export const KEYBOARD_MAP: Record<string, NoteTrigger> = {
  '1': { key: '1', name: 'C5', freq: f('C', 5), row: 0 },
  '2': { key: '2', name: 'C#5', freq: f('C#', 5), row: 0 },
  '3': { key: '3', name: 'D5', freq: f('D', 5), row: 0 },
  '4': { key: '4', name: 'D#5', freq: f('D#', 5), row: 0 },
  '5': { key: '5', name: 'E5', freq: f('E', 5), row: 0 },
  '6': { key: '6', name: 'F5', freq: f('F', 5), row: 0 },
  '7': { key: '7', name: 'F#5', freq: f('F#', 5), row: 0 },
  '8': { key: '8', name: 'G5', freq: f('G', 5), row: 0 },
  '9': { key: '9', name: 'G#5', freq: f('G#', 5), row: 0 },
  '0': { key: '0', name: 'A5', freq: f('A', 5), row: 0 },
  '-': { key: '-', name: 'A#5', freq: f('A#', 5), row: 0 },
  '=': { key: '=', name: 'B5', freq: f('B', 5), row: 0 },

  'q': { key: 'q', name: 'C4', freq: f('C', 4), row: 1 },
  'w': { key: 'w', name: 'C#4', freq: f('C#', 4), row: 1 },
  'e': { key: 'e', name: 'D4', freq: f('D', 4), row: 1 },
  'r': { key: 'r', name: 'D#4', freq: f('D#', 4), row: 1 },
  't': { key: 't', name: 'E4', freq: f('E', 4), row: 1 },
  'y': { key: 'y', name: 'F4', freq: f('F', 4), row: 1 },
  'u': { key: 'u', name: 'F#4', freq: f('F#', 4), row: 1 },
  'i': { key: 'i', name: 'G4', freq: f('G', 4), row: 1 },
  'o': { key: 'o', name: 'G#4', freq: f('G#', 4), row: 1 },
  'p': { key: 'p', name: 'A4', freq: f('A', 4), row: 1 },
  '[': { key: '[', name: 'A#4', freq: f('A#', 4), row: 1 },
  ']': { key: ']', name: 'B4', freq: f('B', 4), row: 1 },

  'a': { key: 'a', name: 'C3', freq: f('C', 3), row: 2 },
  's': { key: 's', name: 'C#3', freq: f('C#', 3), row: 2 },
  'd': { key: 'd', name: 'D3', freq: f('D', 3), row: 2 },
  'f': { key: 'f', name: 'D#3', freq: f('D#', 3), row: 2 },
  'g': { key: 'g', name: 'E3', freq: f('E', 3), row: 2 },
  'h': { key: 'h', name: 'F3', freq: f('F', 3), row: 2 },
  'j': { key: 'j', name: 'F#3', freq: f('F#', 3), row: 2 },
  'k': { key: 'k', name: 'G3', freq: f('G', 3), row: 2 },
  'l': { key: 'l', name: 'G#3', freq: f('G#', 3), row: 2 },
  ';': { key: ';', name: 'A3', freq: f('A', 3), row: 2 },
  "'": { key: "'", name: 'A#3', freq: f('A#', 3), row: 2 },

  'z': { key: 'z', name: 'KICK', freq: f('C', 2), row: 3, drumIndex: 0 },
  'x': { key: 'x', name: 'SNARE', freq: f('D', 2), row: 3, drumIndex: 1 },
  'c': { key: 'c', name: 'HH', freq: f('E', 2), row: 3, drumIndex: 2 },
  'v': { key: 'v', name: 'OH', freq: f('F', 2), row: 3, drumIndex: 3 },
  'b': { key: 'b', name: 'CLAP', freq: f('G', 2), row: 3, drumIndex: 4 },
  'n': { key: 'n', name: 'COW', freq: f('A', 2), row: 3, drumIndex: 5 },
  'm': { key: 'm', name: 'RIM', freq: f('B', 2), row: 3, drumIndex: 6 },
  ',': { key: ',', name: 'CON', freq: f('C', 2), row: 3, drumIndex: 7 },
  '.': { key: '.', name: 'TOM', freq: f('D', 2), row: 3, drumIndex: 8 },
  '/': { key: '/', name: 'BD2', freq: f('E', 2), row: 3, drumIndex: 9 }
};
