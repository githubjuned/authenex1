
import React from 'react';

interface ForensicMethodologyProps {
  t: (key: string) => string;
}

export const ForensicMethodology: React.FC<ForensicMethodologyProps> = ({ t }) => {
  const techniques = [
    {
      title: "Ocular Consistency",
      icon: "fa-eye",
      description: "Analyzes pupil symmetry and iris reflections. AI struggles with coherent light physics across biological eyes.",
      color: "blue"
    },
    {
      title: "Neural Signatures",
      icon: "fa-wave-square",
      description: "Identifies high-frequency artifacts and residual noise unique to Generative Adversarial Networks (GANs).",
      color: "purple"
    },
    {
      title: "Biological Integrity",
      icon: "fa-dna",
      description: "Checks for uncanny valley indicators in hair strand rendering, skin pores, and photoplethysmography signals.",
      color: "green"
    },
    {
      title: "Geometric Logic",
      icon: "fa-shapes",
      description: "Scrutinizes background warping and structural inconsistencies in hands, jewelry, and text overlays.",
      color: "orange"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-bold uppercase tracking-[0.3em]">
          Technical Protocols
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">The Neural <span className="text-cyan-500">Engine</span></h2>
        <p className="max-w-xl mx-auto text-slate-400 text-sm font-medium leading-relaxed opacity-80">
          Authenex utilizes advanced multimodal reasoning to perform deep-level pixel forensics that traditional algorithms miss.
        </p>
      </div>

      {/* Detection Pipeline */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] border-l-2 border-cyan-600 pl-3">Forensic Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-slate-800 -z-10"></div>
          
          <div className="glass-panel p-5 rounded-2xl space-y-2.5 relative bg-slate-900/50">
            <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-[10px]">1</div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Ingestion</h4>
            <p className="text-[10px] text-slate-500 leading-normal">Raw pixel data is extracted and metadata is sanitized for spoof prevention.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2.5 relative bg-slate-900/50">
            <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-[10px]">2</div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Neural Scrub</h4>
            <p className="text-[10px] text-slate-500 leading-normal">Multimodal visual reasoning is performed across spatial frequencies.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2.5 relative bg-slate-900/50">
            <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-[10px]">3</div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Extraction</h4>
            <p className="text-[10px] text-slate-500 leading-normal">Statistical anomalies in lighting and texture are isolated and flagged.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2.5 relative bg-slate-900/50">
            <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-[10px]">4</div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Consensus</h4>
            <p className="text-[10px] text-slate-500 leading-normal">Final scoring via Bayesian aggregation and semantic verification.</p>
          </div>
        </div>
      </section>

      {/* Forensic Techniques */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] border-l-2 border-cyan-600 pl-3">Protocols</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techniques.map((tech, i) => (
            <div key={i} className="glass-panel p-6 rounded-[2rem] border-slate-800/50 hover:border-cyan-500/20 transition-all flex gap-5 items-center">
              <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center bg-slate-800/50 border border-slate-700/50`}>
                <i className={`fas ${tech.icon} text-lg text-cyan-500`}></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{tech.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Model Tech Specs */}
      <section className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-blue-950/20 border-cyan-500/10">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Forensic Architecture</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed opacity-80">
              Our platform leverages multimodal foundation models that understand visual contexts at a superhuman level. Unlike standard CV, Authenex can reason about the intent and logic of a scene.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
                <p className="text-lg font-bold text-white">2M+</p>
                <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Window</p>
              </div>
              <div className="text-center p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
                <p className="text-lg font-bold text-white">4K</p>
                <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Resolut.</p>
              </div>
              <div className="text-center p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
                <p className="text-lg font-bold text-white">99%</p>
                <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Precision</p>
              </div>
            </div>
          </div>
          <div className="w-32 md:w-48 aspect-square glass-panel rounded-3xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-600/5 group-hover:bg-cyan-600/10 transition-colors"></div>
            <i className="fas fa-microchip text-5xl text-cyan-500 animate-pulse"></i>
          </div>
        </div>
      </section>
    </div>
  );
};
