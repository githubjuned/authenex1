
import React, { useState, useRef, useEffect } from 'react';
import { ScrollReveal } from './components/ScrollReveal';
import { Layout } from './components/Layout';
import { ResultDisplay } from './components/ResultDisplay';
import { NewsFeed } from './components/NewsFeed';
import { BottomNav } from './components/BottomNav';
import { AuthPage } from './pages/Auth';
import { ProfilePage } from './pages/Profile';
import { NotificationsPage } from './pages/Notifications';
import { AdminDashboard } from './pages/AdminDashboard';
import { LegalPage } from './pages/Legal';
import { ProtectLanding } from './pages/ProtectLanding';
import { ProtectRegister } from './pages/ProtectRegister';
import { ProtectDisputes } from './pages/ProtectDisputes';
import { MyProtectedContent } from './pages/MyProtectedContent';
import { VerifySuspicious } from './pages/VerifySuspicious';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { WhitePaper } from './pages/WhitePaper';
import { ForensicMethodology } from './components/ForensicMethodology';
import { ChatBot } from './components/ChatBot';
import { LandingPage } from './components/LandingPage';
import { SplashScreen } from './components/SplashScreen';
import { DashboardStats } from './components/DashboardStats';
import { Testimonials } from './components/Testimonials';
import { CreditPurchase } from './components/CreditPurchase';
import { ForensicService } from './services/gemini';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { DetectionResult, AnalysisHistory, Modality, TabType, User, Language, FraudAlert } from './types';
import { ParticleBackground } from './components/ParticleBackground';
import { translations } from './translations';

