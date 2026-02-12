import React from 'react';
import { User, AnalysisHistory, TabType } from '../types';
import { DbService } from '../services/db';

interface ProfilePageProps {
  user: User;
  history: AnalysisHistory[];
  t: (key: string) => string;
  onLogout: () => void;
  setActiveTab: (tab: TabType) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, history, t, onLogout, setActiveTab }) => {
  const usageStats = {
    image: history.filter(h => h.result.modality === 'image').length,
    video: history.filter(h => h.result.modality === 'video').length,
    audio: history.filter(h => h.result.modality === 'audio').length,
    document: history.filter(h => h.result.modality === 'document').length,
  };

  const totalVerifications = history.length;
  const creditProgress = user.totalCredits > 0 ? (user.credits / user.totalCredits) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Identity Card */}
        <div className="flex-1 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border-blue-500/20 relative overflow-hidden">
            <div className="flex w-full justify-end gap-3 mb-4 md:absolute md:top-0 md:right-0 md:p-6 md:mb-0">
              <button onClick={onLogout} className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                Logout
              </button>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.plan === 'Pro' ? 'bg-blue-600/20 border-blue-500 text-blue-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                {user.plan} Account
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-blue-500/40 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name[0]
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-green-500 border-4 border-[#020617] flex items-center justify-center text-[10px] text-white">
                  <i className="fas fa-check"></i>
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black dark:text-white text-slate-900 tracking-tight">{user.name}</h2>
                <p className="text-slate-500 font-medium">{user.email}</p>
                <div className="flex gap-2 pt-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-900 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.role}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-900 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID: {user.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Dashboard Access */}
          {user.email === 'nexora@authenex.in' && (
            <div className="glass-panel p-1 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-2">
              <button
                onClick={() => setActiveTab('settings')}
                className="flex-1 p-4 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <i className="fas fa-shield-halved"></i>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold dark:text-white text-slate-900 group-hover:text-blue-500 transition-colors">Admin Dashboard</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Manage Users & Disputes</p>
                </div>
                <i className="fas fa-arrow-right text-slate-500 group-hover:text-blue-500 ml-auto mr-4 transition-colors"></i>
              </button>
            </div>
          )}

          {/* Credits & Subscription */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-[2rem] space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase text-blue-500 tracking-[0.2em]">{t('credits')}</h3>
                <i className="fas fa-bolt text-blue-500"></i>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-black dark:text-white text-slate-900">{user.credits}</span>
                  <span className="text-slate-500 text-xs font-bold mb-1">/ {user.totalCredits} API Calls</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-1000"
                    style={{ width: `${creditProgress}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Credits refill automatically on the 1st of every month. Premium users get priority forensic queuing.
                </p>
              </div>
              <button
                onClick={async () => {
                  if (window.confirm("Request a 1000 Credit Refill Pack? Needs Admin Approval.")) {
                    try {
                      await DbService.requestCredits({
                        userId: user.id,
                        userEmail: user.email,
                        amount: 1000,
                        packLabel: 'Pro Refill',
                        price: '$0'
                      });
                      alert("Request submitted! Admin will review it shortly.");
                    } catch (e) {
                      alert("Failed to submit request.");
                    }
                  }
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                Refill Credits
              </button>
            </div>

            <div className="glass-panel p-8 rounded-[2rem] space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase text-indigo-500 tracking-[0.2em]">Verification Badges</h3>
                <i className="fas fa-award text-indigo-500"></i>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Badge icon="fa-eye" label="Ocular" active={usageStats.image > 5} />
                <Badge icon="fa-microphone-lines" label="Acoustic" active={usageStats.audio > 2} />
                <Badge icon="fa-fingerprint" label="Hunter" active={totalVerifications > 10} />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Earn badges by completing forensic investigations across different media types.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="w-full md:w-80 space-y-6">
          <div className="glass-panel p-8 rounded-[2rem] space-y-6">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">Global Usage Log</h3>
            <div className="space-y-4">
              <StatRow label={t('img_scan')} value={usageStats.image} icon="fa-image" />
              <StatRow label={t('vid_detect')} value={usageStats.video} icon="fa-film" />
              <StatRow label={t('aud_check')} value={usageStats.audio} icon="fa-itunes-note" />
              <StatRow label={t('doc_forensic')} value={usageStats.document} icon="fa-file-lines" />
              <div className="pt-4 mt-4 border-t border-slate-800">
                <StatRow label={t('investigations')} value={totalVerifications} icon="fa-microscope" color="text-blue-500" />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] bg-indigo-600/5 border-indigo-500/20 space-y-4">
            <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{t('security_tip')}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              "{t('tip_text')}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, icon, color = "text-slate-400" }: { label: string, value: number, icon: string, color?: string }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <i className={`fas ${icon} text-xs w-4 ${color}`}></i>
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-sm font-black dark:text-white text-slate-900">{value}</span>
  </div>
);

const Badge = ({ icon, label, active }: { icon: string, label: string, active: boolean }) => (
  <div className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${active ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-slate-200 dark:bg-slate-900 border-slate-300 dark:border-slate-800 opacity-40 grayscale'}`}>
    <i className={`fas ${icon} text-lg ${active ? 'text-indigo-500' : 'text-slate-500'}`}></i>
    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500">{label}</span>
  </div>
);
