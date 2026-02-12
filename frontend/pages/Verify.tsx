
import React, { useState, useEffect } from 'react';
import { WebcamCapture } from '../components/WebcamCapture';
import { GeminiAuthService } from '../services/gemini';
import { FraudDetector } from '../services/fraud';
import { RiskLevel } from '../types';

interface VerifyProps {
  mode: 'login' | 'register';
  email: string;
  referenceImage?: string;
  onComplete: (success: boolean, riskData?: any) => void;
  t: (key: string) => string;
}

export const VerifyPage: React.FC<VerifyProps> = ({ mode, email, referenceImage, onComplete, t }) => {
  const [step, setStep] = useState<'capture' | 'analyzing' | 'otp'>('capture');
  const [loadingMsg, setLoadingMsg] = useState('Checking biometrics...');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (base64: string) => {
    setStep('analyzing');
    setLoadingMsg("Running Liveness Detection...");
    
    // Simulate multi-stage AI check
    try {
      // 1. Face & Liveness
      const verification = await GeminiAuthService.verifyFaceAndLiveness(
        base64, 
        mode === 'login' ? (referenceImage || null) : null
      );

      if (!verification.isLive) {
        setError("Potential Spoof Detected: Please use a real face, not a photo or screen.");
        setStep('capture');
        return;
      }

      if (mode === 'login' && !verification.success) {
        setError(`Identity Mismatch: ${verification.message}`);
        setStep('capture');
        return;
      }

      setLoadingMsg("Calculating Fraud Risk Score...");
      const behavior = FraudDetector.getBehaviorMetrics();
      const fingerprint = FraudDetector.getDeviceFingerprint();
      
      const risk = await GeminiAuthService.calculateFraudRisk({
        fingerprint,
        behavior,
        verification,
        isNewDevice: Math.random() > 0.8 // Simulate device check
      });

      if (risk.score > 80) {
        onComplete(false, { reason: "High Fraud Risk: " + risk.reason });
        return;
      }

      // If enrollment, save the image as reference
      if (mode === 'register') {
        setStep('otp');
      } else {
        onComplete(true, { riskScore: risk.score, faceImage: base64 });
      }

    } catch (err) {
      setError("AI System temporarily unavailable.");
      setStep('capture');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') { // Mock OTP
      onComplete(true);
    } else {
      setError("Invalid OTP. Try 123456 for demo.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black dark:text-white text-slate-900 mb-3 uppercase tracking-tighter">Identity Verification</h2>
        <p className="text-slate-500 font-medium text-lg">
          {step === 'capture' && "Position your face in the center of the frame for biometric mapping."}
          {step === 'analyzing' && loadingMsg}
          {step === 'otp' && "Final step: Confirm the cryptographic code sent to your device."}
        </p>
      </div>

      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/50 p-5 rounded-2xl flex items-center gap-4 text-red-500 font-bold text-sm shadow-xl shadow-red-500/10 animate-shake">
          <i className="fas fa-circle-exclamation text-xl"></i>
          <p>{error}</p>
        </div>
      )}

      {step === 'capture' && (
        <div className="space-y-10">
           <WebcamCapture onCapture={handleCapture} isProcessing={false} t={t} />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-[2rem] border-blue-500/20 text-center hover:border-blue-500 transition-all">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                  <i className="fas fa-microchip text-blue-500 text-xl"></i>
                </div>
                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Biometrics</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Face Vector Mapping</p>
              </div>
              <div className="glass-panel p-6 rounded-[2rem] border-green-500/20 text-center hover:border-green-500 transition-all">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <i className="fas fa-heartbeat text-green-500 text-xl"></i>
                </div>
                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Liveness</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Anti-Spoof Logic</p>
              </div>
              <div className="glass-panel p-6 rounded-[2rem] border-purple-500/20 text-center hover:border-purple-500 transition-all">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                  <i className="fas fa-fingerprint text-purple-500 text-xl"></i>
                </div>
                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Device</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Fingerprint ID</p>
              </div>
           </div>
        </div>
      )}

      {step === 'analyzing' && (
        <div className="glass-panel p-24 rounded-[3.5rem] text-center space-y-10 border-blue-500/30 shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-blue-600/5 -z-10 animate-pulse"></div>
           <div className="relative mx-auto w-40 h-40">
              <div className="absolute inset-0 rounded-full border-8 border-blue-500/10"></div>
              <div className="absolute inset-0 rounded-full border-t-8 border-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <i className="fas fa-shield-halved text-6xl text-blue-500"></i>
              </div>
           </div>
           <div className="space-y-4">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{loadingMsg}</h3>
              <div className="max-w-sm mx-auto h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                 <div className="h-full bg-blue-500 animate-[shimmer_1.5s_infinite]"></div>
              </div>
           </div>
           <p className="text-slate-500 text-sm italic font-medium px-6">
             Our Neural Networks are validating your session signatures against global forensic standards...
           </p>
        </div>
      )}

      {step === 'otp' && (
        <div className="glass-panel p-16 rounded-[3rem] max-w-md mx-auto shadow-2xl border-blue-500/20">
          <form onSubmit={handleOtpSubmit} className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-inner">
                <i className="fas fa-mobile-screen-button text-3xl text-blue-500"></i>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Secure Passcode</h3>
              <p className="text-slate-500 text-sm font-bold mt-2 uppercase tracking-widest">Check registered device for OTP</p>
            </div>

            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              autoFocus
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center text-5xl tracking-[1rem] py-6 bg-slate-900/50 border border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none text-white font-mono shadow-2xl transition-all"
              placeholder="000000"
            />

            <button
              type="submit"
              className="w-full py-5 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-green-600/30 active:scale-95"
            >
              Verify & Complete
            </button>
            <button 
              type="button"
              className="w-full text-slate-500 text-[11px] font-black uppercase tracking-widest hover:text-white transition-colors"
              onClick={() => setStep('capture')}
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to Biometrics
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
