
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { audioEngine } from './services/audioEngine';
import { AudioRecorder } from './services/recorder';
import { KEYBOARD_MAP } from './constants';
import { MixerSettings, KitType, RowIndex, SectorSettings, ADSRSettings, CompressorSettings } from './types';
import Visualizer from './components/Visualizer';
import SectorEQ from './components/SectorEQ';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'playground'>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [lastRow, setLastRow] = useState<RowIndex>(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [beatPulse, setBeatPulse] = useState(false);
  const [reverbName, setReverbName] = useState('Cyber Hall');
  const [showFXPanel, setShowFXPanel] = useState<RowIndex | null>(null);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<{url: string, id: string}[]>([]);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultSector = (kit: KitType): SectorSettings => ({
    kit, gain: 0.8, pan: 0, low: 0, mid: 0, high: 0, qFactor: 1.0, reverb: 0.1, 
    chorus: 0.2, chorusRate: 0.5, chorusDepth: 0.002,
    phaser: 0, phaserRate: 0.4, phaserFeedback: 0.2,
    flanger: 0, flangerRate: 0.15, flangerFeedback: 0.5,
    pitch: 0, kickPunch: 0.8,
    distortion: 0, subBoost: 0,
    pulseMode: false, adsr: { attack: 0.02, decay: 0.15, sustain: 0.5, release: 0.35 },
    filter: 0, solo: false
  });

  const [mixer, setMixer] = useState<MixerSettings>({
    sectors: {
      0: defaultSector('HYPER_SAW'),
      1: defaultSector('FLAMENCO_GUITAR'),
      2: defaultSector('SYNTH_BASS'),
      3: defaultSector('TRAP_DRUMS')
    },
    masterGain: 0.8,
    bpm: 128,
    metronomeOn: false,
    masterCompressor: {
      threshold: -24,
      ratio: 4,
      attack: 0.003,
      release: 0.25
    }
  });

  useEffect(() => {
    audioEngine.onBeat = (beat) => {
      setCurrentBeat(beat);
      setBeatPulse(true);
      setTimeout(() => setBeatPulse(false), 80);
    };
  }, []);

  useEffect(() => { if (isStarted) audioEngine.updateMixer(mixer); }, [mixer, isStarted]);

  const handleStart = async () => {
    // Show loading screen immediately
    setIsLoading(true);
    
    const initPromise = audioEngine.init();
    
    // Simulate cinematic loading sequence (3.5 seconds)
    // This allows the user to see the "Maximizing Nodes" status updates
    await new Promise(resolve => setTimeout(resolve, 3500));
    await initPromise;

    setIsStarted(true);
    if (audioEngine.dest) recorderRef.current = new AudioRecorder(audioEngine.dest.stream);
    
    // Switch to playground once initialized
    setIsLoading(false);
    setView('playground');
  };

  const toggleRecording = async () => {
    if (!recorderRef.current) return;
    if (!isRecording) {
      recorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      const url = await recorderRef.current.stop();
      setRecordings(prev => [{url, id: new Date().toISOString()}, ...prev]);
      setIsRecording(false);
    }
  };

  const removeRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReverbChange = (type: string) => {
    if (type === 'custom') {
      fileInputRef.current?.click();
      return;
    }
    setReverbName(type.charAt(0).toUpperCase() + type.slice(1));
    audioEngine.applyAlgorithmicReverb(type as any);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReverbName(file.name.split('.')[0]);
      await audioEngine.setReverbFromFile(file);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isStarted || view !== 'playground') return;
    if (e.code === 'Space') {
      e.preventDefault();
      updateSector(lastRow, 'pulseMode', !mixer.sectors[lastRow].pulseMode);
      return;
    }
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    const trigger = KEYBOARD_MAP[key];
    if (trigger && !activeKeys.has(key)) {
      setLastRow(trigger.row);
      audioEngine.playTrigger(key, trigger.name, trigger.row, trigger.freq, trigger.drumIndex);
      setActiveKeys(prev => new Set(prev).add(key));
    }
  }, [isStarted, activeKeys, lastRow, mixer, view]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const trigger = KEYBOARD_MAP[key];
    if (trigger && activeKeys.has(key)) {
      audioEngine.stopVoice(key, trigger.row);
      setActiveKeys(prev => { const next = new Set(prev); next.delete(key); return next; });
    }
  }, [activeKeys]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [handleKeyDown, handleKeyUp]);

  const updateSector = (idx: RowIndex, key: keyof SectorSettings, val: any) => {
    setMixer(prev => ({ ...prev, sectors: { ...prev.sectors, [idx]: { ...prev.sectors[idx], [key]: val } } }));
  };

  const updateADSR = (idx: RowIndex, adsr: ADSRSettings) => updateSector(idx, 'adsr', adsr);
  
  const resetEQ = (idx: RowIndex) => {
    setMixer(prev => ({
      ...prev,
      sectors: {
        ...prev.sectors,
        [idx]: { ...prev.sectors[idx], low: 0, mid: 0, high: 0 }
      }
    }));
  };

  // State-driven routing: Landing -> Loading -> Playground
  if (view === 'landing' && !isLoading) {
    return <LandingPage onEnter={handleStart} />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  const KITS: KitType[] = [
    'HYPER_SAW', 'EDM_LEAD', 'SYNTH_LEAD', 'GRAND_PIANO', 'ELECTRIC_PIANO', 
    'FLAMENCO_GUITAR', 'HARP', 'CHURCH_ORGAN', 'STRINGS', 'SUB_BASS', 
    'DEEP_SUB', 'SYNTH_BASS', 'BASS_GUITAR', 'TRAP_DRUMS', 'TECHNO_DRUMS', 
    'LOFI_DRUMS', 'SNARE_COLLECTION', 'TRAP_SNARES', 'HOUSE_SNARES', 'SINE_SYNTH'
  ];
  const COLORS = ['#00f3ff', '#ff00ff', '#39ff14', '#ffff00'];

  return (
    <div className="h-screen w-screen bg-[#010414] text-slate-100 font-sans flex flex-col p-2 sm:p-4 overflow-hidden relative selection:bg-cyan-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[100vw] h-[100vw] bg-cyan-600/[0.03] blur-[180px] rounded-full animate-morph-plasma" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] bg-fuchsia-600/[0.03] blur-[180px] rounded-full animate-morph-plasma delay-[4000ms]" />
      </div>

      <header className="glass-nav rounded-2xl p-4 sm:p-5 mb-4 flex flex-col xl:flex-row gap-5 xl:items-center justify-between shadow-2xl border border-white/5 relative z-10 shrink-0">
         <div className="flex items-center gap-5">
            <button onClick={() => setView('landing')} className="group flex items-center gap-3">
               <div className={`w-12 h-12 border border-white/10 rounded-2xl flex items-center justify-center font-black italic text-2xl transition-all duration-150 ${beatPulse ? 'bg-cyan-500/30 border-cyan-400 shadow-[0_0_30px_#22d3ee55]' : 'bg-white/5'}`}>
                 <span>Z</span>
               </div>
            </button>
            <div>
               <h1 className="text-lg md:text-xl font-black italic tracking-tighter text-white uppercase leading-none">Zero Playground v6.9</h1>
               <div className="flex items-center gap-3 mt-1.5">
                 <div className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${mixer.metronomeOn ? (currentBeat === 0 ? 'bg-cyan-400 shadow-[0_0_15px_#22d3ee] scale-110' : 'bg-white/40') : 'bg-white/10'}`} />
                 <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 truncate max-w-[200px]">Connected :: {mixer.bpm} BPM</p>
               </div>
            </div>
         </div>
         
         <div className="flex-1 min-w-0 h-12 rounded-2xl overflow-hidden bg-black/60 border border-white/5 hidden xl:block mx-8 shadow-inner">
            {isStarted && <Visualizer type="master" color={isRecording ? '#ff0000' : '#00f3ff'} />}
         </div>

         <div className="flex flex-wrap items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-4 border-r border-white/10 pr-8 h-8">
                <button 
                  onClick={toggleRecording}
                  className={`flex items-center gap-3 px-4 py-1.5 rounded-xl text-[11px] font-black border transition-all ${isRecording ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-white/20'}`} />
                  {isRecording ? 'STOP REC' : 'RECORD'}
                </button>
                {isRecording && <span className="text-[10px] font-mono text-red-500 w-12">{formatTime(recordingTime)}</span>}
            </div>

            <div className="flex items-center gap-4 border-r border-white/10 pr-8 h-8">
               <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Acoustics</span>
               <select 
                  onChange={(e) => handleReverbChange(e.target.value)}
                  className="bg-black/80 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-black uppercase text-cyan-400/80 outline-none hover:text-cyan-400 transition-all cursor-pointer min-w-[120px]"
               >
                  <option value="hall">Cyber Hall</option>
                  <option value="room">Studio Room</option>
                  <option value="plate">Void Plate</option>
                  <option value="custom">+ Load IR</option>
               </select>
            </div>

            <div className="flex items-center gap-4">
               <span className="text-[11px] font-black uppercase text-white/20 tracking-widest">Master</span>
               <input type="range" min="0" max="1.5" step="0.01" value={mixer.masterGain} onChange={e => setMixer(m => ({ ...m, masterGain: parseFloat(e.target.value) }))} className="w-20 sm:w-28 h-1.5 appearance-none bg-white/10 rounded-full accent-white cursor-pointer" />
            </div>
         </div>
      </header>

      <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10 min-h-0 overflow-hidden mb-2">
         {([0, 1, 2, 3] as RowIndex[]).map(idx => {
           const sector = mixer.sectors[idx];
           const isBassKit = ['BASS_GUITAR', 'SYNTH_BASS', 'DEEP_SUB', 'SUB_BASS'].includes(sector.kit);
           const isLeadKit = ['EDM_LEAD', 'HYPER_SAW', 'SYNTH_LEAD', 'FLAMENCO_GUITAR', 'HARP', 'ELECTRIC_PIANO', 'STRINGS', 'CHURCH_ORGAN'].includes(sector.kit);
           const isPercKit = ['TRAP_DRUMS', 'TECHNO_DRUMS', 'LOFI_DRUMS', 'SNARE_COLLECTION', 'TRAP_SNARES', 'HOUSE_SNARES'].includes(sector.kit);

           return (
             <section key={idx} className={`glass-sector rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 shadow-2xl border transition-all duration-500 min-h-0 ${lastRow === idx ? 'bg-white/[0.04] border-white/30 scale-[1.005] z-20 shadow-cyan-500/10' : 'border-white/5 opacity-70 hover:opacity-100'}`}>
                <div className="flex justify-between items-center shrink-0">
                   <h2 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: COLORS[idx] }}>Node 0{idx+1}</h2>
                   <div className="flex items-center gap-2">
                      <button onClick={() => setShowFXPanel(showFXPanel === idx ? null : idx)} className={`p-1.5 rounded-lg border transition-all text-[9px] font-black uppercase tracking-widest ${showFXPanel === idx ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-white/5 border-white/10 text-white/40'}`}>FX+</button>
                      <select value={sector.kit} onChange={e => updateSector(idx, 'kit', e.target.value as KitType)} className="bg-black/95 border border-white/10 rounded-xl px-2 py-1 text-[9px] sm:text-[10px] font-black outline-none uppercase text-white/50 hover:text-white transition-all cursor-pointer">
                        {KITS.map(k => <option key={k} value={k}>{k.replace('_', ' ')}</option>)}
                      </select>
                   </div>
                </div>

                <div className="h-10 sm:h-14 bg-black/60 rounded-[1.25rem] border border-white/5 overflow-hidden shrink-0 shadow-inner">
                   {isStarted && <Visualizer type="sector" rowIndex={idx} color={COLORS[idx]} />}
                </div>

                <div className="flex-1 flex flex-col gap-4 sm:gap-6 overflow-y-auto no-scrollbar min-h-0 pr-1.5 pb-2">
                   {showFXPanel === idx ? (
                     <div className="flex flex-col gap-4 p-4 bg-black/40 rounded-[1.5rem] border border-white/5 animate-in slide-in-from-top-4 duration-300">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">Detailed Modulation Matrix</span>
                        <div className="space-y-4">
                           <div className="space-y-2">
                             <span className="text-[8px] font-black text-cyan-400/60 uppercase">Chorus Node</span>
                             <SectorControl label="Rate" value={sector.chorusRate} min={0.1} max={5} onChange={v => updateSector(idx, 'chorusRate', v)} color={COLORS[idx]} />
                             <SectorControl label="Depth" value={sector.chorusDepth} min={0.001} max={0.01} onChange={v => updateSector(idx, 'chorusDepth', v)} color={COLORS[idx]} />
                           </div>
                           <div className="space-y-2">
                             <span className="text-[8px] font-black text-fuchsia-400/60 uppercase">Phaser Node</span>
                             <SectorControl label="Rate" value={sector.phaserRate} min={0.1} max={10} onChange={v => updateSector(idx, 'phaserRate', v)} color={COLORS[idx]} />
                             <SectorControl label="Feedbk" value={sector.phaserFeedback} min={0} max={0.9} onChange={v => updateSector(idx, 'phaserFeedback', v)} color={COLORS[idx]} />
                           </div>
                           <div className="space-y-2">
                             <span className="text-[8px] font-black text-green-400/60 uppercase">Flanger Node</span>
                             <SectorControl label="Rate" value={sector.flangerRate} min={0.05} max={2} onChange={v => updateSector(idx, 'flangerRate', v)} color={COLORS[idx]} />
                             <SectorControl label="Feedbk" value={sector.flangerFeedback} min={0} max={0.9} onChange={v => updateSector(idx, 'flangerFeedback', v)} color={COLORS[idx]} />
                           </div>
                        </div>
                        <button onClick={() => setShowFXPanel(null)} className="mt-4 w-full py-2 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 hover:text-white transition-all">Back to Mixer</button>
                     </div>
                   ) : (
                     <>
                        <SectorEQ low={sector.low} mid={sector.mid} high={sector.high} color={COLORS[idx]} onChange={(k, v) => updateSector(idx, k, v)} onReset={() => resetEQ(idx)} />
                        <div className="p-3 sm:p-4 bg-white/[0.02] rounded-[1.5rem] border border-white/5 shrink-0 shadow-inner">
                           <span className="text-[9px] sm:text-[10px] font-black text-white/20 uppercase block mb-3 tracking-[0.2em]">Analog ADSR</span>
                           <div className="grid grid-cols-4 gap-2 h-20 sm:h-24">
                              <ADSRVertical label="ATTK" value={sector.adsr.attack} max={2} onChange={v => updateADSR(idx, { ...sector.adsr, attack: v })} color={COLORS[idx]} />
                              <ADSRVertical label="DECY" value={sector.adsr.decay} max={2} onChange={v => updateADSR(idx, { ...sector.adsr, decay: v })} color={COLORS[idx]} />
                              <ADSRVertical label="SUST" value={sector.adsr.sustain} max={1} onChange={v => updateADSR(idx, { ...sector.adsr, sustain: v })} color={COLORS[idx]} />
                              <ADSRVertical label="RELE" value={sector.adsr.release} max={5} onChange={v => updateADSR(idx, { ...sector.adsr, release: v })} color={COLORS[idx]} />
                           </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 shrink-0">
                           <div className="grid grid-cols-2 gap-4">
                              <SectorControl label="Level" value={sector.gain} min={0} max={1.5} onChange={v => updateSector(idx, 'gain', v)} color={COLORS[idx]} />
                              <SectorControl label="Reverb" value={sector.reverb} min={0} max={0.9} onChange={v => updateSector(idx, 'reverb', v)} color={COLORS[idx]} />
                           </div>
                           <div className="grid grid-cols-1 gap-3 bg-white/[0.01] p-3 rounded-2xl border border-white/5">
                             <div className="grid grid-cols-3 gap-4">
                                <SectorControl label="Chorus" value={sector.chorus} min={0} max={1} onChange={v => updateSector(idx, 'chorus', v)} color={COLORS[idx]} />
                                <SectorControl label="Phaser" value={sector.phaser} min={0} max={1} onChange={v => updateSector(idx, 'phaser', v)} color={COLORS[idx]} />
                                <SectorControl label="Flanger" value={sector.flanger} min={0} max={1} onChange={v => updateSector(idx, 'flanger', v)} color={COLORS[idx]} />
                             </div>
                           </div>
                           <div className="flex flex-col gap-3">
                             <SectorControl label="DJ Filter" value={sector.filter || 0} min={-100} max={100} onChange={v => updateSector(idx, 'filter', v)} color={COLORS[idx]} />
                             <div className="grid grid-cols-2 gap-4">
                                <SectorControl label="Pan" value={sector.pan} min={-1} max={1} onChange={v => updateSector(idx, 'pan', v)} color={COLORS[idx]} />
                                <SectorControl label="Kick Punch" value={sector.kickPunch} min={0} max={1.5} onChange={v => updateSector(idx, 'kickPunch', v)} color={COLORS[idx]} />
                             </div>
                             {!isPercKit && <SectorControl label="Tune" value={sector.pitch} min={-12} max={12} unit="st" onChange={v => updateSector(idx, 'pitch', v)} color={COLORS[idx]} />}
                             {isBassKit && <SectorControl label="Sub-Boost" value={sector.subBoost} min={0} max={12} unit="dB" onChange={v => updateSector(idx, 'subBoost', v)} color="#39ff14" />}
                           </div>
                        </div>
                     </>
                   )}
                </div>

                <div className="grid grid-cols-6 gap-1.5 pt-4 border-t border-white/10 shrink-0 mt-auto">
                   {Object.values(KEYBOARD_MAP).filter(m => m.row === idx).slice(0, 12).map(m => (
                     <div key={m.key} className={`h-8 sm:h-12 rounded-lg flex items-center justify-center text-[10px] font-black transition-all duration-150 border border-white/5 ${activeKeys.has(m.key) ? 'opacity-100 scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-white/5 opacity-15'}`} style={{ backgroundColor: activeKeys.has(m.key) ? COLORS[idx] : '', color: activeKeys.has(m.key) ? '#010414' : '' }}>{m.key.toUpperCase()}</div>
                   ))}
                </div>
             </section>
           );
         })}
      </main>

      {recordings.length > 0 && (
        <div className="shrink-0 mb-4 glass-nav rounded-2xl p-3 sm:p-4 border border-white/5 overflow-x-auto no-scrollbar flex gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex flex-col justify-center border-r border-white/10 pr-4 shrink-0">
             <span className="text-[9px] font-black uppercase text-cyan-400 tracking-widest">SESSIONS</span>
          </div>
          <div className="flex gap-4">
            {recordings.map((rec) => (
              <div key={rec.id} className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-2 border border-white/10 shrink-0 hover:bg-white/10 transition-all group relative">
                <button onClick={() => removeRecording(rec.id)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20 shadow-lg">&times;</button>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-white/60">SESSION_{rec.id.split('T')[1].split(':')[0]}</span>
                </div>
                <a href={rec.url} download={`zero_matrix_session_${rec.id}.wav`} className="p-2 bg-cyan-400 text-slate-950 rounded-lg text-[9px] font-black uppercase hover:scale-105 transition-all shadow-lg">DL</a>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="glass-nav rounded-xl h-8 sm:h-10 flex items-center justify-between px-6 sm:px-8 bg-black/60 border-t border-white/5 relative z-10 shrink-0">
         <div className="text-[9px] font-black uppercase tracking-[0.6em] text-white/20 text-center flex-1">
            Zero Matrix Studio v6.9 :: Keyboard Control Required
         </div>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .glass-nav { background: rgba(2, 6, 25, 0.98); backdrop-filter: blur(30px); }
        .glass-sector { background: rgba(255, 255, 255, 0.003); backdrop-filter: blur(50px); }
        input[type=range] { -webkit-appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 2px; background: rgba(255,255,255,0.06); border-radius: 4px; }
        input[type=range]::-webkit-slider-thumb { height: 12px; width: 12px; border-radius: 50%; background: #fff; cursor: pointer; -webkit-appearance: none; margin-top: -5px; border: 2px solid #000; }
        @keyframes morph-plasma { 0% { transform: scale(1) translate(0,0); } 50% { transform: scale(1.02) translate(0.3%, 0.3%); } 100% { transform: scale(1) translate(0,0); } }
        .animate-morph-plasma { animation: morph-plasma 20s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

const SectorControl: React.FC<{ label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void; color: string }> = ({ label, value, min, max, unit = "", onChange, color }) => (
  <div className="flex flex-col gap-1 sm:gap-1.5">
    <div className="flex justify-between text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/20 px-0.5"><span>{label}</span><span style={{ color }}>{value.toFixed(2)}{unit}</span></div>
    <input type="range" min={min} max={max} step="0.001" value={value} onChange={e => onChange(parseFloat(e.target.value))} className="w-full cursor-pointer" style={{ accentColor: color } as any} />
  </div>
);

const ADSRVertical: React.FC<{ label: string; value: number; max: number; onChange: (v: number) => void; color: string }> = ({ label, value, max, onChange, color }) => (
  <div className="flex flex-col items-center justify-between h-full group">
    <div className="h-full w-1.5 bg-white/5 rounded-full relative overflow-hidden transition-colors group-hover:bg-white/10">
       <div className="absolute bottom-0 left-0 w-full transition-all duration-150" style={{ height: `${(value/max)*100}%`, backgroundColor: color }} />
       <input type="range" min="0" max={max} step="0.01" value={value} onChange={e => onChange(parseFloat(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 [writing-mode:bt-lr] cursor-pointer" />
    </div>
    <span className="text-[7px] font-black text-white/20 mt-2 transition-colors group-hover:text-white/60">{label}</span>
  </div>
);

export default App;
