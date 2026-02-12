
import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onPlusClick?: () => void;
  t: (key: string) => string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onPlusClick, t }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-[env(safe-area-inset-bottom)] px-4 pointer-events-none">
      <div className="relative flex items-end w-full max-w-lg pointer-events-auto mb-4">
        {/* The Navigation Bar Container */}
        <div className="w-full bg-[#0a0f18]/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] px-2 py-3 flex items-center justify-between">

          <div className="flex flex-1 justify-around items-center">
            <NavItem
              icon="fa-layer-group"
              label="Dash"
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <NavItem
              icon="fa-box-archive"
              label="Vault"
              active={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
            />
          </div>

          {/* Central Floating Action Button Area */}
          <div className="relative w-20 flex justify-center -top-8">
            <button
              onClick={onPlusClick}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_0_25px_rgba(29,110,247,0.5)] hover:scale-105 active:scale-90 transition-all border-4 border-[#0a0f18] group bg-[#1d6ef7]`}
            >
              <i className={`fas fa-fingerprint text-3xl transition-transform duration-300 ${activeTab === 'lab' ? 'scale-110' : 'group-hover:scale-110'}`}></i>
              <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping pointer-events-none"></div>
            </button>
          </div>

          <div className="flex flex-1 justify-around items-center">
            <NavItem
              icon="fa-envelope-open-text"
              label="Inbox"
              active={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
            />
            <NavItem
              icon="fa-shield-halved"
              label="Protect"
              active={activeTab === 'protect'}
              onClick={() => setActiveTab('protect')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 flex-1 py-1 active:opacity-60 ${active ? 'text-[#1d6ef7]' : 'text-slate-500'}`}
  >
    <i className={`fas ${icon} text-lg md:text-xl ${active ? 'scale-110' : ''}`}></i>
    <span className="text-[8px] font-black uppercase tracking-widest">
      {label}
    </span>
  </button>
);
