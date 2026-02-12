
import React from 'react';
import { AnalysisHistory } from '../types';
import { TiltCard } from './TiltCard';
import { ScrollReveal } from './ScrollReveal';

interface DashboardStatsProps {
  history: AnalysisHistory[];
  t: (key: string) => string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ history, t }) => {
  const safeHistory = history || [];
  const totalScans = safeHistory.length;
  const aiDetected = safeHistory.filter(h => h.result && h.result.verdict === 'DEEPFAKE').length;
  const humanDetected = safeHistory.filter(h => h.result && h.result.verdict === 'REAL').length;
  const suspiciousDetected = safeHistory.filter(h => h.result && h.result.verdict === 'SUSPICIOUS').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ScrollReveal animation="zoom" delay={0.1}>
        <StatCard
          label="Total Scans"
          value={totalScans}
          icon="fa-microscope"
          color="blue"
        />
      </ScrollReveal>
      <ScrollReveal animation="zoom" delay={0.2}>
        <StatCard
          label="AI Models Detected"
          value={aiDetected}
          icon="fa-robot"
          color="red"
        />
      </ScrollReveal>
      <ScrollReveal animation="zoom" delay={0.3}>
        <StatCard
          label="Human Verified"
          value={humanDetected}
          icon="fa-user-check"
          color="green"
        />
      </ScrollReveal>
      <ScrollReveal animation="zoom" delay={0.4}>
        <StatCard
          label="Suspicious Nodes"
          value={suspiciousDetected}
          icon="fa-shield-virus"
          color="orange"
        />
      </ScrollReveal>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) => {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <TiltCard className="glass-panel p-6 rounded-[2rem] border border-white/5 flex flex-col items-center text-center space-y-2 h-full">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClasses[color]}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
    </TiltCard>
  );
};
