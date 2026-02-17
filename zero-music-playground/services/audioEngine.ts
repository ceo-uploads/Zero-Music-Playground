
import { MixerSettings, SectorSettings, ActiveVoice, KitType, RowIndex, CompressorSettings } from '../types';
import { KIT_SAMPLES } from '../constants';

class SectorPath {
  public input: GainNode;
  public eqLow: BiquadFilterNode;
  public eqMid: BiquadFilterNode;
  public eqHigh: BiquadFilterNode;
  public subBooster: BiquadFilterNode; 
  public distortion: WaveShaperNode;    
  
  // Chorus
  public chorusDelay: DelayNode;
  public chorusGain: GainNode;
  public chorusOsc: OscillatorNode;
  private chorusDepthNode: GainNode;
  
  // Phaser
  private phaserFilters: BiquadFilterNode[] = [];
  private phaserLFO: OscillatorNode;
  private phaserLFOGain: GainNode;
  private phaserGain: GainNode;
  private phaserDry: GainNode;

  // Flanger
  private flangerDelay: DelayNode;
  private flangerFeedback: GainNode;
  private flangerLFO: OscillatorNode;
  private flangerLFOGain: GainNode;
  private flangerGain: GainNode;

  public filter: BiquadFilterNode;
  public pulseGate: GainNode;
  public panner: StereoPannerNode;
  public reverbSend: GainNode;
  public analyzer: AnalyserNode;
  public output: GainNode;

  constructor(private ctx: AudioContext) {
    this.input = ctx.createGain();
    
    this.eqLow = ctx.createBiquadFilter();
    this.eqLow.type = 'lowshelf';
    this.eqLow.frequency.value = 250;

    this.eqMid = ctx.createBiquadFilter();
    this.eqMid.type = 'peaking';
    this.eqMid.frequency.value = 1200;
    this.eqMid.Q.value = 1.0;

    this.eqHigh = ctx.createBiquadFilter();
    this.eqHigh.type = 'highshelf';
    this.eqHigh.frequency.value = 5000;

    this.subBooster = ctx.createBiquadFilter();
    this.subBooster.type = 'peaking';
    this.subBooster.frequency.value = 60; 
    this.subBooster.Q.value = 2.0;
    this.subBooster.gain.value = 0;

    this.distortion = ctx.createWaveShaper();
    this.distortion.curve = this.makeDistortionCurve(0);
    this.distortion.oversample = '4x';

    // Chorus
    this.chorusDelay = ctx.createDelay();
    this.chorusDelay.delayTime.value = 0.025;
    this.chorusGain = ctx.createGain();
    this.chorusGain.gain.value = 0;
    this.chorusOsc = ctx.createOscillator();
    this.chorusOsc.type = 'sine';
    this.chorusOsc.frequency.value = 0.5;
    this.chorusDepthNode = ctx.createGain();
    this.chorusDepthNode.gain.value = 0.002;
    this.chorusOsc.connect(this.chorusDepthNode);
    this.chorusDepthNode.connect(this.chorusDelay.delayTime);
    this.chorusOsc.start();

    // Phaser
    this.phaserDry = ctx.createGain();
    this.phaserGain = ctx.createGain();
    this.phaserGain.gain.value = 0;
    this.phaserLFO = ctx.createOscillator();
    this.phaserLFO.frequency.value = 0.4;
    this.phaserLFOGain = ctx.createGain();
    this.phaserLFOGain.gain.value = 400; 
    this.phaserLFO.connect(this.phaserLFOGain);
    this.phaserLFO.start();

    for (let i = 0; i < 4; i++) {
      const f = ctx.createBiquadFilter();
      f.type = 'allpass';
      f.frequency.value = 1000;
      this.phaserLFOGain.connect(f.frequency);
      if (i > 0) this.phaserFilters[i-1].connect(f);
      this.phaserFilters.push(f);
    }

    // Flanger
    this.flangerDelay = ctx.createDelay();
    this.flangerDelay.delayTime.value = 0.003;
    this.flangerFeedback = ctx.createGain();
    this.flangerFeedback.gain.value = 0.5;
    this.flangerGain = ctx.createGain();
    this.flangerGain.gain.value = 0;
    this.flangerLFO = ctx.createOscillator();
    this.flangerLFO.frequency.value = 0.15;
    this.flangerLFOGain = ctx.createGain();
    this.flangerLFOGain.gain.value = 0.002;
    this.flangerLFO.connect(this.flangerLFOGain);
    this.flangerLFOGain.connect(this.flangerDelay.delayTime);
    this.flangerLFO.start();

    this.flangerDelay.connect(this.flangerFeedback);
    this.flangerFeedback.connect(this.flangerDelay);

    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 20000;

    this.pulseGate = ctx.createGain();
    this.panner = ctx.createStereoPanner();
    this.reverbSend = ctx.createGain();
    this.analyzer = ctx.createAnalyser();
    this.analyzer.fftSize = 512;
    this.output = ctx.createGain();

    // Signal Path
    this.input.connect(this.eqLow);
    this.eqLow.connect(this.eqMid);
    this.eqMid.connect(this.eqHigh);
    this.eqHigh.connect(this.subBooster);
    this.subBooster.connect(this.distortion);
    
    // Parallel Chorus
    this.subBooster.connect(this.chorusDelay);
    this.chorusDelay.connect(this.chorusGain);
    this.chorusGain.connect(this.distortion);

    // Phaser stage
    this.distortion.connect(this.phaserDry);
    this.distortion.connect(this.phaserFilters[0]);
    this.phaserFilters[3].connect(this.phaserGain);

    // Mix Phaser Output
    const phaserOut = ctx.createGain();
    this.phaserDry.connect(phaserOut);
    this.phaserGain.connect(phaserOut);

    // Flanger stage
    phaserOut.connect(this.flangerDelay);
    this.flangerDelay.connect(this.flangerGain);
    
    // Final Mix Flanger
    const finalBus = ctx.createGain();
    phaserOut.connect(finalBus);
    this.flangerGain.connect(finalBus);

    finalBus.connect(this.filter);
    this.filter.connect(this.pulseGate);
    this.pulseGate.connect(this.panner);
    this.panner.connect(this.analyzer);
    this.panner.connect(this.output);
    this.panner.connect(this.reverbSend);
  }

