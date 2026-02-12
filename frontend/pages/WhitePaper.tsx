
import React from 'react';

interface Props {
    t: (key: string) => string;
}

export const WhitePaper: React.FC<Props> = ({ t }) => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-in fade-in zoom-in duration-500 pb-32">
            <header className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4">
                    <i className="fas fa-file-contract text-cyan-400"></i>
                    <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400">Technical Documentation</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Security Whitepaper</h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    A deep dive into the Authenex Neural Engine, Zero-Knowledge Proof architecture, and our methodology for detecting synthetic media.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-cyan-500/50 transition-all group cursor-pointer">
                    <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                        <i className="fas fa-brain text-xl text-slate-400 group-hover:text-cyan-400"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">The Neural Engine</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        Detailed breakdown of our multi-modal transformer architecture used for detecting artifacts in varying media types.
                    </p>
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest group-hover:underline">Read Section 01 &rarr;</span>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-cyan-500/50 transition-all group cursor-pointer">
                    <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                        <i className="fas fa-shield-halved text-xl text-slate-400 group-hover:text-cyan-400"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Privacy Preserving</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        How we use Zero-Knowledge Proofs (ZK-SNARKs) to verify authenticity without exposing underlying biometric data.
                    </p>
                    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest group-hover:underline">Read Section 02 &rarr;</span>
                </div>
            </div>


        </div>
    );
};
