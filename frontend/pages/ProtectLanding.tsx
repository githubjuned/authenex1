import React from 'react';
import { TabType } from '../types';

interface ProtectLandingProps {
    setActiveTab: (tab: TabType) => void;
    t: (key: string) => string;
}

export const ProtectLanding: React.FC<ProtectLandingProps> = ({ setActiveTab, t }) => {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-12 animate-in fade-in zoom-in duration-500">

            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                    {t('protect_landing_title_1')} <span className="text-blue-500">{t('protect_landing_title_2')}</span>
                </h1>
                <p className="text-slate-400 font-bold tracking-widest uppercase text-xs md:text-sm max-w-2xl mx-auto">
                    {t('protect_landing_subtitle')}
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">

                {/* Register Card */}
                <div
                    onClick={() => setActiveTab('protect_register')}
                    className="group relative glass-panel p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 cursor-pointer flex flex-col items-center text-center space-y-6"
                >
                    <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                        <i className="fas fa-fingerprint text-3xl text-blue-500"></i>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider">{t('protect_card_register_title')}</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            {t('protect_card_register_desc')}
                        </p>
                    </div>
                    <div className="px-4 py-2 rounded-full border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest bg-blue-500/10">
                        {t('protect_card_register_btn')}
                    </div>
                </div>

                {/* Manage Card */}
                <div
                    onClick={() => setActiveTab('protect_list')}
                    className="group relative glass-panel p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 cursor-pointer flex flex-col items-center text-center space-y-6"
                >
                    <div className="w-20 h-20 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                        <i className="fas fa-boxes-stacked text-3xl text-purple-500"></i>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider">{t('protect_card_vault_title')}</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            {t('protect_card_vault_desc')}
                        </p>
                    </div>
                    <div className="px-4 py-2 rounded-full border border-purple-500/30 text-purple-400 text-[10px] font-black uppercase tracking-widest bg-purple-500/10">
                        {t('protect_card_vault_btn')}
                    </div>
                </div>

                {/* Verify Card */}
                <div
                    onClick={() => setActiveTab('protect_verify')}
                    className="group relative glass-panel p-8 rounded-[2rem] border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300 cursor-pointer flex flex-col items-center text-center space-y-6"
                >
                    <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:scale-110 transition-transform duration-500">
                        <i className="fas fa-magnifying-glass-chart text-3xl text-red-500"></i>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider">{t('protect_card_verify_title')}</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            {t('protect_card_verify_desc')}
                        </p>
                    </div>
                    <div className="px-4 py-2 rounded-full border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/10">
                        {t('protect_card_verify_btn')}
                    </div>
                </div>

            </div>

            {/* Dispute Reporting Link (NEW) */}
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <button
                    onClick={() => setActiveTab('protect_disputes')}
                    className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto hover:bg-white/5 py-2 px-4 rounded-full"
                >
                    <i className="fas fa-flag"></i> {t('protect_btn_dispute')}
                </button>
            </div>

            {/* Privacy Notice */}
            <div className="text-center">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest max-w-lg mx-auto">
                    <i className="fas fa-shield-halved mr-2"></i>
                    {t('protect_privacy_notice')}
                </p>
            </div>

        </div>
    );
};
