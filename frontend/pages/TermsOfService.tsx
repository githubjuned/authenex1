
import React from 'react';

interface Props {
    t: (key: string) => string;
}

export const TermsOfService: React.FC<Props> = ({ t }) => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in zoom-in duration-500 pb-32">
            <header className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Terms of Service</h1>
                <p className="text-slate-400">Effective Date: October 24, 2025</p>
            </header>

            <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">1. Acceptance of Terms</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        By accessing Authenex, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our services. This tool is intended for ethical AI forensics and security research.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">2. Prohibited Use</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        You may not use Authenex to:
                        <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                            <li>Analyze non-consensual intimate imagery (NCII) except for reporting purposes.</li>
                            <li>Attempt to reverse engineer our detection models.</li>
                            <li>Automate queries ("scraping") without an Enterprise API license.</li>
                        </ul>
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">3. Disclaimer of Warranties</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Our AI analysis provides a probabilistic assessment of authenticity. It is not infallible. Authenex is provided "AS IS" without warranties of any kind. We are not liable for any actions taken based on our analysis results.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide">4. Termination</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        We reserve the right to suspend accounts that abuse the platform or violate these terms, particularly those attempting to use the tool to generate or validate malicious content.
                    </p>
                </section>
            </div>
        </div>
    );
};
