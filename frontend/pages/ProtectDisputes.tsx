import React, { useState } from 'react';
import { TabType } from '../types';
import { auth } from '../services/firebase';

interface ProtectDisputesProps {
    setActiveTab: (tab: TabType) => void;
    t: (key: string) => string;
}

export const ProtectDisputes: React.FC<ProtectDisputesProps> = ({ setActiveTab, t }) => {
    const [caseId, setCaseId] = useState('');
    const [reason, setReason] = useState('false_ownership');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const API_BASE = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${API_BASE}/api/protect/dispute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    caseId,
                    reason,
                    description,
                    contactEmail: email || auth.currentUser?.email
                })
            });

            if (!response.ok) throw new Error("Failed to submit dispute");
            setSubmitted(true);
        } catch (error) {
            alert("Error submitting dispute. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                    <i className="fas fa-paper-plane text-4xl text-green-500"></i>
                </div>
                <h2 className="text-3xl font-bold text-white">{t('protect_dispute_submitted_title')}</h2>
                <p className="text-slate-400">
                    {t('protect_dispute_submitted_desc_1')} <span className="text-blue-400 font-mono">{caseId}</span> {t('protect_dispute_submitted_desc_2')}
                </p>
                <button
                    onClick={() => setActiveTab('protect')}
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold uppercase text-xs tracking-widest"
                >
                    {t('protect_dispute_btn_return')}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <button onClick={() => setActiveTab('protect')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                    <i className="fas fa-arrow-left text-slate-400"></i>
                </button>
                <h1 className="text-2xl font-bold uppercase tracking-widest text-white">{t('protect_dispute_title')}</h1>
            </div>

            <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-r-xl">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                    <i className="fas fa-triangle-exclamation"></i> {t('protect_dispute_notice_title')}
                </h3>
                <p className="text-red-200/70 text-sm leading-relaxed">
                    {t('protect_dispute_notice_text')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('protect_dispute_label_case_id')}</label>
                    <input
                        type="text"
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                        placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                        className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none font-mono text-sm"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('protect_dispute_label_reason')}</label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none appearance-none"
                    >
                        <option value="false_ownership">{t('protect_dispute_reason_false')}</option>
                        <option value="stolen_content">{t('protect_dispute_reason_stolen')}</option>
                        <option value="impersonation">{t('protect_dispute_reason_impersonation')}</option>
                        <option value="other">{t('protect_dispute_reason_other')}</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('protect_dispute_label_desc')}</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('protect_dispute_placeholder_desc')}
                        rows={5}
                        className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none resize-none"
                        required
                    ></textarea>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('protect_dispute_label_email')}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={auth.currentUser?.email || "email@example.com"}
                        className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                        required
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all border border-slate-700 hover:border-slate-500"
                    >
                        {isSubmitting ? t('protect_dispute_btn_submitting') : t('protect_dispute_btn_submit')}
                    </button>
                </div>

            </form>
        </div>
    );
};
