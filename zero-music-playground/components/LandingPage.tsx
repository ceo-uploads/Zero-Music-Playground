
import React, { useEffect, useState } from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['nexus', 'circuit', 'keyboard', 'spectral', 'compatibility', 'archive'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top < window.innerHeight / 2) {
          setActiveStep(i);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#010208] overflow-x-hidden font-sans text-slate-100 selection:bg-cyan-500/30">
      {/* Dynamic Atmospheric Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full hero-gradient" />
        <div className="absolute top-[10%] right-[-5%] w-[110vw] h-[110vw] bg-fuchsia-600/[0.04] blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[100vw] h-[100vw] bg-cyan-600/[0.05] blur-[180px] rounded-full animate-pulse delay-1000" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#fff 0.8px, transparent 0.8px)', backgroundSize: '80px 80px' }} />
        
        {/* Particle Matrix */}
        <div className="absolute inset-0 overflow-hidden">
           {[...Array(30)].map((_, i) => (
             <div 
               key={i}
               className="absolute bg-white/10 w-[1.5px] h-[1.5px] rounded-full"
               style={{ 
                 top: `${Math.random() * 100}%`, 
                 left: `${Math.random() * 100}%`,
                 animation: `float ${12 + Math.random() * 25}s linear infinite`,
                 opacity: Math.random()
               }}
             />
           ))}
        </div>
      </div>

      {/* High-Fidelity Responsive Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-1000 ${scrolled ? 'py-4 bg-[#010208]/98 backdrop-blur-3xl border-b border-white/5 shadow-2xl' : 'py-10 sm:py-24 bg-transparent'}`}>
        <div className="max-w-[1920px] mx-auto px-6 sm:px-16 lg:px-32 flex justify-between items-center">
          <div className="flex items-center gap-6 sm:gap-12 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 sm:w-20 sm:h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center font-black italic text-xl sm:text-4xl group-hover:border-cyan-500 group-hover:shadow-[0_0_50px_rgba(0,243,255,0.4)] transition-all">Z</div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[16px] font-black uppercase tracking-[1em] text-white">Zero Music</span>
              <span className="text-[8px] sm:text-[11px] font-bold uppercase tracking-[0.4em] text-white/20 hidden xs:block">Unreal Laboratory v6.9.1</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 lg:gap-24">
            <div className="hidden 2xl:flex items-center gap-16">
              {['Nexus', 'Circuit', 'Hardware', 'Acoustics', 'Archive'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-[0.6em] text-white/40 hover:text-cyan-400 transition-all relative group">
                  {item}
                  <span className="absolute -bottom-3 left-0 w-0 h-[1.5px] bg-cyan-400 transition-all group-hover:w-full shadow-[0_0_10px_#00f3ff]" />
                </a>
              ))}
            </div>
            <button 
              onClick={onEnter}
              className="px-8 sm:px-20 py-4 sm:py-7 bg-white text-[#010208] rounded-2xl text-[10px] sm:text-[13px] font-black uppercase tracking-[0.7em] hover:bg-cyan-400 transition-all shadow-3xl hover:scale-105 active:scale-95"
            >
              Start Engine
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO: THE PRESTIGE MONOLITH */}
        <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-32 text-center px-6 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.3] pointer-events-none scale-90 sm:scale-125 lg:scale-150 xl:scale-[2.2]">
            <IllustrationEngineCore />
          </div>

          <div className="space-y-12 sm:space-y-20 max-w-9xl z-10">
            <div className="inline-flex items-center gap-6 px-10 py-4 bg-white/5 border border-white/10 rounded-full animate-in fade-in slide-in-from-bottom-6 duration-1000 backdrop-blur-2xl">
               <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_25px_#22d3ee]" />
               <span className="text-[11px] sm:text-[14px] font-black uppercase tracking-[0.8em] text-white/90 leading-none">A Product Of Unreal Studio</span>
            </div>

            <h1 className="text-[7rem] xs:text-[10rem] sm:text-[18rem] md:text-[24rem] lg:text-[32rem] font-black italic tracking-tighter leading-none text-white select-none drop-shadow-[0_0_200px_rgba(255,255,255,0.25)]">
              ZERO<span className="text-cyan-400">.</span>
            </h1>

            <p className="text-sm sm:text-3xl md:text-5xl lg:text-6xl font-light text-white/30 uppercase tracking-[0.6em] sm:tracking-[1.2em] leading-tight max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              The Global Standard In <span className="text-white font-bold">Matrix Synthesis</span> Architecture
            </p>
          </div>

          <div className="mt-24 sm:mt-48 z-10 flex flex-col items-center gap-16 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
            <button 
              onClick={onEnter}
              className="group relative px-20 sm:px-48 py-14 sm:py-20 bg-white text-[#010208] rounded-[3rem] font-black uppercase tracking-[1em] sm:tracking-[1.8em] text-xl sm:text-5xl overflow-hidden shadow-[0_80px_160px_rgba(0,0,0,0.7)] hover:scale-[1.03] active:scale-95 transition-all"
            >
              <span className="relative z-10">Ignite ZERO</span>
              <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            </button>
            
            <div className="flex flex-col items-center gap-8">
               <div className="flex items-center gap-8 text-[11px] sm:text-[14px] font-black uppercase tracking-[0.8em] text-white/20">
                 <span className="text-cyan-500/80 font-bold border-r border-white/10 pr-8">Cluster Logic</span>
                 <span>Keyboard Mapping Required</span>
               </div>
            </div>
          </div>
        </section>

        {/* SECTION: HARDWARE MAPPING (ULTRA FIDELITY) */}
        <section id="keyboard" className="max-w-[1920px] mx-auto px-6 sm:px-16 lg:px-32 py-40 sm:py-96 border-y border-white/5 bg-white/[0.01] relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <IllustrationBlueprintGrid size={180} />
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 sm:gap-60 items-center relative z-10">
              <div className="space-y-20 sm:space-y-32">
                 <SectionHeader index="00" label="Interface Protocol" title="Peripheral Matrix." />
                 <p className="text-3xl sm:text-5xl font-light text-white/40 leading-relaxed uppercase tracking-[0.1em] sm:tracking-widest">
                    Zero maps every cluster node to your physical <span className="text-white font-bold">QWERTY Performance Core</span>. Low-latency polling ensures 1:1 hardware response.
                 </p>
                 <div className="grid grid-cols-1 gap-16">
                    <div className="p-12 sm:p-20 bg-white/[0.03] border border-white/10 rounded-[5rem] space-y-16 backdrop-blur-3xl shadow-4xl group">
                       <h4 className="text-xl sm:text-3xl font-black uppercase tracking-[0.6em] text-cyan-400 border-b border-white/10 pb-12 group-hover:text-white transition-colors">Node-Mapping Schematic</h4>
                       <div className="space-y-12">
                          <MappingRow label="Row 01 (1-0)" target="Lead Node 01" color="#00f3ff" />
                          <MappingRow label="Row 02 (Q-P)" target="Lead Node 02" color="#ff00ff" />
                          <MappingRow label="Row 03 (A-L)" target="Bass Node 03" color="#39ff14" />
                          <MappingRow label="Row 04 (Z-M)" target="Percussion Node 04" color="#ffff00" />
                       </div>
                    </div>
                 </div>
              </div>
              <div className="relative group p-10 transform scale-110">
                 <div className="absolute inset-0 bg-cyan-500/15 blur-[180px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                 <IllustrationKeyboardMapping />
              </div>
           </div>
        </section>

        {/* SECTION: CIRCUIT DYNAMICS (ULTRA FIDELITY) */}
        <section id="circuit" className="max-w-[1920px] mx-auto px-6 sm:px-16 lg:px-32 py-40 sm:py-96">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 sm:gap-60 items-center">
              <div className="order-2 lg:order-1 relative p-16 bg-black border border-white/10 rounded-[7rem] shadow-5xl group overflow-hidden">
                 <div className="absolute inset-0 bg-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <IllustrationCircuitDiagram />
              </div>
              <div className="order-1 lg:order-2 space-y-20 sm:space-y-32">
                 <SectionHeader index="01" label="DSP Core Architecture" title="Signal Protocol." />
                 <p className="text-3xl sm:text-5xl font-light text-white/40 leading-relaxed uppercase tracking-widest">
                    A multi-stage <span className="text-white font-bold">Signal Logic Chain</span> modeled after premium analog signal paths. Zero-latency processing nodes with floating-point precision.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-20">
                    <IllustrationInfo title="Vector Synthesis" desc="High-speed audio threading for parallel node clustering." />
                    <IllustrationInfo title="Logarithmic ADSR" desc="Precision envelope modeling for explosive transient response." />
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION: SPECTRAL DYNAMICS (ACCOUSTICS) */}
        <section id="spectral" className="bg-white/[0.01] border-y border-white/5 py-40 sm:py-96 overflow-hidden relative">
           <div className="max-w-[1920px] mx-auto px-6 sm:px-16 lg:px-32 space-y-48 relative">
              <div className="text-center space-y-16">
                 <SectionHeader index="02" label="Acoustic Engineering" title="Spectral Heatmap." centered />
                 <p className="max-w-6xl mx-auto text-2xl sm:text-4xl font-light text-white/30 uppercase tracking-[0.8em]">
                    Real-time visualization of harmonic density during active synthesis.
                 </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
                 <div className="lg:col-span-4 space-y-20 sm:space-y-32">
                    <CircuitCard title="Harmonic Sync" index="1" desc="Phase-alignment across all active cluster nodes." />
                    <CircuitCard title="LFO Matrix" index="2" desc="Hyper-modulated rhythmic textures and spatial sweeps." />
                 </div>
                 <div className="lg:col-span-8 p-16 sm:p-24 bg-[#010208] border border-white/10 rounded-[6rem] shadow-4xl relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1.5px] bg-cyan-400 opacity-40 shadow-[0_0_30px_#00f3ff]" />
                    <IllustrationSpectralDynamics />
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* FOOTER: THE PRESTIGE UNREAL STUDIO EXPERIENCE */}
      <footer className="relative pt-[400px] sm:pt-[700px] pb-24 sm:pb-40 px-6 sm:px-16 lg:px-32 overflow-hidden border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[450vw] h-[1800px] bg-gradient-to-b from-white/[0.05] to-transparent rounded-[100%] z-0" />
        
        <div className="relative z-10 max-w-[1920px] mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center gap-16 sm:gap-24 mb-40 sm:mb-80 text-center group cursor-default">
             <span className="text-[12px] sm:text-[16px] font-black uppercase tracking-[4em] text-white/10 group-hover:text-cyan-400 transition-all duration-2000">A PRODUCT OF UNREAL STUDIO</span>
             <h2 className="text-8xl xs:text-10xl sm:text-[20rem] lg:text-[28rem] xl:text-[34rem] font-black italic tracking-tighter text-white leading-none">
                ZERO<span className="text-cyan-400">.</span>
              </h2>
             <p className="text-[11px] sm:text-xl font-bold uppercase tracking-[1.5em] sm:tracking-[2em] text-white/20">The New Global Standard In Matrix Synthesis Architecture</p>
          </div>

          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-20 sm:gap-40 py-32 sm:py-60 border-y border-white/5 mb-32 sm:mb-60">
             <FooterCol title="Logic" links={['Zero Synth', 'Nexus Matrix', 'Cluster v6', 'Vector Eng']} />
             <FooterCol title="Engineering" links={['DSP Protocols', 'WAV Logic', 'Buffer Sync', 'Matrix v7']} />
             <FooterCol title="Resource" links={['System Guide', 'Node Map', 'Keyboard Fix', 'Archive UI']} />
             <FooterCol title="Company" links={['Laboratory', 'Prestige Info', 'Sync Protocol', 'Security']} />
          </div>

          <div className="flex flex-col md:flex-row justify-between w-full items-center gap-20">
             <div className="flex flex-col items-center md:items-start gap-4">
                <span className="text-[11px] sm:text-[15px] font-black uppercase tracking-[0.8em] text-white/10 italic">UNREAL STUDIO • PERFORMANCE CLUSTER ZERO</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/5">Global Deployment Protocol v6.9.1.84</span>
             </div>
             <div className="flex gap-16 sm:gap-32">
                {['TWITTER', 'DISCORD', 'SOUNDCLOUD', 'GITHUB'].map(link => (
                  <a key={link} href="#" className="text-[11px] sm:text-[14px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white transition-all hover:scale-110">{link}</a>
                ))}
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes dash { to { stroke-dashoffset: 0; } }
        .animate-dash { stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: dash 10s linear infinite; }
        @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-rotate-slow { animation: rotate-slow 80s linear infinite; }
        .hero-gradient { background: radial-gradient(circle at 50% -25%, rgba(0, 243, 255, 0.2) 0%, transparent 75%); }
        @keyframes float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-40px) scale(1.03); } }
        .animate-float { animation: float 12s ease-in-out infinite; }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }
        .animate-pulse-ring { animation: pulse-ring 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
      `}</style>
    </div>
  );
};

/* --- PRESTIGE UI COMPONENTS --- */

const SectionHeader: React.FC<{ index: string; label: string; title: string; centered?: boolean }> = ({ index, label, title, centered }) => (
  <div className={`space-y-12 sm:space-y-16 ${centered ? 'flex flex-col items-center text-center' : ''}`}>
     <div className={`flex items-center gap-10 ${centered ? 'justify-center' : ''}`}>
        <span className="text-2xl sm:text-4xl font-black italic text-cyan-400/30">{index}</span>
        <div className="h-[1.5px] w-24 sm:w-48 bg-white/10" />
        <span className="text-[12px] sm:text-lg font-black uppercase tracking-[1.2em] text-cyan-400">{label}</span>
     </div>
     <h2 className="text-6xl xs:text-8xl sm:text-[12rem] lg:text-[15rem] font-black italic tracking-tighter text-white uppercase leading-tight drop-shadow-2xl">{title}</h2>
  </div>
);

const MappingRow: React.FC<{ label: string; target: string; color: string }> = ({ label, target, color }) => (
  <div className="flex justify-between items-center group/row py-3">
     <span className="text-[12px] sm:text-lg font-black uppercase tracking-[0.2em] text-white/30 group-hover/row:text-white transition-all duration-500">{label}</span>
     <div className="flex items-center gap-10">
        <div className="h-[1.5px] w-20 bg-white/5 group-hover/row:bg-white/40 transition-all group-hover/row:w-32" />
        <span className="text-[12px] sm:text-lg font-black uppercase tracking-[0.4em] shadow-inner" style={{ color }}>{target}</span>
     </div>
  </div>
);

const CircuitCard: React.FC<{ title: string; index: string; desc: string }> = ({ title, index, desc }) => (
  <div className="flex flex-col gap-10 group cursor-default">
     <div className="flex items-center gap-8">
        <span className="text-2xl sm:text-4xl font-black italic text-cyan-400/30 group-hover:text-cyan-400 transition-colors duration-500">{index}</span>
        <h4 className="text-xl sm:text-4xl font-black uppercase tracking-widest text-white group-hover:translate-x-4 transition-transform duration-500">{title}</h4>
     </div>
     <p className="text-[12px] sm:text-lg font-bold uppercase tracking-widest text-white/20 leading-relaxed group-hover:text-white/60 transition-colors duration-500">{desc}</p>
  </div>
);

const TechnicalDetail: React.FC<{ label: string; val: string; sub: string }> = ({ label, val, sub }) => (
  <div className="flex flex-col items-start gap-4">
    <span className="text-[11px] font-black uppercase tracking-[0.8em] text-white/30 mb-4">{label}</span>
    <span className="text-5xl sm:text-9xl font-black italic text-white/80 leading-none">{val}</span>
    <span className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.4em] text-white/10">{sub}</span>
  </div>
);

const IllustrationInfo: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="p-12 sm:p-20 bg-white/[0.01] border border-white/10 rounded-[4rem] hover:bg-white/[0.05] transition-all group hover:border-cyan-400/40 shadow-4xl backdrop-blur-3xl">
     <h4 className="text-sm sm:text-2xl font-black uppercase tracking-[0.6em] text-white mb-8 group-hover:text-cyan-400 transition-all duration-500">{title}</h4>
     <p className="text-[12px] sm:text-lg font-bold uppercase tracking-widest text-white/20 leading-relaxed group-hover:text-white/40 transition-all duration-500">{desc}</p>
  </div>
);

const FooterCol: React.FC<{ title: string; links: string[] }> = ({ title, links }) => (
  <div className="space-y-16 sm:space-y-24">
     <h5 className="text-[12px] sm:text-xl font-black uppercase tracking-[1.2em] text-white/40">{title}</h5>
     <ul className="space-y-8 sm:space-y-12">
        {links.map(link => (
          <li key={link}>
            <a href="#" className="text-[12px] sm:text-xl font-bold uppercase tracking-[0.6em] text-white/10 hover:text-cyan-400 transition-all flex items-center gap-5 group">
              <span className="w-0 h-[2px] bg-cyan-400 transition-all group-hover:w-8 shadow-[0_0_10px_#00f3ff]" />
              {link}
            </a>
          </li>
        ))}
     </ul>
  </div>
);

/* --- ULTRA HIGH-DEFINITION SVGS --- */

const IllustrationEngineCore = () => (
  <svg viewBox="0 0 1000 1000" className="w-[1000px] h-[1000px] animate-rotate-slow">
    <defs>
      <filter id="monolithGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="40" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="cyan" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    <circle cx="500" cy="500" r="490" fill="none" stroke="white" strokeWidth="0.1" strokeDasharray="1 50" opacity="0.1" />
    <circle cx="500" cy="500" r="420" fill="none" stroke="cyan" strokeWidth="0.8" strokeDasharray="200 60" opacity="0.1" />
    <circle cx="500" cy="500" r="350" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="5 30" opacity="0.2" className="animate-pulse" />
    <circle cx="500" cy="500" r="250" fill="none" stroke="fuchsia" strokeWidth="0.5" strokeDasharray="20 20" opacity="0.1" />
    
    <g filter="url(#monolithGlow)" className="animate-pulse">
       <circle cx="500" cy="500" r="100" fill="white" opacity="0.05" />
       <circle cx="500" cy="500" r="40" fill="white" />
       <path d="M 500 0 V 1000 M 0 500 H 1000" stroke="white" strokeWidth="0.8" opacity="0.1" />
       <circle cx="500" cy="500" r="180" fill="none" stroke="url(#ringGrad)" strokeWidth="15" className="animate-pulse-ring" />
    </g>
  </svg>
);

const IllustrationKeyboardMapping = () => (
  <svg viewBox="0 0 800 600" className="w-full animate-float">
    <rect x="20" y="20" width="760" height="560" rx="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
    <rect x="50" y="50" width="700" height="500" rx="50" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
    
    {[100, 180, 260, 340, 420].map((y, i) => (
      <g key={y} opacity={0.3 + (i * 0.15)}>
         {[80, 140, 200, 260, 320, 380, 440, 500, 560, 620, 680].map((x, j) => (
           <rect 
             key={x} 
             x={x} 
             y={y} 
             width="45" 
             height="45" 
             rx="12" 
             fill={i === 2 ? 'rgba(0, 243, 255, 0.25)' : 'rgba(255,255,255,0.08)'} 
             stroke="rgba(255,255,255,0.15)" 
           />
         ))}
      </g>
    ))}
    
    <path d="M 400 220 L 400 300 M 400 300 L 150 450" stroke="cyan" strokeWidth="4" opacity="0.7" strokeDasharray="15 15" className="animate-dash" />
    <text x="400" y="570" fill="white" fontSize="18" font-black="900" textAnchor="middle" letterSpacing="16" opacity="0.1">HARDWARE_PERIPHERAL_POLL</text>
  </svg>
);

const IllustrationCircuitDiagram = () => (
  <svg viewBox="0 0 600 600" className="w-full">
     <rect x="50" y="50" width="500" height="500" fill="none" stroke="white" strokeWidth="0.8" opacity="0.08" />
     <path d="M 50 300 H 550 M 300 50 V 550" stroke="white" strokeWidth="0.3" opacity="0.15" />
     
     <g className="animate-float">
        <rect x="220" y="220" width="160" height="160" rx="30" fill="rgba(0,243,255,0.08)" stroke="cyan" strokeWidth="2" />
        <circle cx="300" cy="300" r="15" fill="white" className="animate-pulse" />
        <text x="300" y="420" fill="white" fontSize="12" fontWeight="900" textAnchor="middle" letterSpacing="6" opacity="0.4">NODE_DSP_ENGINE</text>
     </g>
     
     <path d="M 50 150 Q 150 150 300 300 T 550 450" fill="none" stroke="cyan" strokeWidth="2" opacity="0.5" className="animate-dash" />
     <path d="M 50 450 Q 150 450 300 300 T 550 150" fill="none" stroke="fuchsia" strokeWidth="1.5" opacity="0.4" className="animate-dash" />
  </svg>
);

const IllustrationSpectralDynamics = () => (
  <svg viewBox="0 0 1000 500" className="w-full">
    <defs>
      <linearGradient id="specGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    
    {[...Array(10)].map((_, i) => (
      <path 
        key={i}
        d={`M 0 ${250 + i * 15} Q 250 ${80 + i * 25} 500 ${250} T 1000 ${250 + i * 15}`} 
        fill="none" 
        stroke="url(#specGrad)" 
        strokeWidth={3 - i * 0.25} 
        opacity={0.7 - i * 0.06}
        className="animate-dash"
        style={{ animationDuration: `${6 + i}s`, animationDelay: `${i * 0.6}s` }}
      />
    ))}
    
    {[150, 450, 750].map(x => (
       <g key={x} className="animate-pulse">
         <circle cx={x} cy="250" r="6" fill="white" />
         <circle cx={x} cy="250" r="18" fill="none" stroke="cyan" strokeWidth="2" className="animate-pulse-ring" />
       </g>
    ))}
  </svg>
);

const IllustrationBlueprintGrid: React.FC<{ size: number }> = ({ size }) => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="gridLargeFinal" width={size} height={size} patternUnits="userSpaceOnUse">
        <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke="white" strokeWidth="0.8"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#gridLargeFinal)" />
  </svg>
);

export default LandingPage;
