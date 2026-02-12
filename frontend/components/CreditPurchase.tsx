
import React from 'react';
import { User } from '../types';

interface CreditPurchaseProps {
  user: User;
  onPurchase: (amount: number, packLabel: string, price: string) => void;
  t: (key: string) => string;
}

export const CreditPurchase: React.FC<CreditPurchaseProps> = ({ user, onPurchase, t }) => {
  const packs = [
    { id: 'basic', label: t('pack_starter'), credits: 100, price: '$19', icon: 'fa-bolt-lite', popular: false },
    { id: 'pro', label: t('pack_forensic'), credits: 500, price: '$79', icon: 'fa-microchip', popular: true },
    { id: 'enterprise', label: t('pack_command'), credits: 2000, price: '$249', icon: 'fa-server', popular: false },
  ];

  return (
    <div className="py-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">
          {t('credits_subtitle')}
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
          {t('credits_title').split(' ')[0]} <span className="text-blue-500">{t('credits_title').split(' ').slice(1).join(' ')}</span>
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto text-sm font-medium">
          {t('credits_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {packs.map((pack) => (
          <div
            key={pack.id}
            className={`relative glass-panel p-8 rounded-[2.5rem] border transition-all hover:-translate-y-2 flex flex-col justify-between overflow-hidden group ${pack.popular ? 'border-blue-500 bg-blue-600/5 shadow-[0_0_40px_rgba(37,99,235,0.15)]' : 'border-white/5 hover:border-white/10'
              }`}
          >
            <div className="space-y-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pack.popular ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <i className={`fas ${pack.icon} text-xl`}></i>
              </div>

              <div>
                <h3 className="text-xl font-black text-white uppercase">{pack.label}</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Single-Point Neural Access</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{pack.credits}</span>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('credits')}</span>
              </div>
            </div>

            <button
              onClick={() => onPurchase(pack.credits, pack.label, pack.price)}
              className={`mt-10 w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${pack.popular ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 border border-white/5'
                }`}
            >
              {t('request_purchase') || 'REQUEST ACCESS'} {pack.price}
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-xl mx-auto p-6 rounded-[2rem] border border-white/5 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
            <i className="fas fa-wallet"></i>
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('active_balance')}</p>
            <p className="text-xl font-black text-white uppercase">{user.credits} <span className="text-[10px] text-slate-400">{t('credits')}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
