import React, { useState, useRef } from 'react';
import { TabType } from '../types';
import { auth } from '../services/firebase';
import { generateEvidenceReport } from '../utils/reportGenerator';

interface VerifySuspiciousProps {
    setActiveTab: (tab: TabType) => void;
    t: (key: string) => string;
}

interface VerificationResult {
    matchFound: boolean;
    bestMatch?: {
        caseId: string;
        userId: string;
        timestamp: string;
        matchType: string;
        score: string;
    };
    analysis: {
        sha256: string;
        pHash: string;
        embedding: string;
    };
}

export const VerifySuspicious: React.FC<VerifySuspiciousProps> = ({ setActiveTab, t }) => {
    const [file, setFile] = useState<{ base64: string; mimeType: string, name: string, size: number } | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert(t('protect_verify_error_size'));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setFile({
                        base64: reader.result,
                        mimeType: selectedFile.type,
                        name: selectedFile.name,
                        size: selectedFile.size
                    });
                    setPreview(reader.result);
                    setResult(null);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleVerify = async () => {
        if (!file) return;

        setIsProcessing(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const API_BASE = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${API_BASE}/api/protect/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fileBase64: file.base64,
                    mimeType: file.mimeType
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setResult(data);

        } catch (error: any) {
            alert(`${t('protect_verify_error_failed')} ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadReport = () => {
        if (!result || !file) return;
        generateEvidenceReport({
            timestamp: new Date().toISOString(),
            matchType: result.matchFound ? (result.bestMatch?.matchType || 'Match') : 'No Match',
            score: result.matchFound ? (result.bestMatch?.score || '0') : '0',
            targetFile: {
                name: file.name,
                size: file.size,
                type: file.mimeType
            },
            analysis: result.analysis,
            bestMatch: result.bestMatch
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="flex items-center gap-4">
                <button onClick={() => setActiveTab('protect')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                    <i className="fas fa-arrow-left text-slate-400"></i>
                </button>
                <h1 className="text-2xl font-bold uppercase tracking-widest text-white">{t('protect_verify_title')}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Upload Area */}
                <div className="space-y-4">
                    <div
                        onClick={() => !result && fileInputRef.current?.click()}
                        className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${preview ? 'border-red-500/50 bg-red-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}`}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" disabled={!!result} />
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-3xl p-2" />
                        ) : (
                            <div className="text-center space-y-4">
                                <i className="fas fa-magnifying-glass-chart text-4xl text-slate-500"></i>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('protect_verify_label_upload')}</p>
                                <p className="text-[10px] text-slate-600 uppercase tracking-widest">{t('protect_verify_formats')}</p>
                            </div>
                        )}
                    </div>

                    {file && !result && (
                        <button
                            onClick={handleVerify}
                            disabled={isProcessing}
                            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                        >
                            {isProcessing ? t('protect_verify_analyzing') : t('protect_verify_btn_start')}
                        </button>
                    )}

                    {result && (
                        <button
                            onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors"
                        >
                            {t('protect_verify_btn_reset')}
                        </button>
                    )}
                </div>

                {/* Results Area */}
                <div className="space-y-6">
                    {result ? (
                        <div className={`glass-panel p-8 rounded-3xl border ${result.matchFound ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'} space-y-6 text-center animate-in fade-in zoom-in`}>

                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border ${result.matchFound ? 'bg-red-500/20 border-red-500/40 text-red-500' : 'bg-green-500/20 border-green-500/40 text-green-500'}`}>
                                <i className={`fas ${result.matchFound ? 'fa-triangle-exclamation' : 'fa-shield-check'} text-4xl`}></i>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                                    {result.matchFound ? t('protect_verify_result_match') : t('protect_verify_result_nomatch')}
                                </h2>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    {result.matchFound ? result.bestMatch?.matchType : t('protect_verify_result_original')}
                                </p>
                            </div>

                            {result.matchFound && result.bestMatch && (
                                <div className="bg-black/40 p-4 rounded-xl text-left space-y-2 border border-white/5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 uppercase">{t('protect_verify_label_score')}</span>
                                        <span className="text-red-400 font-mono font-bold">{result.bestMatch.score}%</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 uppercase">{t('protect_verify_label_case')}</span>
                                        <span className="text-slate-300 font-mono">{result.bestMatch.caseId.substring(0, 8)}...</span>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleDownloadReport}
                                className="w-full py-3 bg-white text-black hover:bg-slate-200 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-file-pdf"></i> {t('protect_verify_btn_report')}
                            </button>

                        </div>
                    ) : (
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/5 h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-500">
                            <i className="fas fa-scale-balanced text-4xl opacity-50"></i>
                            <p className="text-xs uppercase tracking-widest max-w-xs">
                                {t('protect_verify_desc')}
                            </p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};