  private makeDistortionCurve(amount: number) {
    const k = amount * 100;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  update(settings: SectorSettings, bpm: number) {
    const now = this.ctx.currentTime;
    this.output.gain.setTargetAtTime(settings.mute ? 0 : settings.gain, now, 0.05);
    this.eqLow.gain.setTargetAtTime(settings.low, now, 0.05);
    this.eqMid.gain.setTargetAtTime(settings.mid, now, 0.05);
    this.eqMid.Q.setTargetAtTime(settings.qFactor, now, 0.05);
    this.eqHigh.gain.setTargetAtTime(settings.high, now, 0.05);
    this.subBooster.gain.setTargetAtTime(settings.subBoost || 0, now, 0.05);
    
    // Update Chorus
    this.chorusGain.gain.setTargetAtTime(settings.chorus || 0, now, 0.05);
    this.chorusOsc.frequency.setTargetAtTime(settings.chorusRate || 0.5, now, 0.05);
    this.chorusDepthNode.gain.setTargetAtTime(settings.chorusDepth || 0.002, now, 0.05);
    
    // Update Phaser
    this.phaserGain.gain.setTargetAtTime(settings.phaser || 0, now, 0.05);
    this.phaserLFO.frequency.setTargetAtTime(settings.phaserRate || 0.4, now, 0.05);
    this.phaserFilters.forEach(f => f.Q.setTargetAtTime(settings.phaserFeedback * 10 || 1, now, 0.05));
    
    // Update Flanger
    this.flangerGain.gain.setTargetAtTime(settings.flanger || 0, now, 0.05);
    this.flangerLFO.frequency.setTargetAtTime(settings.flangerRate || 0.15, now, 0.05);
    this.flangerFeedback.gain.setTargetAtTime(settings.flangerFeedback || 0.5, now, 0.05);
    
    if (settings.distortion !== undefined) {
      this.distortion.curve = this.makeDistortionCurve(settings.distortion);
    }

    this.panner.pan.setTargetAtTime(settings.pan, now, 0.05);
    this.reverbSend.gain.setTargetAtTime(settings.reverb, now, 0.05);

    if (settings.filter !== undefined) {
      if (settings.filter < 0) {
        this.filter.type = 'lowpass';
        const freq = Math.max(15, 20000 * Math.pow(10, settings.filter / 40));
        this.filter.frequency.setTargetAtTime(freq, now, 0.03);
      } else if (settings.filter > 0) {
        this.filter.type = 'highpass';
        const freq = 10 * Math.pow(10, (settings.filter / 100) * 3.4);
        this.filter.frequency.setTargetAtTime(freq, now, 0.03);
      } else {
        this.filter.type = 'lowpass';
        this.filter.frequency.setTargetAtTime(20000, now, 0.03);
      }
    }

    if (settings.pulseMode) {
      const beatDuration = 60 / bpm;
      const pulseSpeed = beatDuration / 4; 
      this.pulseGate.gain.cancelScheduledValues(now);
      for (let i = 0; i < 32; i++) {
        const t = now + i * pulseSpeed;
        this.pulseGate.gain.setValueAtTime(1, t);
        this.pulseGate.gain.setTargetAtTime(0, t + pulseSpeed * 0.45, 0.01);
      }
    } else {
      this.pulseGate.gain.setTargetAtTime(1, now, 0.05);
    }
  }
}

class AudioEngine {
  public ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private mainComp: DynamicsCompressorNode | null = null;
  public mainAnalyzer: AnalyserNode | null = null;
  public analyzerL: AnalyserNode | null = null;
  public analyzerR: AnalyserNode | null = null;
  public dest: MediaStreamAudioDestinationNode | null = null;
  private reverb: ConvolverNode | null = null;
  private sectors: Map<RowIndex, SectorPath> = new Map();
  private buffers: Map<string, AudioBuffer> = new Map();
  private activeVoices: Map<string, ActiveVoice> = new Map();
  private settings: MixerSettings | null = null;
  private metronomeInterval: number | null = null;
  public onBeat: ((beat: number) => void) | null = null;
  private currentBeat: number = 0;

