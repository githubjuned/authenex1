
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from './TiltCard';
import { ScrollReveal } from './ScrollReveal';
import { TabType } from '../types';

interface LandingPageProps {
  onEnter: () => void;
  t: (key: string) => string;
  setActiveTab: (tab: TabType) => void;
}

const SecurityLabel = ({ icon, label, sub, color }: { icon: string, label: string, sub: string, color: string }) => (
  <div className={`group relative p-4 rounded-xl border border-${color}-500/20 bg-${color}-500/5 backdrop-blur-md flex items-center gap-4 hover:border-${color}-500/50 transition-all cursor-default`}>
    <div className={`w-10 h-10 rounded-lg bg-${color}-500/10 flex items-center justify-center text-${color}-400 group-hover:bg-${color}-500/20 transition-colors`}>
      <i className={`fas ${icon} text-lg`}></i>
    </div>
    <div>
      <h4 className="text-white font-bold text-sm uppercase tracking-wide">{label}</h4>
      <p className={`text-${color}-400/60 text-[10px] uppercase tracking-wider font-mono`}>{sub}</p>
    </div>
  </div>
);

const securityLabels = [
  { icon: 'fa-shield-halved', label: 'SOC2 Type II', sub: 'Compliant', color: 'emerald' },
  { icon: 'fa-lock', label: 'AES-256', sub: 'Encryption', color: 'blue' },
  { icon: 'fa-fingerprint', label: 'Biometric', sub: 'Liveness v2.0', color: 'cyan' },
  { icon: 'fa-user-secret', label: 'Zero Knowledge', sub: 'Proof', color: 'indigo' },
  { icon: 'fa-globe', label: 'GDPR', sub: 'Ready', color: 'violet' },
  { icon: 'fa-server', label: 'ISO 27001', sub: 'Certified', color: 'emerald' },
  { icon: 'fa-file-contract', label: 'HIPAA', sub: 'Audited', color: 'blue' },
  { icon: 'fa-eye', label: 'Deepfake', sub: 'Detection 99.9%', color: 'red' },
  { icon: 'fa-network-wired', label: 'API Security', sub: 'Oauth 2.0', color: 'orange' },
  { icon: 'fa-microchip', label: 'Neural Net', sub: 'Active', color: 'cyan' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, t, setActiveTab }) => {
  const [columns, setColumns] = useState<typeof securityLabels[][]>([[], []]);

  React.useEffect(() => {
    const mid = Math.ceil(securityLabels.length / 2);
    setColumns([
      [...securityLabels.slice(0, mid), ...securityLabels.slice(0, mid)],
      [...securityLabels.slice(mid), ...securityLabels.slice(mid)]
    ]);
  }, []);

  return (
    <div className="w-full flex flex-col relative overflow-x-hidden scroll-smooth">

      {/* 1. HERO SECTION (Split Layout) */}
      <div className="min-h-[100dvh] flex flex-col md:flex-row relative">

        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none sticky top-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
        </div>

        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10 relative space-y-12 py-20 md:py-0">

          {/* Brand */}
          <div className="space-y-8 max-w-2xl">
            <ScrollReveal animation="slide-up">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white font-modern">
                {t('hero_title_1') || 'REALITY'}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                  {t('hero_title_2') || 'RECODED'}
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="slide-in" delay={0.2}>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                {t('hero_subtitle') || 'Advanced AI forensics to detect deepfakes and verify digital authenticity in real-time.'}
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={0.4}>
              <div className="pt-4 flex flex-wrap gap-6">
                <button
                  onClick={onEnter}
                  className="group relative px-10 py-5 bg-white text-slate-950 text-xs font-black uppercase tracking-[0.25em] clip-path-slant transition-all hover:bg-cyan-50 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95"
                  style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                >
                  <span className="flex items-center gap-3">
                    {t('init_gate') || 'INITIALIZE GATE'}
                    <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                  </span>
                </button>

                <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-5 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-[0.25em] hover:border-cyan-500/50 hover:text-white transition-all clip-path-slant"
                  style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                  DISCOVER PROTOCOL
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Right Content (Marquee) */}
        <div className="hidden md:flex w-full md:w-[450px] lg:w-[500px] bg-slate-950/50 border-l border-white/5 relative overflow-hidden flex-col justify-center gap-4 z-0 h-[100dvh] sticky top-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] z-20 pointer-events-none"></div>
          <div className="flex gap-6 h-[120%] -translate-y-[10%] opacity-60 rotate-0 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
            <div className="flex flex-col gap-4 animate-marquee-up min-w-[200px]">
              {columns[0].map((item, i) => <SecurityLabel key={`col1-${i}`} {...item} />)}
            </div>
            <div className="flex flex-col gap-4 animate-marquee-down min-w-[200px]">
              {columns[1].map((item, i) => <SecurityLabel key={`col2-${i}`} {...item} />)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. HOW IT WORKS SECTION */}
      <div id="features" className="min-h-screen bg-[#020617] relative border-t border-white/5 py-24 px-4 md:px-12 flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto space-y-20">
          <ScrollReveal animation="zoom">
            <div className="text-center space-y-4">
              <h2 className="text-sm font-bold text-cyan-500 uppercase tracking-[0.3em]">The Protocol</h2>
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">Generative Identity <br /> <span className="text-slate-700">Verification</span></h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'fa-fingerprint', title: 'Deepfake Analysis', desc: 'Multi-modal analysis detects synthetic patterns in audio, video, and imagery with 99.9% precision.' },
              { icon: 'fa-network-wired', title: 'Behavioral Biometrics', desc: 'Analyzes micro-interactions and typing cadence to distinguish human operators from automated bots.' },
              { icon: 'fa-lock', title: 'Zero-Knowledge Proof', desc: 'Verify identity without ever exposing raw biometric data to the network or third parties.' }
            ].map((feature, i) => (
              <ScrollReveal key={i} animation="slide-up" delay={i * 0.2}>
                <TiltCard className="h-full">
                  <div className="group glass-panel p-10 rounded-[2rem] border-white/5 hover:border-cyan-500/30 transition-all duration-300 h-full">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-cyan-500/20 transition-colors">
                      <i className={`fas ${feature.icon} text-2xl text-slate-400 group-hover:text-cyan-400`}></i>
                    </div>
                    <h4 className="text-xl font-bold text-white uppercase tracking-tight mb-4">{feature.title}</h4>
                    <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* 3. THREAT INTELLIGENCE MAP (Abstract) */}
      <div className="min-h-[80vh] relative py-24 px-4 md:px-12 flex flex-col items-center overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-contain filter invert"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl space-y-16">
          <ScrollReveal animation="slide-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/10 pb-12">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Global Threat Index</h2>
                <p className="text-slate-400 max-w-xl">Real-time monitoring of synthetic media generation and automated fraud attempts across the decentralized network.</p>
              </div>
              <div className="flex items-center gap-2 text-red-500 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs font-bold uppercase tracking-widest">Live Updates</span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Attacks Blocked', val: '24.5M', color: 'text-white' },
              { label: 'Synthetic Ratio', val: '14.2%', color: 'text-red-500' },
              { label: 'Network Nodes', val: '8,492', color: 'text-cyan-400' },
              { label: 'Avg Latency', val: '42ms', color: 'text-emerald-400' }
            ].map((stat, i) => (
              <ScrollReveal key={i} animation="zoom" delay={i * 0.1}>
                <TiltCard className="h-full">
                  <div className="glass-panel p-8 rounded-3xl border-white/5 text-center space-y-2 h-full flex flex-col justify-center">
                    <div className={`text-4xl md:text-5xl font-black tracking-tighter ${stat.color}`}>{stat.val}</div>
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-8 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-slate-500 text-xs font-mono">
            © 2029 AUTHENEX INC. // ALL RIGHTS RESERVED
          </div>
          <div className="flex gap-8">
            <button onClick={() => { setActiveTab('privacy'); window.scrollTo(0, 0); }} className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Privacy Policy</button>
            <button onClick={() => { setActiveTab('terms'); window.scrollTo(0, 0); }} className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Terms of Service</button>
            <button onClick={() => { setActiveTab('whitepaper'); window.scrollTo(0, 0); }} className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Security Whitepaper</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