import { DbService } from './services/db';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [modality, setModality] = useState<Modality>('image');
  const [preview, setPreview] = useState<string | null>(null);
  const [stagedFile, setStagedFile] = useState<{ base64: string; mimeType: string } | null>(null);
  const [fileMetadata, setFileMetadata] = useState<{ name: string; size: string } | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<AnalysisHistory[]>(() => {
    const saved = localStorage.getItem('authenex_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authData, setAuthData] = useState<{ email: string, mode: 'login' | 'register' }>({ email: '', mode: 'login' });

  const [alerts, setAlerts] = useState<FraudAlert[]>([
    { id: '1', timestamp: new Date().toISOString(), reason: 'Bot-like typing detected', email: 'suspicious_node_42@temp.io' },
    { id: '2', timestamp: new Date().toISOString(), reason: 'Injecting camera stream', email: 'external_actor@vpn.net' }
  ]);

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('authenex_language') as Language) || 'en';
  });

  const t = (key: string) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 3500);
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      console.log("Auth State Changed:", authUser ? "User found" : "No user");
      if (authUser) {
        setIsLoggedIn(true);
        setAuthData({ email: authUser.email || '', mode: 'login' });

        try {
          // Fetch User Data from DB
          let dbUser = await DbService.getUser(authUser.uid);
          console.log("DbUser fetched:", dbUser);

          if (!dbUser) {
            console.log("Creating new user...");
            // Initialize new user if not exists
            dbUser = {
              id: authUser.uid,
              name: authUser.displayName || 'Agent',
              email: authUser.email || '',
              role: 'user',
              plan: 'Pro', // Upgraded default plan as well since they get 1000 credits
              credits: 1000,
              totalCredits: 1000,
              riskScore: 0,
              createdAt: new Date().toISOString(),
              photoURL: authUser.photoURL || undefined
            };
            await DbService.saveUser(dbUser);
          } else {


            // Sync PhotoURL if new one is available
            if (authUser.photoURL && dbUser.photoURL !== authUser.photoURL) {
              console.log("Updating user photo...");
              dbUser.photoURL = authUser.photoURL;
              await DbService.saveUser(dbUser);
            }
          }

          console.log("Setting user state to:", dbUser);
          setUser(dbUser);

          // Fetch History
          try {
            const userHistory = await DbService.getUserHistory(authUser.uid);
            console.log("Fetched history:", userHistory);
            if (userHistory) {
              setHistory(userHistory);
            }
          } catch (historyError) {
            console.error("Failed to fetch history:", historyError);
            // Keep local history if fetch fails
          }
        } catch (error: any) {
          console.error("Database connection failed:", error);
          setIsOffline(true); // Enable offline mode indicator

          // Fallback: Use basic auth info so the app still works
          setUser({
            id: authUser.uid,
            name: authUser.displayName || 'Agent',
            email: authUser.email || '',
            role: 'user',
            plan: 'Pro',
            credits: 1000,
            totalCredits: 1000,
            riskScore: 0,
            createdAt: new Date().toISOString(),
            photoURL: authUser.photoURL || undefined
          });
        }

        setHasStarted(true);
      } else {
        console.log("User logged out");
        setIsLoggedIn(false);
        setUser(prev => ({ ...prev, id: '', name: 'Guest' })); // Reset to guest
        setHistory([]);
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('authenex_language', language);
  }, [language]);

  const [user, setUser] = useState<User>({
    id: '',
    name: 'Guest',
    email: '',
    role: 'user',
    plan: 'Basic',
    credits: 10,
    totalCredits: 100,
    riskScore: 0,
    createdAt: new Date().toISOString()
  });

  const [users, setUsers] = useState<User[]>([]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('authenex_theme') as 'light' | 'dark' || 'dark';
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('authenex_theme', theme);
  }, [theme]);

  // Keep local storage sync as backup/cache
  useEffect(() => {
    localStorage.setItem('authenex_history', JSON.stringify(history));
  }, [history]);

  // Fetch Admin Data when Settings tab is active
  useEffect(() => {
    if (activeTab === 'settings' && user.id) {
      const fetchAdminData = async () => {
        console.log("Fetching admin data...");
        try {
          const [fetchedUsers, fetchedAlerts] = await Promise.all([
            DbService.getAllUsers(),
            DbService.getAlerts()
          ]);

          if (fetchedUsers.length > 0) {
            setUsers(fetchedUsers);
          }
          if (fetchedAlerts.length > 0) {
            setAlerts(fetchedAlerts);
          }
        } catch (error) {
          console.error("Failed to fetch admin data:", error);
        }
      };
      fetchAdminData();
    }
  }, [activeTab, user.id]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handlePurchase = async (amount: number, packLabel: string, price: string) => {
    if (!user.id) return alert("Please login to purchase credits.");

    try {
      await DbService.requestCredits({
        userId: user.id,
        userEmail: user.email,
        amount,
        packLabel,
        price
      });
      alert(`Request sent for ${packLabel} (${amount} credits). Admin will review it shortly.`);
    } catch (error) {
      console.error("Purchase request failed:", error);
      alert("Failed to send request. Please try again.");
    }
  };

  // Scroll to top of content area on result or tab change
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const initiateAnalysis = async () => {
    console.log("Initiating analysis. User state:", user);
    if (!stagedFile) return;
    if (!user.id) {
      console.error("User ID missing. Access denied.");
      alert("Please login to perform analysis.");
      return;
    }
    if (user.credits < 10) {
      alert("Insufficient credits.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    const startTime = Date.now();
    try {
      const forensicResult = await ForensicService.analyzeMedia(stagedFile.base64, stagedFile.mimeType, modality);
      const speed = ((Date.now() - startTime) / 1000).toFixed(3);
      const enhancedResult = { ...forensicResult, analysisSpeed: speed + 'S' };

      // Compress image for storage/history to avoid Firestore 1MB limit
      const compressImage = (base64Str: string, maxWidth = 300, quality = 0.7): Promise<string> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = base64Str;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          };
          img.onerror = () => {
            // Fallback if compression fails
            resolve(base64Str);
          }
        });
      };

      // Save to Cloud Storage & DB
      let newHistoryItem: AnalysisHistory | null = null;
      try {
        // Create a thumbnail for history
        let thumbnailBase64: string | null = null; // Default to null for large files/videos

        if (stagedFile.mimeType.startsWith('image/')) {
          try {
            // Always compress images
            thumbnailBase64 = await compressImage(stagedFile.base64);
            console.log("Image compressed for history. Original size:", stagedFile.base64.length, "New size:", thumbnailBase64.length);
          } catch (compError) {
            console.warn("Compression failed, using original", compError);
            thumbnailBase64 = stagedFile.base64.length < 500000 ? stagedFile.base64 : null; // Fallback safety
          }
        } else {
          // For Video/Audio, do NOT send the base64 as thumbnail. 
          // It's too big for Firestore and unnecessary for history icon.
          console.log("Skipping thumbnail generation for non-image modality:", modality);
          thumbnailBase64 = null;
        }

        // Pass thumbnailBase64 (which is now null for videos) to saveAnalysis. 
        // Note: modify DbService.saveAnalysis simply passes it through.
        // We need to cast null to string if the type expects string, or update the service.
        // Checking DbService... it likely expects string. We can pass a placeholder string if needed.
        const safeThumbnail = thumbnailBase64 || "";

        newHistoryItem = await DbService.saveAnalysis(user.id, enhancedResult, safeThumbnail, stagedFile.mimeType);

        // Update Credits
        const newCredits = Math.max(0, user.credits - 10);
        setUser(prev => ({ ...prev, credits: newCredits }));
        await DbService.updateUserCredits(user.id, newCredits);

        // Add to local history state immediately to reflect in UI
        if (newHistoryItem) {
          setHistory(prev => [newHistoryItem!, ...prev]);
        }

      } catch (dbError) {
        console.error("Failed to save analysis to DB:", dbError);
        // Create a local history item if DB fails, so the UI still updates for this session
        newHistoryItem = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          thumbnail: stagedFile.base64, // Use original locally if DB save failed
          result: enhancedResult
        };
        // Still add to local history so user sees it
        setHistory(prev => [newHistoryItem!, ...prev]);
      }


      // Update Local State (Always show result!)
      setResult(enhancedResult);
      setTimeout(scrollToTop, 100);

      if (newHistoryItem) {
        setHistory(prev => [newHistoryItem!, ...prev]);
      }

    } catch (err) {
      handleApiError(err);
    } finally {
      setIsAnalyzing(false);
      setStagedFile(null);
    }
  };

  const handleApiError = (err: any) => {
    const errMsg = err?.message || String(err);
    alert(`Security Engine Alert: ${errMsg}.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileMetadata({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB'
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setStagedFile({ base64: reader.result, mimeType: file.type });
          setPreview(reader.result);
          setResult(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetStaging = () => {
    setStagedFile(null);
    setPreview(null);
    setFileMetadata(null);
    setResult(null);
  };

  const startAuth = (mode: 'login' | 'register') => {
    setAuthData({ email: '', mode });
    setIsAuthenticating(true);
    setHasStarted(true);
  };

  const handleLogoClick = () => {
    setActiveTab('dashboard');
    scrollToTop();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.reload(); // Force reload to clear any state/cache issues
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleClearHistory = async () => {
    if (!user.id) return;
    if (!window.confirm("Are you sure you want to permanently delete all your analysis history? This cannot be undone.")) return;

    try {
      await DbService.clearUserHistory(user.id);
      setHistory([]);
      alert("Vault cleared successfully.");
    } catch (error) {
      console.error("Failed to clear history:", error);
      alert("Failed to clear history. Please try again.");
    }
  };

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto space-y-20 py-8 relative z-10 px-4">
      <section className="text-center space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="space-y-8 flex flex-col items-center">
          {/* Laboratory 2.0 Online Bar - Blinking */}
          <div className="animate-pulse flex items-center gap-3 px-6 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_12px_#10b981]"></div>
            <span className="text-[10px] md:text-[12px] font-black text-emerald-500 uppercase tracking-[0.5em]">{t('lab_online')}</span>
          </div>

          {isOffline && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10">
              <i className="fas fa-plug-circle-xmark text-red-500 text-xs"></i>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Database Offline - History Not Saving</span>
            </div>
          )}

          {/* Split Heading: Part 1 White, Part 2 Modern Gradient */}
          <h1 className="text-5xl md:text-[7rem] font-black tracking-tighter leading-[1.0] uppercase max-w-4xl mx-auto font-modern">
            <span className="block mb-2 text-white">{t('slogan_part1')}</span>
            <span className="modern-slogan-gradient">
              {t('slogan_part2')}
            </span>
          </h1>
        </div>
        <ScrollReveal animation="zoom" delay={0.2}>
          <div className="flex justify-end px-4 mb-2">
            <button
              onClick={async () => {
                if (!user.id) return alert("Not logged in");
                try {
                  console.log("Fetching history for: " + user.id);
                  const data = await DbService.getUserHistory(user.id);
                  console.log("Fetch complete. Found items: " + (data ? data.length : 'null'));
                  setHistory(data || []);
                } catch (e: any) {
                  console.error("Fetch failed: " + e.message);
                }
              }}
              className="text-xs text-cyan-500 hover:text-cyan-400 font-bold uppercase tracking-widest border border-cyan-500/30 px-3 py-1 rounded-lg bg-cyan-500/10"
            >
              <i className="fas fa-sync-alt mr-2"></i> DEBUG: Refresh Stats
            </button>
          </div>
          <DashboardStats history={history} t={t} />
        </ScrollReveal>
      </section>

      <ScrollReveal animation="fade">
        <Testimonials />
      </ScrollReveal>

      <section id="intel">
        <ScrollReveal animation="slide-up">
          <NewsFeed t={t} />
        </ScrollReveal>
      </section>

      <section>
        <ScrollReveal animation="slide-up">
          <ForensicMethodology t={t} />
        </ScrollReveal>
      </section>

      <section id="credits">
        <ScrollReveal animation="zoom">
          <CreditPurchase user={user} onPurchase={handlePurchase} t={t} />
        </ScrollReveal>
      </section>
    </div>
  );

  const renderLab = () => {
    if (result) {
      return (
        <div className="max-w-5xl mx-auto py-8 relative z-[20] px-4">
          <ResultDisplay
            result={result}
            onReset={() => {
              setResult(null);
              setPreview(null);
              setStagedFile(null);
            }}
            t={t}
          />
        </div>
      );
    }

    if (isAnalyzing || stagedFile) {
      return (
        <div className="max-w-4xl mx-auto py-10 md:py-20 px-4 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="glass-panel bg-[#0b1424] rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-slate-800/50 flex flex-col md:flex-row gap-8 md:gap-10 items-stretch">
            <div className="relative w-full md:w-[400px] aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-black/40 border border-cyan-500/20 shadow-inner group">
              {preview && (
                <img src={preview} alt="Scanning Preview" className="w-full h-full object-cover opacity-60" />
              )}
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                <span className="text-cyan-400 text-[10px] md:text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                  {isAnalyzing ? t('status_scanning') : 'DATA STAGED'}
                </span>
              </div>

              {/* Animation Overlay */}
              {isAnalyzing && (
                <>
                  <div className="animate-scan"></div>
                  <div className="absolute inset-0 scan-grid pointer-events-none"></div>
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-cyan-500/50 text-cyan-400 font-mono text-xs md:text-sm font-bold tracking-widest animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      <i className="fas fa-microchip mr-2 animate-spin-slow"></i>
                      ANALYZING ARTIFACTS...
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">FORENSIC DOSSIER</h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button onClick={resetStaging} className="flex-1 py-4 bg-slate-900 text-slate-500 rounded-2xl font-bold uppercase text-[10px] md:text-xs border border-slate-800">ABORT</button>
                <button onClick={initiateAnalysis} disabled={isAnalyzing} className="flex-[2] py-4 bg-cyan-600 rounded-2xl text-white font-bold uppercase text-[10px] md:text-xs flex items-center justify-center gap-3">
                  {isAnalyzing ? <span>{t('analyzing')}</span> : <span>START SCAN</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const modalityConfigs: Record<Modality, { icon: string; label: string; accept: string }> = {
      image: { icon: 'fa-image', label: t('img_scan'), accept: 'image/*' },
      video: { icon: 'fa-film', label: t('vid_detect'), accept: 'video/*' },
      audio: { icon: 'fa-microphone-lines', label: t('aud_check'), accept: 'audio/*' },
      document: { icon: 'fa-file-lines', label: t('doc_forensic'), accept: 'application/pdf,text/plain' }
    };

    return (
      <div className="max-w-4xl mx-auto py-12 md:py-20 px-4 space-y-8 md:space-y-12 animate-in fade-in zoom-in duration-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {(Object.keys(modalityConfigs) as Modality[]).map((key) => (
            <button key={key} onClick={() => setModality(key)} className={`p-4 md:p-6 rounded-xl md:rounded-2xl font-bold transition-all border flex flex-col items-center gap-2 md:gap-3 shadow-sm ${modality === key ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}>
              <i className={`fas ${modalityConfigs[key].icon} text-lg md:text-xl`}></i>
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest">{modalityConfigs[key].label}</span>
            </button>
          ))}
        </div>
        <div className="group relative glass-panel p-10 md:p-16 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-slate-800 hover:border-cyan-500 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} accept={modalityConfigs[modality].accept} onChange={handleFileUpload} className="hidden" />
          <i className={`fas ${modalityConfigs[modality].icon} text-2xl md:text-3xl mb-4 text-slate-500`}></i>
          <p className="text-white font-bold text-lg md:text-xl uppercase tracking-tight">Drop Forensic Asset</p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    // 1. Allow Legal Pages to be viewed without login
    if (['privacy', 'terms', 'whitepaper'].includes(activeTab)) {
      return (
        <div className="min-h-screen bg-[#020617] relative">
          <div className="absolute top-6 left-6 z-50">
            <button
              onClick={() => { setActiveTab('dashboard'); window.scrollTo(0, 0); }} // Go back to 'dashboard' which defaults to Landing if not logged in
              className="px-4 py-2 bg-slate-900/50 backdrop-blur border border-white/10 rounded-full text-xs font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i> {t('Back')}
            </button>
          </div>
          {activeTab === 'privacy' && <PrivacyPolicy t={t} />}
          {activeTab === 'terms' && <TermsOfService t={t} />}
          {activeTab === 'whitepaper' && <WhitePaper t={t} />}
        </div>
      );
    }

    if (!isLoggedIn && !isAuthenticating && !hasStarted) {
      return <LandingPage onEnter={() => startAuth('login')} t={t} setActiveTab={setActiveTab} />;
    }


    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'lab': return renderLab();
      case 'profile': return <ProfilePage user={user} history={history} t={t} onLogout={handleLogout} setActiveTab={setActiveTab} />;
      case 'notifications': return <NotificationsPage history={history} t={t} />;
      case 'history': return (
        <div className="max-w-4xl mx-auto py-10 space-y-6 px-4">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-bold dark:text-white text-slate-900 uppercase">Vault</h2>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-500/30 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-trash-can"></i> Clear History
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map(item => (
              <div key={item.id} className="glass-panel p-4 rounded-[1.5rem] flex gap-4 items-center border border-slate-800 hover:border-cyan-500/30 cursor-pointer group transition-all active:scale-[0.98]" onClick={() => { setResult(item.result); setActiveTab('lab'); scrollToTop(); }}>
                {/* Thumbnail Preview */}
                <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-black/50 border border-white/5 relative">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt="Evidence" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
                      <i className={`fas ${item.result.modality === 'audio' ? 'fa-music' : item.result.modality === 'video' ? 'fa-film' : 'fa-file-lines'} text-2xl`}></i>
                    </div>
                  )}
                  {/* Verdict Badge Overlay */}
                  <div className={`absolute bottom-0 inset-x-0 h-1 ${item.result.verdict === 'DEEPFAKE' ? 'bg-red-500' : item.result.verdict === 'REAL' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className={`font-black text-sm uppercase tracking-wider ${item.result.verdict === 'DEEPFAKE' ? 'text-red-500' : item.result.verdict === 'REAL' ? 'text-green-500' : 'text-orange-500'}`}>
                      {item.result.verdict}
                    </p>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                    {item.result.summary || "No forensic summary available."}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-wider border border-white/5">
                      {item.result.modality}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-wider border border-white/5">
                      {Math.round(item.result.confidence * 100)}% CONF
                    </span>
                  </div>
                </div>

                {/* Arrow Action */}
                <div className="w-8 h-8 rounded-full border border-white/5 bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:border-cyan-400 group-hover:text-white transition-all duration-300 text-slate-600 shrink-0">
                  <i className="fas fa-chevron-right text-xs"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'settings': return <AdminDashboard key="admin-dash-v2" users={users} alerts={alerts} onBlockUser={() => { }} />;
      case 'legal': return <LegalPage t={t} />;
      case 'protect': return <ProtectLanding setActiveTab={setActiveTab} t={t} />;
      case 'protect_register': return <ProtectRegister setActiveTab={setActiveTab} t={t} />;
      case 'protect_list': return <MyProtectedContent setActiveTab={setActiveTab} t={t} />;
      case 'protect_verify': return <VerifySuspicious setActiveTab={setActiveTab} t={t} />;
      case 'protect_disputes': return <ProtectDisputes setActiveTab={setActiveTab} t={t} />;
      case 'privacy': return <PrivacyPolicy t={t} />;
      case 'terms': return <TermsOfService t={t} />;
      case 'whitepaper': return <WhitePaper t={t} />;
      default: return renderDashboard();
    }
  };

  return (
    <>
      {/* <ParticleBackground /> */}
      {isInitializing && <SplashScreen />}
      <Layout
        isLoggedIn={isLoggedIn}
        onLoginClick={startAuth}
        onLogoClick={handleLogoClick}
        onProfileClick={() => { setActiveTab('profile'); scrollToTop(); }}
        userPhoto={user.photoURL}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        setLanguage={setLanguage}
        t={t}
      >
        <ChatBot language={language} user={user} />
        {isAuthenticating ? (
          <div className="h-full overflow-y-auto py-8 relative z-10 no-scrollbar">
            <AuthPage t={t} initialMode={authData.mode} onSuccess={(data) => { setAuthData(data); setIsLoggedIn(true); setIsAuthenticating(false); setActiveTab('dashboard'); scrollToTop(); }} />
          </div>
        ) : (
          <div
            ref={contentRef}
            className={`flex-1 overflow-y-auto overscroll-contain relative z-10 no-scrollbar ${(!isLoggedIn && !isAuthenticating && !hasStarted) ? '' : 'pb-40'}`}
          >
            {renderContent()}
          </div>
        )}
        {isLoggedIn && !isAuthenticating && (
          <BottomNav
            activeTab={activeTab === 'lab' ? 'dashboard' : activeTab}
            setActiveTab={(tab) => { setActiveTab(tab); setResult(null); setStagedFile(null); scrollToTop(); }}
            onPlusClick={() => { setActiveTab('lab'); setResult(null); setStagedFile(null); scrollToTop(); }}
            t={t}
          />
        )}
      </Layout>
    </>
  );
};

export default App;