  async init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
    this.mainComp = this.ctx.createDynamicsCompressor();
    this.masterGain = this.ctx.createGain();
    this.mainAnalyzer = this.ctx.createAnalyser();
    this.analyzerL = this.ctx.createAnalyser();
    this.analyzerR = this.ctx.createAnalyser();
    const splitter = this.ctx.createChannelSplitter(2);
    this.reverb = this.ctx.createConvolver();
    this.applyAlgorithmicReverb('hall');

    this.mainComp.connect(this.masterGain);
    this.masterGain.connect(this.mainAnalyzer);
    this.masterGain.connect(splitter);
    splitter.connect(this.analyzerL, 0);
    splitter.connect(this.analyzerR, 1);
    this.masterGain.connect(this.ctx.destination);
    
    this.dest = this.ctx.createMediaStreamDestination();
    this.masterGain.connect(this.dest);

    ([0, 1, 2, 3] as RowIndex[]).forEach(idx => {
      const path = new SectorPath(this.ctx!);
      path.output.connect(this.mainComp!);
      path.reverbSend.connect(this.reverb!);
      this.sectors.set(idx, path);
    });

    this.reverb.connect(this.mainComp);
    await this.loadAllBuffers();
  }

  /**
   * Generates a distortion curve for the WaveShaperNode.
   * This is used by the playTrigger method for kick drum punch effects.
   */
  private makeDistortionCurve(amount: number) {
    const k = amount * 100;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  public applyAlgorithmicReverb(type: 'room' | 'hall' | 'plate') {
    if (!this.ctx || !this.reverb) return;
    const sampleRate = this.ctx.sampleRate;
    let length, decay;
    
    switch(type) {
      case 'room': length = 0.8 * sampleRate; decay = 3; break;
      case 'plate': length = 1.5 * sampleRate; decay = 8; break;
      case 'hall': default: length = 3.5 * sampleRate; decay = 5; break;
    }

    const ir = this.ctx.createBuffer(2, length, sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    this.reverb.buffer = ir;
  }

  public async setReverbFromFile(file: File) {
    if (!this.ctx || !this.reverb) return;
    const arrayBuffer = await file.arrayBuffer();
    try {
      const buffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.reverb.buffer = buffer;
    } catch (e) {
      console.error('Failed to decode IR file:', e);
    }
  }

  async loadAllBuffers() {
    if (!this.ctx) return;
    const urls = new Set<string>();
    Object.values(KIT_SAMPLES).forEach(list => list.forEach(u => u && u.length > 0 && urls.add(u)));
    await Promise.all(Array.from(urls).map(async url => {
      try {
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arrayBuffer = await res.arrayBuffer();
        const buf = await this.ctx!.decodeAudioData(arrayBuffer);
        this.buffers.set(url, buf);
      } catch (e) {
        console.warn(`Buffer loading failed for ${url}:`, e);
      }
    }));
  }

  updateMixer(settings: MixerSettings) {
    this.settings = settings;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.masterGain?.gain.setTargetAtTime(settings.masterGain, now, 0.05);
    
    if (this.mainComp) {
      this.mainComp.threshold.setTargetAtTime(settings.masterCompressor.threshold, now, 0.05);
      this.mainComp.ratio.setTargetAtTime(settings.masterCompressor.ratio, now, 0.05);
      this.mainComp.attack.setTargetAtTime(settings.masterCompressor.attack, now, 0.05);
      this.mainComp.release.setTargetAtTime(settings.masterCompressor.release, now, 0.05);
    }

    const soloedIndices = ([0, 1, 2, 3] as RowIndex[]).filter(idx => settings.sectors[idx].solo);
    const hasSolo = soloedIndices.length > 0;

    ([0, 1, 2, 3] as RowIndex[]).forEach(idx => {
      const sectorPath = this.sectors.get(idx);
      if (sectorPath) {
        const sectorSettings = settings.sectors[idx];
        const isMuted = hasSolo ? !sectorSettings.solo : !!sectorSettings.mute;
        sectorPath.update({ ...sectorSettings, mute: isMuted }, settings.bpm);
      }
    });

    this.handleMetronome(settings);
  }

  private handleMetronome(settings: MixerSettings) {
    if (settings.metronomeOn) {
      if (this.metronomeInterval) clearInterval(this.metronomeInterval);
      const intervalMs = (60 / settings.bpm) * 1000;
      this.metronomeInterval = window.setInterval(() => {
        this.currentBeat = (this.currentBeat + 1) % 4;
        if (this.onBeat) this.onBeat(this.currentBeat);
        this.playMetronomeClick(this.currentBeat === 0);
      }, intervalMs);
    } else {
      if (this.metronomeInterval) {
        clearInterval(this.metronomeInterval);
        this.metronomeInterval = null;
      }
    }
  }

  private playMetronomeClick(isDownbeat: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isDownbeat ? 1600 : 800, now);
    osc.frequency.exponentialRampToValueAtTime(10, now + 0.03);
    g.gain.setValueAtTime(0.1, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  getAnalyzer(idx: RowIndex) { return this.sectors.get(idx)?.analyzer || null; }

  playTrigger(id: string, name: string, rowIdx: RowIndex, freq: number, drumIndex?: number) {
    if (!this.ctx || !this.settings || this.activeVoices.has(id)) return;
    const now = this.ctx.currentTime;
    const path = this.sectors.get(rowIdx)!;
    const cfg = this.settings.sectors[rowIdx];
    const adsr = cfg.adsr;
    const pitchShift = Math.pow(2, cfg.pitch / 12);

    const voiceGain = this.ctx.createGain();
    voiceGain.connect(path.input);
    voiceGain.gain.setValueAtTime(0, now);
    voiceGain.gain.linearRampToValueAtTime(1, now + adsr.attack);
    voiceGain.gain.linearRampToValueAtTime(adsr.sustain, now + adsr.attack + adsr.decay);

    const nodes: AudioNode[] = [];
    const kit = cfg.kit;

    const samples = KIT_SAMPLES[kit];
    const targetUrl = samples && (drumIndex !== undefined ? samples[drumIndex] : samples[0]);
    const hasBuffer = targetUrl && this.buffers.has(targetUrl);

    const sampledKits = [
      'TRAP_DRUMS', 'GRAND_PIANO', 'BASS_GUITAR', 'SYNTH_LEAD', 'STRINGS', 
      'TECHNO_DRUMS', 'LOFI_DRUMS', 'FLAMENCO_GUITAR', 'ELECTRIC_PIANO', 
      'HARP', 'CHURCH_ORGAN', 'SNARE_COLLECTION', 'TRAP_SNARES', 'HOUSE_SNARES',
      'EDM_LEAD', 'HYPER_SAW', 'SYNTH_BASS', 'DEEP_SUB', 'SUB_BASS'
    ];
    const isSampled = sampledKits.includes(kit);

    if (isSampled && hasBuffer) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.buffers.get(targetUrl!)!;
      let baseFreq = 261.63; 
      if (kit === 'STRINGS' || kit === 'HARP' || kit === 'CHURCH_ORGAN') baseFreq = 440; 
      if (kit === 'BASS_GUITAR' || kit === 'SYNTH_LEAD' || kit === 'ELECTRIC_PIANO' || kit === 'FLAMENCO_GUITAR' || kit === 'SYNTH_BASS' || kit === 'DEEP_SUB') baseFreq = 110; 
      
      const isPerc = kit.includes('DRUMS') || kit.includes('SNARE');
      src.playbackRate.value = isPerc ? pitchShift : (freq / baseFreq) * pitchShift;
      src.connect(voiceGain);
      src.start();
      nodes.push(src);

      // Enhanced Kick Punch
      if (drumIndex === 0 && cfg.kickPunch > 0) {
        const punchOsc = this.ctx.createOscillator();
        const punchGain = this.ctx.createGain();
        const punchDist = this.ctx.createWaveShaper();
        
        punchDist.curve = this.makeDistortionCurve(0.2); 
        punchOsc.type = 'sine';
        punchOsc.frequency.setValueAtTime(140, now);
        punchOsc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        
        punchGain.gain.setValueAtTime(cfg.kickPunch * 1.0, now);
        punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        punchOsc.connect(punchDist);
        punchDist.connect(punchGain);
        punchGain.connect(voiceGain);
        punchOsc.start(now);
        punchOsc.stop(now + 0.25);
        nodes.push(punchOsc, punchDist, punchGain);
      }
    } else {
      const osc = this.ctx.createOscillator();
      const targetFreq = (['SUB_BASS', 'SYNTH_BASS', 'DEEP_SUB'].includes(kit)) ? freq * 0.5 : freq;
      
      switch(kit) {
        case 'HYPER_SAW':
          osc.type = 'sawtooth';
          const o2 = this.ctx.createOscillator();
          o2.type = 'sawtooth'; o2.frequency.setValueAtTime(targetFreq * pitchShift * 1.015, now);
          o2.connect(voiceGain); o2.start(); nodes.push(o2);
          const o3 = this.ctx.createOscillator();
          o3.type = 'sawtooth'; o3.frequency.setValueAtTime(targetFreq * pitchShift * 0.985, now);
          o3.connect(voiceGain); o3.start(); nodes.push(o3);
          osc.connect(voiceGain);
          break;
        case 'EDM_LEAD':
          osc.type = 'square';
          const o4 = this.ctx.createOscillator();
          o4.type = 'sawtooth'; o4.frequency.setValueAtTime(targetFreq * pitchShift * 1.002, now);
          o4.connect(voiceGain); o4.start(); nodes.push(o4);
          osc.connect(voiceGain);
          break;
        case 'SYNTH_BASS':
          osc.type = 'square';
          const lpf = this.ctx.createBiquadFilter();
          lpf.type = 'lowpass'; lpf.frequency.setValueAtTime(800, now);
          osc.connect(lpf); lpf.connect(voiceGain);
          break;
        default:
          osc.type = (['SUB_BASS', 'DEEP_SUB', 'SINE_SYNTH'].includes(kit)) ? 'sine' : 'triangle';
          osc.connect(voiceGain);
      }

      osc.frequency.setValueAtTime(targetFreq * pitchShift, now);
      osc.start();
      nodes.push(osc);
    }

    this.activeVoices.set(id, { nodes, gainNode: voiceGain, startTime: now });
  }

  stopVoice(id: string, rowIdx: RowIndex) {
    const voice = this.activeVoices.get(id);
    if (!voice || !this.ctx || !this.settings) return;
    const now = this.ctx.currentTime;
    const release = this.settings.sectors[rowIdx].adsr.release;
    
    voice.gainNode.gain.cancelScheduledValues(now);
    voice.gainNode.gain.setValueAtTime(voice.gainNode.gain.value, now);
    voice.gainNode.gain.exponentialRampToValueAtTime(0.001, now + release);
    
    this.activeVoices.delete(id);
    setTimeout(() => {
      voice.nodes.forEach(n => { 
        try { (n as any).stop(); } catch(e) {} 
        n.disconnect(); 
      });
      voice.gainNode.disconnect();
    }, release * 1000 + 100);
  }
}

export const audioEngine = new AudioEngine();
