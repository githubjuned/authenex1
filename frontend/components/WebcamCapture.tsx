
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface WebcamCaptureProps {
  onCapture: (base64Image: string) => void;
  isProcessing?: boolean;
  t: (key: string) => string;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, isProcessing, t }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    if (isInitializing) return;
    setIsInitializing(true);
    setError(null);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Secure media devices are not supported.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false 
      });
      
      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.error("Video playback failed:", playErr);
        }
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setError("Failed to access camera: " + (err.message || "Permission denied"));
      setIsCameraActive(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  return (
    <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl h-[60vh] md:h-[500px] flex flex-col group transition-all duration-500">
      {!isCameraActive ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 bg-gradient-to-b from-slate-900 to-black">
          <div className="relative">
             <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-800 relative z-10">
                <i className={`fas ${error ? 'fa-camera-slash text-red-500' : 'fa-camera text-cyan-500'} text-3xl`}></i>
             </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">
              {error ? "ACCESS REJECTED" : "INITIALIZE LINK"}
            </h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest max-w-[200px] mx-auto">
              {error || "Biometric mapping requires camera access."}
            </p>
          </div>

          <button 
            onClick={startCamera} 
            disabled={isInitializing}
            className="px-8 py-4 bg-cyan-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-90"
          >
             {isInitializing ? "LINKING..." : "START SCAN"}
          </button>
        </div>
      ) : (
        <div className="relative flex-1 bg-black overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
          
          {/* Scientific Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 border-[20px] border-black/30">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-cyan-500/20 rounded-full">
                <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin-slow opacity-60"></div>
             </div>
          </div>
          
          {/* Capture Controls */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center px-6 z-20">
            <button
              onClick={capture}
              disabled={isProcessing}
              className={`flex items-center justify-center gap-3 px-10 py-4 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] transition-all ${
                isProcessing
                ? 'bg-slate-800 text-slate-500' 
                : 'bg-cyan-600 text-white active:scale-90 shadow-2xl'
              }`}
            >
              {isProcessing ? "PROCESSING..." : "VERIFY IDENTITY"}
            </button>
          </div>

          <button 
            onClick={stopCamera}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center active:bg-red-600 transition-all z-20"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
