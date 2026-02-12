
import React, { useState } from 'react';
import { Language } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onLoginClick?: (mode: 'login' | 'register') => void;
  onLogoClick?: () => void;
  isLoggedIn?: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  onProfileClick?: () => void;
  userPhoto?: string;
}

const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'ta', name: 'தமிழ்' },
];

export const Layout: React.FC<LayoutProps> = ({ children, onLoginClick, onLogoClick, isLoggedIn, theme, toggleTheme, language, setLanguage, t, onProfileClick, userPhoto }) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <div className={`flex flex-col h-full transition-colors duration-300 ${theme === 'dark' ? 'bg-transparent text-slate-200' : 'bg-slate-50 text-slate-900'} relative overflow-hidden`}>
      {/* Safe Area Top Padding for Mobile Status Bars */}
      <div className="h-[env(safe-area-inset-top)] w-full bg-[#020617]/40 backdrop-blur-xl"></div>

      <header className="z-50 px-4 md:px-10 py-4 flex justify-between items-center bg-[#020617]/40 backdrop-blur-xl border-b border-white/5 shrink-0">
        <div
          className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0 group active:scale-95 transition-transform"
          onClick={onLogoClick}
        >
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dyvmqkxok/image/upload/e_background_removal/f_png/v1770664374/WhatsApp_Image_2026-02-10_at_00.39.29_rzzhs5.jpg"
              alt="Authenex Logo"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-lg md:text-xl font-normal tracking-[0.3em] leading-none dark:text-white text-slate-900 uppercase font-sans">
              AUTHENEX
            </h1>
            <p className="text-[6px] md:text-[7px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1 leading-none">
              POWERED BY NEXORA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-400 active:scale-90"
          >
            <i className="fas fa-globe text-xs"></i>
          </button>

          {showLangMenu && (
            <div className="absolute right-4 top-20 w-44 glass-panel rounded-2xl shadow-2xl py-2 z-[60] border border-white/10 animate-in fade-in zoom-in duration-200">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600/10 transition-colors ${language === lang.code ? 'text-blue-500' : 'text-slate-400'}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}

          {!isLoggedIn ? (
            <button
              onClick={() => onLoginClick?.('register')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full transition-all shadow-lg active:scale-90 flex items-center gap-2"
            >
              <span>JOIN</span>
            </button>
          ) : (
            <button
              onClick={onProfileClick}
              className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white border border-white/10 shadow-lg active:scale-95 transition-transform overflow-hidden"
            >
              {userPhoto ? (
                <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
              ) : (
                "A"
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content shell - actual scroll logic is now inside App.tsx to handle ref and results */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};
