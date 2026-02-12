
import React from 'react';

interface Props {
    t: (key: string) => string;
}

export const PrivacyPolicy: React.FC<Props> = ({ t }) => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in zoom-in duration-500 pb-32">
            <header className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Privacy Policy</h1>
                <p className="text-slate-400">Last Updated: October 24, 2025</p>
            </header>

            <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">1. Data Collection</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Authenex collects minimal data necessary for forensic analysis. When you upload media for deepfake detection, the file is processed temporarily in our secure enclave and is immediately discarded after analysis unless you explicitly opt-in to our "Improve AI" program.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">2. biometric data</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        We do not store raw biometric templates. Our "Zero-Knowledge" proof system verifies identity without retaining face geometry or voice prints, ensuring your biological data cannot be reverse-engineered from our servers.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">3. User Rights</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Under GDPR and local regulations, you have the right to request a full export of your activity logs or a complete deletion of your account and associated metadata at any time via the Settings panel.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">4. Third Parties</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        We do not sell your data. We share anonymized, aggregated threat intelligence with global cybersecurity alliances to improve deepfake detection standards, but this data cannot be traced back to individual users.
                    </p>
                </section>
            </div>
        </div>
    );
};
