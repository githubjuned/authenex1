import React, { useEffect, useState } from 'react';
import { TabType } from '../types';
import { auth } from '../services/firebase';

interface MyProtectedContentProps {
    setActiveTab: (tab: TabType) => void;
    t: (key: string) => string;
}

interface ProtectedItem {
    caseId: string;
    timestamp: string;
    status: string;
    metadata: {
        fileName?: string;
        originalSize?: number;
    };
}

export const MyProtectedContent: React.FC<MyProtectedContentProps> = ({ setActiveTab, t }) => {
    const [items, setItems] = useState<ProtectedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            const response = await fetch(`/api/protect/list/${user.uid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Protect List Fetch Failed:", response.status, text);
                throw new Error(`${t('protect_vault_error_fetch')} ${response.status} ${text}`);
            }

            const data = await response.json();
            setItems(data);
        } catch (err: any) {
            console.error("Protect List Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (caseId: string) => {
        if (!window.confirm(t('protect_vault_confirm_delete'))) return;

        try {
            const token = await auth.currentUser?.getIdToken();
            const response = await fetch(`/api/protect/${caseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(t('protect_vault_error_delete'));

            setItems(prev => prev.filter(item => item.caseId !== caseId));
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="flex items-center gap-4">
                <button onClick={() => setActiveTab('protect')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                    <i className="fas fa-arrow-left text-slate-400"></i>
                </button>
                <h1 className="text-2xl font-bold uppercase tracking-widest text-white">{t('protect_vault_title')}</h1>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <i className="fas fa-circle-notch animate-spin text-4xl text-blue-500"></i>
                    <p className="mt-4 text-slate-500 uppercase tracking-widest text-xs">{t('protect_vault_loading')}</p>
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-400">
                    <i className="fas fa-triangle-exclamation text-3xl mb-4"></i>
                    <p>{error}</p>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center">
                        <i className="fas fa-folder-open text-3xl text-slate-600"></i>
                    </div>
                    <p className="text-slate-500 uppercase tracking-widest text-xs">{t('protect_vault_empty')}</p>
                    <button onClick={() => setActiveTab('protect_register')} className="px-6 py-2 bg-blue-600 rounded-lg text-white text-xs font-bold uppercase tracking-widest">
                        {t('protect_vault_btn_register')}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {items.map(item => (
                        <div key={item.caseId} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">

                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                                <i className="fas fa-shield-cat text-blue-400"></i>
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-bold text-white font-mono">{item.caseId}</h3>
                                    <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[9px] font-bold uppercase tracking-widest border border-green-500/20">
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    {t('protect_vault_label_registered')} {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                                </p>
                                {item.metadata.fileName && (
                                    <p className="text-xs text-slate-400 truncate">
                                        {t('protect_vault_label_file')} {item.metadata.fileName}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4 self-end md:self-center">
                                <button
                                    onClick={() => handleDelete(item.caseId)}
                                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                    title={t('protect_vault_btn_remove')}
                                >
                                    <i className="fas fa-trash-can"></i>
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};
