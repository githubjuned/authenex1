
import React from 'react';

interface LegalPageProps {
    t: (key: string) => string;
}

export const LegalPage: React.FC<LegalPageProps> = ({ t }) => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-in fade-in zoom-in duration-500 pb-32">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10">
                    <i className="fas fa-scale-balanced text-yellow-500"></i>
                    <span className="text-[10px] uppercase font-black tracking-widest text-yellow-500">Legal Compliance & Safety</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">AI & The Law</h1>
                <p className="text-slate-400 max-w-2xl mx-auto">Understanding your rights and liabilities regarding Deepfakes and AI-generated content under Indian Law.</p>
            </header>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-4 uppercase">Information Technology Act, 2000</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LegalCard
                        section="Section 66D"
                        title="Cheating by Personation"
                        desc="Punishment for cheating by personating using computer resources (e.g. creating fake profiles)."
                        penalty="Up to 3 years imprisonment & fine."
                    />
                    <LegalCard
                        section="Section 66E"
                        title="Privacy Violation"
                        desc="Capturing, publishing or transmitting images of private areas of any person without consent."
                        penalty="Up to 3 years imprisonment or ₹2 Lakh fine."
                    />
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-l-4 border-red-500 pl-4 uppercase">Bharatiya Nyaya Sanhita (BNS), 2023</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LegalCard
                        section="Section 318(4)"
                        title="Cheating via Digital Means"
                        desc="Deceiving any person to deliver property or consent to retain property."
                        penalty="Imprisonment & Fine."
                    />
                    <LegalCard
                        section="Section 336(3)"
                        title="Forgery for Harming Reputation"
                        desc="Forgery clearly intending to harm liability or reputation of a party."
                        penalty="Imprisonment & Fine."
                    />
                    <LegalCard
                        section="Section 356"
                        title="Defamation"
                        desc="Making or publishing false imputations concerning any person intending to harm reputation."
                        penalty="Simple imprisonment up to 2 years."
                    />
                </div>
            </section>

            <div className="glass-panel p-8 rounded-3xl border-t border-yellow-500/50 bg-yellow-500/5 space-y-4">
                <h3 className="text-xl font-bold text-yellow-500 uppercase flex items-center gap-3">
                    <i className="fas fa-triangle-exclamation"></i>
                    Important Disclaimer
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    This tool (Authenex) is for **forensic analysis and educational purposes only**. The results provided are probabilistic estimations based on AI models and do not constitute legal proof. Always consult with legal professionals and law enforcement agencies for official investigations.
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                    If you encounter malicious deepfakes, report them immediately to the **National Cyber Crime Reporting Portal (cybercrime.gov.in)**.
                </p>
            </div>
        </div>
    );
};

const LegalCard = ({ section, title, desc, penalty }: { section: string, title: string, desc: string, penalty: string }) => (
    <div className="glass-panel p-6 rounded-2xl hover:border-blue-500/50 transition-all group">
        <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 rounded-md bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">{section}</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-4 h-16">{desc}</p>
        <div className="pt-4 border-t border-slate-800">
            <p className="text-xs font-bold text-red-400 uppercase tracking-wide">
                <i className="fas fa-gavel mr-2"></i>
                {penalty}
            </p>
        </div>
    </div>
);
