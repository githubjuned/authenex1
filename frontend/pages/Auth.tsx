
import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

interface AuthProps {
  initialMode?: 'login' | 'register';
  onSuccess: (data: { email: string; mode: 'login' | 'register'; referenceImage?: string }) => void;
  t: (key: string) => string;
}

export const AuthPage: React.FC<AuthProps> = ({ initialMode = 'login', onSuccess, t }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [step, setStep] = useState<'email' | 'otp'>('email');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [securityStatus, setSecurityStatus] = useState(t('status_ready'));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("Email is required");

    setIsProcessing(true);
    setSecurityStatus('Generating Secure Token...');
    setError(null);

    // SIMULATION: In production, call your backend API here
    setTimeout(() => {
      const code = generateOTP();
      setGeneratedOtp(code);
      setStep('otp');
      setIsProcessing(false);
      setSecurityStatus('Token Dispatched');
      alert(`[SIMULATION] Your Login Code is: ${code}`); // Demo only
    }, 1500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError("Invalid Code");
      setSecurityStatus('Security Breach Detected');
      return;
    }

    // Success - In production you would exchange this for a JWT
    setSecurityStatus('Identity Verified');
    onSuccess({ email, mode: 'login' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'otp' && step === 'email') {
      handleSendOtp(e);
      return;
    }
    if (authMethod === 'otp' && step === 'otp') {
      handleVerifyOtp(e);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSecurityStatus('Validating Credentials...');

    try {
      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        setSecurityStatus('Identity Created');
      } else {
        try {
          // Attempt Login
          await signInWithEmailAndPassword(auth, email, password);
          setSecurityStatus('Identity Verified');
        } catch (loginError: any) {
          console.log("Login failed:", loginError.code);
          throw loginError;
        }
      }
      onSuccess({ email, mode });
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Construct a user-friendly error message that includes the code
      let errorMessage = err.message || 'Authentication failed';

      // Handle known errors with clear messages
      if (err.code === 'auth/wrong-password') {
        errorMessage = "Incorrect Password.";
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        errorMessage = "User not found. Please Sign Up first.";
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = "Email already in use. Please login.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password is too weak (min 6 chars).";
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Connection Failed. Check your internet or backend.";
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/Password login is disabled in Firebase Console.";
      } else if (err.code) {
        // Show code for unknown errors to help debugging
        errorMessage = `${errorMessage} (${err.code})`;
      } else if (errorMessage === "Incorrect Password") {
        // My custom error thrown from auto-registration logic
        errorMessage = "Incorrect Password.";
      }

      setError(errorMessage);
      setSecurityStatus('Access Denied');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsProcessing(true);
    setError(null);
    setSecurityStatus('Establishing Secure Tunnel...');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      setSecurityStatus('Identity Verified');
      onSuccess({ email: result.user.email || '', mode: 'login' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google Auth failed');
      setSecurityStatus('Access Denied');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black uppercase text-blue-500 tracking-[0.2em]">Neural Gate v4.2</span>
        </div>
        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
          {mode === 'login' ? t('auth_portal') : t('auth_enroll')}
        </h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          {mode === 'login' ? t('auth_desc_login') : t('auth_desc_reg')}
        </p>
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-t border-white/10">

        {/* Login/Register Toggle */}
        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl mb-8 border border-slate-800">
          <button
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            onClick={() => { setMode('login'); setStep('email'); setError(null); }}
          >
            {t('auth_login')}
          </button>
          <button
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'register' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            onClick={() => { setMode('register'); setAuthMethod('password'); setStep('email'); setError(null); }}
          >
            {t('auth_signup')}
          </button>
        </div>

        {/* Method Toggle (Only for Login) */}
        {mode === 'login' && (
          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => { setAuthMethod('password'); setStep('email'); }}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${authMethod === 'password' ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Password
            </button>
            <button
              onClick={() => { setAuthMethod('otp'); setStep('email'); }}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${authMethod === 'otp' ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Email OTP
            </button>
          </div>
        )}

        {/* Google Login */}
        <div className="mb-8">
          <button
            onClick={handleGoogleLogin}
            disabled={isProcessing}
            className="w-full group flex items-center justify-center gap-4 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm">{t('auth_google')}</span>
          </button>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <span className="relative px-4 bg-[#0d1425] text-[10px] font-black uppercase text-slate-600 tracking-widest">{t('auth_or')}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-mono animate-in fade-in slide-in-from-top-2">
            <i className="fas fa-triangle-exclamation mr-2"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {step === 'email' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-right-8 duration-300">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t('auth_id_label')}</label>
              <input
                type="email"
                required
                disabled={isProcessing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-white text-sm transition-all"
                placeholder="name@agency.com"
              />
            </div>
          )}

          {authMethod === 'password' && step === 'email' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-right-8 duration-300 delay-100">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t('auth_pass_label')}</label>
              <input
                type="password"
                required
                disabled={isProcessing}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-white text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          )}

          {authMethod === 'otp' && step === 'otp' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-400">
                  <i className="fas fa-shield-halved text-2xl"></i>
                </div>
                <p className="text-slate-400 text-xs">Enter the 6-digit code sent to <br /><span className="text-white font-bold">{email}</span></p>
              </div>

              <input
                type="text"
                required
                maxLength={6}
                disabled={isProcessing}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-4 bg-slate-950 border border-cyan-500/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-white text-2xl font-mono text-center tracking-[0.5em] placeholder:tracking-normal transition-all"
                placeholder="000000"
              />
              <button type="button" onClick={() => setStep('email')} className="w-full text-center text-[10px] text-slate-500 hover:text-white uppercase font-bold tracking-widest mt-2">
                Change Email
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-5 text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl active:scale-[0.98] disabled:opacity-50 transition-all ${authMethod === 'otp' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-blue-600 hover:bg-blue-500'}`}
          >
            {isProcessing ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <span>
                {mode === 'register' ? t('auth_btn_enroll') :
                  authMethod === 'otp' && step === 'email' ? 'SEND CODE' :
                    authMethod === 'otp' && step === 'otp' ? 'VERIFY & ACCESS' :
                      t('auth_btn_init')}
              </span>
            )}
          </button>
        </form>

        <div className="mt-10 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[9px] text-slate-500 space-y-1">
          <div className="flex justify-between border-b border-slate-900 pb-2 mb-2">
            <span className="text-blue-400 font-black">{t('auth_system_status')}</span>
            <span className={`animate-pulse ${error ? 'text-red-500' : 'text-green-500'}`}>{t('status_ready')}</span>
          </div>
          <p className="flex justify-between"><span>NODE_SIG:</span> <span className="text-slate-400 uppercase">{securityStatus}</span></p>
        </div>
      </div>
    </div>
  );
};
