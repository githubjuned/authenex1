
import React, { useEffect, useState } from 'react';
import { ForensicService } from '../services/gemini';
import { NewsItem } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { TiltCard } from './TiltCard';

interface NewsFeedProps {
  t: (key: string) => string;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ t }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ForensicService.getRecentDeepfakeNews();
      setNews(data);
    } catch (e: any) {
      console.error("Intelligence Feed Error:", e);
      setError(e.message || "Unknown Connection Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-8">
        <div className="flex justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-white uppercase tracking-widest animate-pulse">Scouring Global Intelligence...</h3>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Tracking Regional Deepfake Incidents • Establishing Neural Link</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
          <i className="fas fa-plug-circle-xmark text-red-500 text-2xl"></i>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Intelligence Link Interrupted</h3>
          <p className="text-slate-500 text-sm font-medium">Regional forensic nodes are currently overloaded.</p>
          <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30 text-left overflow-auto max-h-40">
            <p className="text-red-400 font-mono text-xs">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchNews}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl active:scale-95"
        >
          Re-initialize Intelligence
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
            {t('intel').split(' ')[0]} <span className="text-blue-500">{t('intel').split(' ')[1]}</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium">Regional Deepfake Threat Archive (2024-2025)</p>
        </div>
        <div className="hidden sm:flex bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Threat Map</span>
        </div>
      </div>

      {news.length === 0 && !loading && !error && (
        <div className="text-center py-20 opacity-50">
          <i className="fas fa-satellite-dish text-4xl mb-4 text-slate-600"></i>
          <p className="text-slate-500 font-mono text-sm">NO INTELLIGENCE DATA INTERCEPTED</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 px-4">
        {news.map((item, idx) => (
          <ScrollReveal key={idx} animation="slide-up" delay={idx * 0.1} className="h-full">
            <TiltCard className="h-full">
              <div className="glass-panel rounded-[2.5rem] border-slate-800 hover:border-blue-500/30 transition-all group overflow-hidden flex flex-col md:flex-row h-full">
                {/* News Image Side */}
                <div className="w-full md:w-[350px] lg:w-[450px] h-[250px] md:h-auto overflow-hidden relative shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0f18]/90 hidden md:block"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] to-transparent md:hidden"></div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="px-2 py-1 bg-red-600/80 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded">ALERT</span>
                  </div>
                </div>

                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                      <span className="text-blue-400">{item.location}</span>
                      <span className="text-slate-700">•</span>
                      <span className="text-slate-500">{item.date}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm font-medium">
                      {item.summary}
                    </p>
                    <div className="pt-4 flex flex-wrap gap-4">
                      {item.sources.map((src, sidx) => (
                        <a
                          key={sidx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors border border-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-800"
                        >
                          <i className="fas fa-arrow-up-right-from-square"></i>
                          {src.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>

      <div className="glass-panel mx-4 p-6 rounded-[2rem] bg-blue-500/5 border-blue-500/20 text-center">
        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">
          Grounding analysis powered by Gemini 3 Pro Search Tools
        </p>
      </div>
    </div>
  );
};
