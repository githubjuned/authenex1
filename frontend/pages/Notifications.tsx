
import React, { useState, useEffect } from 'react';
import { AnalysisHistory, NewsItem } from '../types';
import { ForensicService } from '../services/gemini';

interface NotificationsProps {
  history: AnalysisHistory[];
  t: (key: string) => string;
}

export const NotificationsPage: React.FC<NotificationsProps> = ({ history, t }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<'all' | 'detections' | 'news' | 'system'>('all');

  const fetchNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await ForensicService.getRecentDeepfakeNews();
      setNews(data);
    } catch (e) {
      console.error("News Fetch Error:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const systemAlerts = [
    { id: 'sys-1', type: 'system', title: 'Neural Engine Updated', desc: 'Gemini 3 Pro Vision nodes optimized for temporal artifacts.', time: '2h ago', severity: 'info' },
    { id: 'sys-2', type: 'system', title: 'Global Threat Level: Elevated', desc: 'New voice cloning campaign detected targeting financial sectors.', time: '5h ago', severity: 'warning' },
  ];

  const notifications = [
    ...systemAlerts,
    ...history.map(h => ({
      id: h.id,
      type: 'detections',
      title: `${h.result.verdict} Detected`,
      desc: `Analysis complete for ${h.result.modality}. AI Probability: ${h.result.aiPercentage}%`,
      time: new Date(h.timestamp).toLocaleString(),
      severity: h.result.verdict === 'DEEPFAKE' ? 'critical' : 'success'
    })),
    ...news.map((n, i) => ({
      id: `news-${i}`,
      type: 'news',
      title: n.title,
      desc: n.summary,
      time: n.date,
      severity: 'news'
    }))
  ].sort((a, b) => {
    if (a.type === 'news' && b.type !== 'news') return 1;
    if (a.type !== 'news' && b.type === 'news') return -1;
    return 0;
  });

  const filteredNotifications = notifications.filter(n => filter === 'all' || n.type === filter);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black dark:text-white text-slate-900 tracking-tighter uppercase">
            {t('inbox').split(' ')[0]} <span className="text-blue-500">{t('inbox').split(' ')[1]}</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Real-time analysis results and global security bulletins.</p>
        </div>
        
        <div className="flex bg-slate-200 dark:bg-slate-950 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
          {(['all', 'detections', 'news', 'system'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="py-20 text-center"><i className="fas fa-spinner fa-spin text-blue-500 text-2xl"></i></div>
        )}

        {error && filter === 'news' && (
           <div className="glass-panel p-10 rounded-[2rem] text-center space-y-4 border-red-500/20">
              <i className="fas fa-tower-broadcast text-red-500 text-3xl animate-pulse"></i>
              <p className="text-slate-400 text-sm font-medium">Neural Signal Overload. Unable to sync news feed.</p>
              <button onClick={fetchNews} className="px-6 py-2 bg-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">Retry Sync</button>
           </div>
        )}

        {filteredNotifications.map((notif) => (
          <div 
            key={notif.id} 
            className="glass-panel p-6 rounded-[2rem] border border-slate-300 dark:border-slate-800 hover:border-blue-500/30 transition-all group relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
              notif.severity === 'critical' ? 'bg-red-500' :
              notif.severity === 'success' ? 'bg-green-500' :
              notif.severity === 'warning' ? 'bg-orange-500' :
              notif.severity === 'info' ? 'bg-blue-500' : 'bg-slate-500'
            }`}></div>

            <div className="flex gap-6">
              <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${
                 notif.type === 'detections' ? 'bg-blue-500/10 text-blue-500' :
                 notif.type === 'system' ? 'bg-indigo-500/10 text-indigo-500' :
                 'bg-slate-500/10 text-slate-500'
              }`}>
                <i className={`fas ${
                  notif.type === 'detections' ? 'fa-microscope' :
                  notif.type === 'system' ? 'fa-server' :
                  'fa-newspaper'
                } text-lg`}></i>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-bold dark:text-white text-slate-900 group-hover:text-blue-500 transition-colors">
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold font-mono">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{notif.desc}</p>
                
                {notif.type === 'news' && (
                  <div className="pt-2 flex gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-[8px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/20">Verified Source</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-[8px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-800">Regional Node</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && !loading && !error && (
          <div className="py-32 text-center space-y-4 grayscale opacity-30">
            <i className="fas fa-inbox text-5xl text-slate-500"></i>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Clear for landing. No active alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
};
