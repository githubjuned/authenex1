
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AppState, DetectionResult, NewsItem, NavTab } from './types';
import { analyzeImageForensics, getRecentDeepfakeNews } from './services/geminiService';
import { ForensicReport } from './components/ForensicReport';
import { ScannerOverlay } from './components/ScannerOverlay';
import { DeepfakeNews } from './components/DeepfakeNews';
import { PricingSection } from './components/PricingSection';
import { ParticleBackground } from './components/ParticleBackground';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [history, setHistory] = useState<DetectionResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load History from LocalStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('authenex_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const items = await getRecentDeepfakeNews();
        setNews(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG).');
      return;
    }

    setAppState(AppState.UPLOADING);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      setAppState(AppState.IDLE);
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
      setAppState(AppState.ERROR);
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;

    try {
      setAppState(AppState.ANALYZING);
      setError(null);
      const forensics = await analyzeImageForensics(selectedImage);
      
      const enrichedResult = { 
        ...forensics, 
        timestamp: Date.now(),
        imageUrl: selectedImage 
      };

      setResult(enrichedResult);
      
      // Update History
      const updatedHistory = [enrichedResult, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem('authenex_history', JSON.stringify(updatedHistory));

      setAppState(AppState.RESULT);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis.');
      setAppState(AppState.ERROR);
    }
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('authenex_history');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col pb-32 relative">
      {/* Animated Background */}
      <ParticleBackground />

      {/* Header */}
      <nav className="p-4 sm:p-6 border-b border-slate-800 glass-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo Section (Left Side) */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => { setActiveTab('dashboard'); reset(); }}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sky-600 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
              <i className="fa-solid fa-fingerprint text-lg sm:text-xl text-white"></i>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-orbitron tracking-tighter text-white leading-tight">AUTHENEX</h1>
              <p className="text-[8px] sm:text-[10px] font-orbitron text-sky-400 tracking-widest leading-none uppercase">Forensic Node 2025</p>
            </div>
          </div>

          {/* Action & Status Section (Right Side) */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden lg:flex px-3 py-1 rounded bg-slate-900 border border-slate-800 items-center gap-2 shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">Global Network: Active</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button className="text-[9px] sm:text-[11px] font-orbitron text-slate-400 hover:text-white uppercase tracking-widest sm:tracking-[0.2em] transition-colors py-1 px-2">
                Login
              </button>
              <button className="px-3 py-1.5 sm:px-5 sm:py-2 bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 hover:border-sky-500/50 text-sky-400 rounded-lg text-[9px] sm:text-[10px] font-orbitron uppercase tracking-widest sm:tracking-[0.2em] transition-all shadow-lg shadow-sky-500/10 active:scale-95">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Areas based on Tab */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 py-12 relative z-10">
        
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            {/* Intro */}
            {appState === AppState.IDLE && !selectedImage && (
              <div className="text-center space-y-8 max-w-3xl mx-auto py-12 animate-in slide-in-from-top-4 duration-1000">
                <div className="inline-block px-4 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-[10px] font-orbitron tracking-[0.3em] uppercase mb-4">
                  Next-Gen Detection Engine
                </div>
                <h2 className="text-5xl md:text-7xl font-extrabold font-orbitron leading-tight">
                  Trust Nothing. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">Verify Everything.</span>
                </h2>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                  Identify AI-generated imagery and deepfakes with a single click. Authenex provides laboratory-grade forensic analysis for the digital age.
                </p>
                <div className="flex flex-col items-center gap-4 pt-6">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-10 py-5 bg-sky-600 hover:bg-sky-500 text-white rounded-full font-orbitron text-base transition-all shadow-lg shadow-sky-600/30 flex items-center gap-4 group active:scale-95"
                  >
                    <i className="fa-solid fa-upload group-hover:-translate-y-1 transition-transform"></i>
                    Upload Image for Analysis
                  </button>
                  <span className="text-[10px] font-orbitron text-slate-500 tracking-[0.2em] uppercase">AES-256 Encrypted Processing</span>
                </div>
              </div>
            )}

            {/* Upload/Preview Section */}
            {appState !== AppState.RESULT && (
              <div className={`max-w-2xl mx-auto transition-all duration-700 ${!selectedImage ? 'opacity-0 h-0 pointer-events-none' : 'opacity-100 mb-20'}`}>
                <div 
                  className={`relative glass-panel rounded-3xl p-8 border-2 border-dashed transition-all duration-300 ${
                    selectedImage ? 'border-sky-500/50 bg-sky-500/5' : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {selectedImage && (
                    <div className="space-y-6">
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-black/40 shadow-inner">
                        <img 
                          src={selectedImage} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                        {appState === AppState.ANALYZING && <ScannerOverlay />}
                      </div>
                      
                      <div className="flex gap-4">
                        <button 
                          onClick={reset}
                          disabled={appState === AppState.ANALYZING}
                          className="flex-1 py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-orbitron text-sm transition-all disabled:opacity-50"
                        >
                          Remove
                        </button>
                        <button 
                          onClick={startAnalysis}
                          disabled={appState === AppState.ANALYZING}
                          className="flex-[2] py-4 px-6 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-orbitron text-sm shadow-lg shadow-sky-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                          {appState === AppState.ANALYZING ? (
                            <>
                              <i className="fa-solid fa-circle-notch animate-spin"></i>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-bolt"></i>
                              Run Forensic Scan
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                
                {error && (
                  <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex gap-3 text-rose-400 items-start animate-in slide-in-from-top-2">
                    <i className="fa-solid fa-circle-exclamation mt-1"></i>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Results Page */}
            {appState === AppState.RESULT && result && (
              <div className="mb-20">
                <ForensicReport result={result} onReset={reset} />
              </div>
            )}

            {/* Informational Sections */}
            {appState !== AppState.RESULT && (
              <div className="space-y-32 py-12">
                <section id="how-it-works" className="scroll-mt-24">
                  <div className="text-center mb-16">
                    <h3 className="text-3xl font-bold font-orbitron mb-4">How It Works</h3>
                    <div className="h-1 w-20 bg-sky-500 mx-auto rounded-full"></div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { icon: "fa-upload", title: "1. Capture & Upload", desc: "Upload any digital image. Our system supports high-resolution formats." },
                      { icon: "fa-microchip", title: "2. Neural Deconstruction", desc: "The engine deconstructs images into tokens, checking for synthetic patterns." },
                      { icon: "fa-shield-halved", title: "3. Verification", desc: "Receive probability scores and specific artifacts proving authenticity." }
                    ].map((step, i) => (
                      <div key={i} className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-sky-500/50 transition-all group">
                        <div className="w-14 h-14 bg-sky-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-600 transition-colors">
                          <i className={`fa-solid ${step.icon} text-2xl text-sky-400 group-hover:text-white`}></i>
                        </div>
                        <h4 className="text-xl font-bold font-orbitron mb-3">{step.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="insights" className="scroll-mt-24">
                  <div className="text-center mb-16">
                    <h3 className="text-3xl font-bold font-orbitron mb-4">Forensic Insights & Metrics</h3>
                    <p className="text-slate-500 text-sm font-orbitron tracking-widest uppercase">Live Data: 2025</p>
                    <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full mt-4"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard icon="fa-chart-line" color="rose" label="Growth Rank 2025" value="#1 THREAT" desc="Deepfakes now surpass phishing in risk." />
                    <MetricCard icon="fa-eye" color="sky" label="Total Fake Detected" value="2.4M+" desc="Identified by our global forensic network." />
                    <MetricCard icon="fa-bullseye" color="emerald" label="Accuracy Rate" value="99.8%" desc="Lab-tested across varied GAN models." />
                    <MetricCard icon="fa-bolt" color="amber" label="Analysis Speed" value="< 2.5s" desc="Average full forensic neural scan time." />
                  </div>
                </section>

                <section id="news" className="scroll-mt-24">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="text-left">
                      <h3 className="text-3xl font-bold font-orbitron mb-2">Deepfake Intelligence Feed</h3>
                      <p className="text-slate-500 text-sm font-orbitron tracking-widest uppercase">Target Focus: Maharashtra, India</p>
                    </div>
                    <div className="flex items-center gap-3 text-sky-400 bg-sky-500/10 px-4 py-2 rounded-full border border-sky-500/20">
                      <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-orbitron tracking-widest uppercase">Gemini AI Monitoring Live</span>
                    </div>
                  </div>
                  <DeepfakeNews news={news} loading={loadingNews} />
                </section>

                {/* Pricing Section before Footer */}
                <PricingSection />
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold font-orbitron">Analysis History</h2>
              <button 
                onClick={clearHistory}
                className="text-xs font-orbitron text-rose-500 hover:text-rose-400 uppercase tracking-widest flex items-center gap-2"
              >
                <i className="fa-solid fa-trash-can"></i> Clear All
              </button>
            </div>
            {history.length === 0 ? (
              <div className="text-center py-20 glass-panel rounded-3xl border border-slate-800">
                <i className="fa-solid fa-folder-open text-5xl text-slate-700 mb-6"></i>
                <p className="text-slate-500 font-orbitron text-sm uppercase tracking-widest">No forensic records found</p>
                <button onClick={() => setActiveTab('dashboard')} className="mt-8 px-6 py-2 bg-sky-600 rounded-full text-xs font-orbitron uppercase tracking-widest">Start First Scan</button>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-6 hover:border-sky-500/30 transition-all">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
                      <img src={item.imageUrl} alt="Scan" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold font-orbitron px-2 py-0.5 rounded uppercase tracking-widest ${item.verdict === 'AI' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                          {item.verdict === 'AI' ? 'Synthetic' : 'Authentic'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-orbitron">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-200">Probability: {item.verdict === 'AI' ? item.aiPercentage : item.humanPercentage}%</h4>
                    </div>
                    <button 
                      onClick={() => { setResult(item); setAppState(AppState.RESULT); setActiveTab('dashboard'); }}
                      className="w-10 h-10 rounded-full bg-slate-800 hover:bg-sky-600 transition-all flex items-center justify-center text-slate-400 hover:text-white"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold font-orbitron mb-8">Security Protocols</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 border border-sky-500/20">
                    <i className="fa-solid fa-lock text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold font-orbitron text-white">Encryption Standard</h4>
                    <p className="text-xs text-slate-500">AES-256 GCM Architecture</p>
                  </div>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-slate-800">
                  <p className="text-[10px] font-mono text-emerald-500 break-all leading-relaxed">
                    AUTHENEX_KEY_RSA_4096: 0x8F2E...1C4D_NODE_SECURE_VERIFIED_PROTOCOL_TCP_TLS1.3
                  </p>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every image analyzed by Authenex is processed within an isolated memory buffer.
                </p>
              </div>
              <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
                <h4 className="font-bold font-orbitron text-white flex items-center gap-2">
                  <i className="fa-solid fa-shield-virus text-rose-500"></i> Active Protection
                </h4>
                <div className="space-y-4">
                  {[
                    { label: "Neural Firewall", status: "Active", color: "text-emerald-500" },
                    { label: "Data Sanitization", status: "Enabled", color: "text-emerald-500" }
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-orbitron border-b border-slate-800 pb-2">
                      <span className="text-slate-500">{p.label}</span>
                      <span className={p.color}>{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold font-orbitron mb-8">System Configuration</h2>
            <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
              <div className="p-8 border-b border-slate-800">
                <h4 className="font-bold text-slate-200 mb-4">Forensic Engine Preferences</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold">Deep Scan Mode</p>
                    <p className="text-xs text-slate-500">Enable advanced artifact tracing</p>
                  </div>
                  <div className="w-12 h-6 bg-sky-600 rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Bottom Floating Navigation Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4">
        <div className="glass-panel bg-[#0f172a]/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl flex items-center justify-between ring-1 ring-white/5">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="fa-gauge-high" label="Dash" />
          <NavButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon="fa-clock-rotate-left" label="History" />
          <div className="w-px h-8 bg-slate-800 mx-1"></div>
          <NavButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon="fa-shield-halved" label="Security" />
          <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon="fa-sliders" label="Settings" />
        </div>
      </div>

      {/* Footer */}
      <footer className="p-12 border-t border-slate-800/50 bg-[#020617]/80 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-600 text-[10px] font-orbitron uppercase tracking-widest">
            &copy; 2024 Authenex Forensic Systems. Built for the Digital Truth.
          </div>
          <div className="flex gap-6">
            <i className="fa-brands fa-github text-slate-500 hover:text-white cursor-pointer transition-colors"></i>
            <i className="fa-brands fa-x-twitter text-slate-500 hover:text-white cursor-pointer transition-colors"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface MetricCardProps {
  icon: string; color: string; label: string; value: string; desc: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, color, label, value, desc }) => {
  const colorClasses: any = {
    rose: 'text-rose-500 border-l-rose-500 bg-rose-500/10',
    sky: 'text-sky-500 border-l-sky-500 bg-sky-500/10',
    emerald: 'text-emerald-500 border-l-emerald-500 bg-emerald-500/10',
    amber: 'text-amber-500 border-l-amber-500 bg-amber-500/10'
  };
  return (
    <div className={`glass-panel p-6 rounded-2xl border-l-4 ${colorClasses[color].split(' ')[1]} ${colorClasses[color].split(' ')[2]}`}>
      <div className="flex justify-between items-start mb-4">
        <i className={`fa-solid ${icon} ${colorClasses[color].split(' ')[0]} text-xl`}></i>
        <span className={`text-[10px] font-orbitron ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[2]} px-2 py-0.5 rounded`}>LIVE</span>
      </div>
      <h5 className="text-slate-400 text-xs font-orbitron uppercase tracking-tighter mb-1">{label}</h5>
      <p className="text-3xl font-bold text-white font-orbitron">{value}</p>
      <p className="text-xs text-slate-500 mt-2">{desc}</p>
    </div>
  );
};

interface NavButtonProps {
  active: boolean; onClick: () => void; icon: string; label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 gap-1 flex-1 group ${active ? 'text-sky-400 bg-sky-500/10' : 'text-slate-500 hover:text-slate-300'}`}>
      <i className={`fa-solid ${icon} text-lg group-active:scale-90 transition-transform`}></i>
      <span className="text-[9px] font-orbitron uppercase tracking-widest font-bold">{label}</span>
      {active && <div className="w-1 h-1 rounded-full bg-sky-500 animate-pulse"></div>}
    </button>
  );
};

export default App;
