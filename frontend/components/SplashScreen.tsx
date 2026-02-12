
import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[200] bg-[#000000] flex flex-col items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">

        {/* Official Authenex Brand Logo Image - Updated to consistent version */}
        <div className="w-64 h-auto md:w-80 mb-12 relative flex justify-center">
          <img
            src="https://res.cloudinary.com/dyvmqkxok/image/upload/e_background_removal/f_png/v1770664374/WhatsApp_Image_2026-02-10_at_00.39.29_rzzhs5.jpg"
            alt="Authenex Logo"
            className="w-full h-auto object-contain animate-pulse-slow"
            onError={(e) => {
              // Fallback if the link fails
              (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/3503/3503943.png";
            }}
          />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-normal tracking-[0.6em] text-white uppercase ml-[0.6em] font-sans">
            AUTHENEX
          </h1>
          <div className="flex items-center justify-center gap-6 py-2">
            <p className="text-[10px] md:text-xs font-light text-slate-300 uppercase tracking-[0.5em] opacity-80">
              POWERED BY NEXORA
            </p>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="absolute -bottom-32 w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};
