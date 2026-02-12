import React, { useState, useRef } from 'react';
import { TabType } from '../types';
import { auth } from '../services/firebase';

interface ProtectRegisterProps {
    setActiveTab: (tab: TabType) => void;
    t: (key: string) => string;
}

type WizardStep = 'intro' | 'agreement' | 'age_gate' | 'under_18' | 'upload' | 'success';

export const ProtectRegister: React.FC<ProtectRegisterProps> = ({ setActiveTab, t }) => {
    const [step, setStep] = useState<WizardStep>('intro');
    const [file, setFile] = useState<{ base64: string; mimeType: string, name: string } | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ caseId: string; timestamp: string, status?: string, message?: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Ownership Declaration State
    const [declaration, setDeclaration] = useState({
        confirmedOwnership: false,
        penaltyAck: false,
        tosAgreement: false
    });

    // Progress Calculation
    const getProgress = () => {
        switch (step) {
            case 'intro': return 0;
            case 'agreement': return 10;
            case 'age_gate': return 30;
            case 'upload': return 70;
            case 'declaration': return 90;
            case 'success': return 100;
            default: return 0;
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert("File too large. Max 10MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setFile({
                        base64: reader.result,
                        mimeType: selectedFile.type,
                        name: selectedFile.name
                    });
                    setPreview(reader.result);
                    setStep('declaration'); // Move to declaration after upload
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleRegister = async () => {
        if (!file) return;
        if (!declaration.confirmedOwnership || !declaration.penaltyAck || !declaration.tosAgreement) {
            alert("You must agree to all ownership declarations to proceed.");
            return;
        }

        setIsProcessing(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const API_BASE = import.meta.env.VITE_API_URL;
            if (!API_BASE) {
                alert("Configuration Error: VITE_API_URL is missing. Please set it in Vercel.");
                throw new Error("VITE_API_URL is missing");
            }
            console.log("Protect Register URL:", `${API_BASE}/api/protect/register`);
            const response = await fetch(`${API_BASE}/api/protect/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fileBase64: file.base64,
                    mimeType: file.mimeType,
                    metadata: {
                        fileName: file.name,
                        originalSize: file.base64.length
                    },
                    ownershipDeclaration: {
                        confirmedOwnership: declaration.confirmedOwnership,
                        agreedToPenalty: declaration.penaltyAck,
                        agreedToTos: declaration.tosAgreement
                    }
                })
            });

            const data = await response.json();

            if (response.status === 409) {
                throw new Error("Duplicate Content: This file is already protected by another user.");
            }

            if (!response.ok) throw new Error(data.error || "Registration failed");

            setResult({
                caseId: data.caseId,
                timestamp: data.timestamp,
                status: data.status,
                message: data.message
            });
            setStep('success');

        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const renderIntro = () => (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto">
            <div className="w-32 h-32 mx-auto bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <i className="fas fa-shield-cat text-5xl text-orange-500"></i>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {t('protect_intro_title')} <span className="text-orange-500">{t('protect_intro_highlight')}</span>{t('protect_intro_suffix')}
            </h1>
            <p className="text-slate-400 text-lg">
                {t('protect_intro_desc')}
            </p>
            <button
                onClick={() => setStep('agreement')}
                className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold text-lg uppercase tracking-wide transition-all hover:scale-105 shadow-lg shadow-orange-600/20"
            >
                {t('protect_btn_create')}
            </button>
        </div>
    );

    const renderAgreement = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-3xl mx-auto">
            <div className="glass-panel p-8 rounded-3xl border border-orange-500/20 bg-orange-500/5 space-y-4">
                <div className="flex items-start gap-4">
                    <i className="fas fa-circle-question text-2xl text-orange-500 mt-1"></i>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">{t('protect_eligibility_title')}</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {t('protect_eligibility_text')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <i className="fas fa-check"></i> {t('protect_accept_title')}
                    </h4>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
                            {t('protect_accept_1')}
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
                            {t('protect_accept_2')}
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
                            {t('protect_accept_3')}
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-red-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <i className="fas fa-xmark"></i> {t('protect_reject_title')}
                    </h4>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
                            {t('protect_reject_1')}
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
                            {t('protect_reject_2')}
                        </li>
                        <li className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
                            {t('protect_reject_3')}
                        </li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 flex justify-center">
                <button
                    onClick={() => setStep('age_gate')}
                    className="w-full md:w-auto px-12 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold text-lg uppercase tracking-wide transition-all hover:scale-105"
                >
                    {t('protect_btn_agree')}
                </button>
            </div>
        </div>
    );

    const renderAgeGate = () => (
        <div className="text-center space-y-12 animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto py-12">
            <h2 className="text-3xl font-bold text-white">
                {t('protect_age_title')}
            </h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
                <button
                    onClick={() => setStep('under_18')}
                    className="px-8 py-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-2xl text-xl font-bold text-white transition-all w-full md:w-64"
                >
                    {t('protect_btn_under18')}
                </button>
                <button
                    onClick={() => setStep('upload')}
                    className="px-8 py-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-2xl text-xl font-bold text-white transition-all w-full md:w-64"
                >
                    {t('protect_btn_over18')}
                </button>
            </div>
        </div>
    );

    const renderUnder18 = () => (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto py-12">
            <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <i className="fas fa-hand text-3xl text-red-500"></i>
            </div>
            <h2 className="text-3xl font-bold text-white">{t('protect_under18_title')}</h2>
            <p className="text-slate-300 leading-relaxed">
                {t('protect_under18_text')} <a href="https://www.missingkids.org/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">{t('protect_ncmec')}</a> {t('protect_or')} <a href="https://www.iwf.org.uk/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">{t('protect_iwf')}</a>{t('protect_specialized')}
            </p>
            <button
                onClick={() => setStep('intro')}
                className="text-slate-500 hover:text-white underline text-sm"
            >
                {t('protect_btn_start_over')}
            </button>
        </div>
    );

    const renderUpload = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-3xl mx-auto">
            <div className="bg-orange-500/10 border-l-4 border-orange-500 p-6 rounded-r-xl">
                <p className="text-orange-200 font-bold mb-2">{t('protect_upload_title')}</p>
                <p className="text-orange-100/70 text-sm">
                    {t('protect_upload_text')}
                </p>
            </div>

            <div className="flex flex-col items-center gap-8 py-8">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full aspect-video md:aspect-[21/9] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${preview ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}`}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    {preview ? (
                        <img src={preview} alt="Preview" className="h-full object-contain rounded-2xl p-2" />
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                <i className="fas fa-images text-2xl text-slate-400"></i>
                            </div>
                            <button className="px-8 py-3 bg-slate-700 text-white rounded-lg font-bold uppercase tracking-wider text-sm">
                                {t('protect_btn_select')}
                            </button>
                            <p className="text-xs text-slate-500">{t('protect_upload_max')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderDeclaration = () => (
        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wide">{t('protect_decl_title')}</h2>
                <p className="text-slate-400 text-sm">{t('protect_decl_text')}</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
                <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center mt-1">
                        <input
                            type="checkbox"
                            checked={declaration.confirmedOwnership}
                            onChange={(e) => setDeclaration({ ...declaration, confirmedOwnership: e.target.checked })}
                            className="peer sr-only"
                        />
                        <div className="w-6 h-6 border-2 border-slate-600 rounded bg-slate-900 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                        <i className="fas fa-check text-xs text-white absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {t('protect_decl_1')}
                    </span>
                </label>

                <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center mt-1">
                        <input
                            type="checkbox"
                            checked={declaration.penaltyAck}
                            onChange={(e) => setDeclaration({ ...declaration, penaltyAck: e.target.checked })}
                            className="peer sr-only"
                        />
                        <div className="w-6 h-6 border-2 border-slate-600 rounded bg-slate-900 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                        <i className="fas fa-check text-xs text-white absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {t('protect_decl_2')}
                    </span>
                </label>

                <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center mt-1">
                        <input
                            type="checkbox"
                            checked={declaration.tosAgreement}
                            onChange={(e) => setDeclaration({ ...declaration, tosAgreement: e.target.checked })}
                            className="peer sr-only"
                        />
                        <div className="w-6 h-6 border-2 border-slate-600 rounded bg-slate-900 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                        <i className="fas fa-check text-xs text-white absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {t('protect_decl_3')}
                    </span>
                </label>
            </div>

            <button
                onClick={handleRegister}
                disabled={!declaration.confirmedOwnership || !declaration.penaltyAck || !declaration.tosAgreement || isProcessing}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg ${(!declaration.confirmedOwnership || !declaration.penaltyAck || !declaration.tosAgreement)
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20'
                    }`}
            >
                {isProcessing ? (
                    <span className="flex items-center justify-center gap-3">
                        <i className="fas fa-circle-notch animate-spin"></i> {t('protect_btn_verifying')}
                    </span>
                ) : (
                    t('protect_btn_confirm')
                )}
            </button>

            <button
                onClick={() => { setStep('upload'); setFile(null); }}
                className="w-full text-xs text-slate-500 hover:text-white uppercase tracking-widest"
            >
                {t('protect_btn_back')}
            </button>
        </div>
    );

    const renderSuccess = () => (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto py-12">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border ${result?.status === 'pending_review' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                <i className={`fas ${result?.status === 'pending_review' ? 'fa-triangle-exclamation text-yellow-500' : 'fa-check text-green-500'} text-4xl`}></i>
            </div>

            <h2 className="text-3xl font-bold text-white uppercase tracking-wide">
                {result?.status === 'pending_review' ? t('protect_success_review') : t('protect_success_created')}
            </h2>

            <div className="bg-[#0a0f18] p-6 rounded-2xl border border-white/10 space-y-4 max-w-md mx-auto">
                <p className="text-slate-400 text-sm">{result?.message}</p>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-xs text-slate-500 uppercase">{t('protect_label_caseid')}</span>
                    <span className="text-blue-400 font-mono text-sm">{result?.caseId}</span>
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setActiveTab('protect_list')}
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold uppercase text-xs tracking-widest"
                >
                    {t('protect_btn_vault')}
                </button>
                <button
                    onClick={() => {
                        setStep('intro');
                        setFile(null);
                        setPreview(null);
                        setDeclaration({ confirmedOwnership: false, penaltyAck: false, tosAgreement: false });
                    }}
                    className="px-8 py-3 bg-transparent border border-slate-700 text-slate-400 hover:text-white rounded-lg font-bold uppercase text-xs tracking-widest"
                >
                    {t('protect_btn_another')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 h-full flex flex-col">
            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => setActiveTab('protect')} className="text-slate-500 hover:text-white flex items-center gap-2 transition-colors">
                    <i className="fas fa-arrow-left"></i>
                    <span className="text-xs font-bold uppercase tracking-widest">{t('protect_step_exit')}</span>
                </button>
                <div className="text-slate-600 font-mono text-xs">
                    STEP {step === 'intro' ? 0 : step === 'agreement' ? 1 : step === 'age_gate' ? 2 : step === 'upload' ? 3 : step === 'declaration' ? 4 : 5}/5
                </div>
            </div>

            {/* Progress Bar */}
            {step !== 'intro' && step !== 'success' && step !== 'under_18' && (
                <div className="w-full h-1 bg-slate-800 rounded-full mb-12 overflow-hidden">
                    <div
                        className="h-full bg-orange-500 transition-all duration-500 ease-out"
                        style={{ width: `${getProgress()}%` }}
                    ></div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-center">
                {step === 'intro' && renderIntro()}
                {step === 'agreement' && renderAgreement()}
                {step === 'age_gate' && renderAgeGate()}
                {step === 'under_18' && renderUnder18()}
                {step === 'upload' && renderUpload()}
                {step === 'declaration' && renderDeclaration()}
                {step === 'success' && renderSuccess()}
            </div>
        </div>
    );
};

