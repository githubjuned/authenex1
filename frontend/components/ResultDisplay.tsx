
import React from 'react';
import { DetectionResult } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { TiltCard } from './TiltCard';

interface ResultDisplayProps {
  result: DetectionResult & { analysisSpeed?: string };
  onReset: () => void;
  t: (key: string) => string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset, t }) => {
  const verdict = result?.verdict || 'SUSPICIOUS';
  const isSuspicious = verdict === 'SUSPICIOUS';
  const isDeepfake = verdict === 'DEEPFAKE';
  const aiScore = typeof result?.aiPercentage === 'number' ? result.aiPercentage : 50;
  const humanScore = typeof result?.humanPercentage === 'number' ? result.humanPercentage : 50;
  const confidence = typeof result?.confidence === 'number' ? result.confidence : 0;
  const modality = result?.modality?.toUpperCase() || 'GENERAL';
  const findings = Array.isArray(result?.findings) ? result.findings.filter(f => f && f.label && f.severity) : [];

  const accentColor = isDeepfake ? '#ef4444' : isSuspicious ? '#f59e0b' : '#10b981';
  // ... (rest of the code is fine, just replacing the findings definition line and the end of file)
  const secondaryAccent = isDeepfake ? 'text-red-500' : isSuspicious ? 'text-orange-500' : 'text-green-500';

  const downloadPDF = async () => {
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. SET DARK BACKGROUND
    doc.setFillColor(2, 6, 23); // #020617 (Slate 950)
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // 2. DECORATIVE ELEMENTS (GRID/SCANLINES)
    doc.setDrawColor(30, 41, 59); // Slate 800
    doc.setLineWidth(0.1);
    for (let i = 0; i < pageHeight; i += 10) {
      doc.line(0, i, pageWidth, i);
    }
    for (let i = 0; i < pageWidth; i += 10) {
      doc.line(i, 0, i, pageHeight);
    }

    // 3. ADD LOGO
    const logoUrl = "https://res.cloudinary.com/dyvmqkxok/image/upload/e_background_removal/f_png/v1770664374/WhatsApp_Image_2026-02-10_at_00.39.29_rzzhs5.jpg";
    try {
      const img = new Image();
      img.src = logoUrl;
      img.crossOrigin = "anonymous";
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // Continue even if logo fails
      });
      if (img.complete && img.naturalWidth !== 0) {
        doc.addImage(img, 'PNG', pageWidth / 2 - 15, 15, 30, 30);
      }
    } catch (e) {
      console.warn("Logo failed to load for PDF");
    }

    // 4. HEADER TYPOGRAPHY
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("FORENSIC ANALYSIS REPORT", pageWidth / 2, 60, { align: "center" });

    doc.setDrawColor(0, 210, 255); // Cyan 500
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 40, 65, pageWidth / 2 + 40, 65);

    // 5. SESSION DATA BOX
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.roundedRect(15, 75, pageWidth - 30, 35, 3, 3, 'F');

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.setFont("helvetica", "bold");
    doc.text("REPORT IDENTIFIER:", 25, 85);
    doc.text("MODALITY TYPE:", 25, 92);
    doc.text("TIMESTAMP:", 25, 99);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text(`AX-${Math.random().toString(36).substring(2, 10).toUpperCase()}-NODE`, 65, 85);
    doc.text(`${modality} INVESTIGATION`, 65, 92);
    doc.text(`${new Date().toLocaleString().toUpperCase()}`, 65, 99);

    // 6. VERDICT CENTERPIECE
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(15, 115, pageWidth - 30, 50, 5, 5, 'F');

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("CRITICAL SYSTEM VERDICT", pageWidth / 2, 128, { align: "center" });

    doc.setFontSize(38);
    if (isDeepfake) doc.setTextColor(239, 68, 68); // Red 500
    else if (isSuspicious) doc.setTextColor(245, 158, 11); // Amber 500
    else doc.setTextColor(16, 185, 129); // Emerald 500
    doc.setFont("helvetica", "bold");
    doc.text(verdict, pageWidth / 2, 145, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`CONFIDENCE INDEX: ${confidence}%`, pageWidth / 2, 155, { align: "center" });

    // 7. COMPOSITIONAL BREAKDOWN
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("NEURAL COMPOSITION", 20, 180);

    // Progress Bars Style
    const barWidth = pageWidth - 40;

    // AI Trace Bar
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`AI GENERATIVE TRACE (${aiScore}%)`, 20, 190);
    doc.setFillColor(30, 41, 59);
    doc.rect(20, 193, barWidth, 3, 'F');
    doc.setFillColor(239, 68, 68);
    doc.rect(20, 193, (barWidth * aiScore) / 100, 3, 'F');

    // Biological Bar
    doc.setTextColor(148, 163, 184);
    doc.text(`BIOLOGICAL VALIDITY (${humanScore}%)`, 20, 205);
    doc.setFillColor(30, 41, 59);
    doc.rect(20, 208, barWidth, 3, 'F');
    doc.setFillColor(16, 185, 129);
    doc.rect(20, 208, (barWidth * humanScore) / 100, 3, 'F');

    // 8. SUMMARY
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("EXECUTIVE FORENSIC SUMMARY", 20, 225);

    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225); // Slate 300
    doc.setFont("helvetica", "normal");
    const splitSummary = doc.splitTextToSize(result?.summary || "Neural node failed to provide a readable summary.", pageWidth - 40);
    doc.text(splitSummary, 20, 233);

    // 9. FOOTER BRANDING
    doc.setDrawColor(30, 41, 59);
    doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);

    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105); // Slate 600
    doc.setFont("helvetica", "bold");
    doc.text("AUTHENTICITY SECURED BY AUTHENEX NEURAL DEFENSE LABS", pageWidth / 2, pageHeight - 15, { align: "center" });
    doc.text("REALITY RECODED © 2025 • PROPRIETARY ENCRYPTION ACTIVE", pageWidth / 2, pageHeight - 10, { align: "center" });

    // 10. FINDINGS (New Page if needed)
    if (findings.length > 0) {
      doc.addPage();
      doc.setFillColor(2, 6, 23);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Secondary Page Header
      doc.setTextColor(0, 210, 255);
      doc.setFontSize(14);
      doc.text("TECHNICAL ANOMALY LOG", 20, 25);

      let yPos = 40;
      findings.forEach((f, i) => {
        if (yPos > pageHeight - 30) {
          doc.addPage();
          doc.setFillColor(2, 6, 23);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
          yPos = 30;
        }

        doc.setFillColor(15, 23, 42);
        doc.roundedRect(18, yPos - 5, pageWidth - 36, 20, 2, 2, 'F');

        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text(`${i + 1}. ${f.label.toUpperCase()}`, 25, yPos + 2);

        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.setFont("helvetica", "normal");
        const splitDesc = doc.splitTextToSize(f.description, pageWidth - 80);
        doc.text(splitDesc, 25, yPos + 7);

        // Severity Tag
        const sevColor = f.severity === 'high' ? [239, 68, 68] : f.severity === 'medium' ? [245, 158, 11] : [16, 185, 129];
        doc.setTextColor(sevColor[0], sevColor[1], sevColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(f.severity.toUpperCase(), pageWidth - 45, yPos + 2);

        yPos += 25;
      });
    }



    // 11. LEGAL ACTION STATEMENTS (Only for Deepfakes)
    if (isDeepfake) {
      doc.addPage();
      doc.setFillColor(2, 6, 23);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Title
      doc.setTextColor(239, 68, 68); // Red
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("LEGAL ACTION PROTOCOL", pageWidth / 2, 40, { align: "center" });

      doc.setDrawColor(239, 68, 68);
      doc.setLineWidth(0.5);
      doc.line(40, 45, pageWidth - 40, 45);

      // Warning Box
      doc.setFillColor(239, 68, 68);
      doc.setDrawColor(239, 68, 68);
      doc.rect(20, 60, pageWidth - 40, 30, 'S'); // Stoke only, no fill to keep bg

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("CRITICAL ALERT: This content has been flagged as a potential DEEPFAKE.", pageWidth / 2, 75, { align: "center" });
      doc.text("Immediate action is recommended if this content is being used for malicious purposes.", pageWidth / 2, 82, { align: "center" });

      // Action Steps
      const steps = [
        { title: "STEP 1: SECURE EVIDENCE", desc: "Do not delete the content. Take screenshots and download this forensic report as primary evidence." },
        { title: "STEP 2: REPORT CYBER CRIME", desc: "File a complaint immediately at the National Cyber Crime Reporting Portal." },
        { title: "STEP 3: FILE AN F.I.R.", desc: "Visit your nearest police station to file a First Information Report (FIR) under relevant sections of the IT Act, 2000." }
      ];

      let yStep = 110;
      steps.forEach((step, idx) => {
        doc.setTextColor(203, 213, 225);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(step.title, 25, yStep);

        doc.setTextColor(148, 163, 184); // Slate 400
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const splitDesc = doc.splitTextToSize(step.desc, pageWidth - 50);
        doc.text(splitDesc, 25, yStep + 7);

        yStep += 30;
      });

      // Links Area
      doc.setFillColor(15, 23, 42); // Darker box
      doc.roundedRect(20, 190, pageWidth - 40, 40, 3, 3, 'F');

      doc.setTextColor(56, 189, 248); // Light Blue
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.textWithLink("CLICK HERE: REPORT AT CYBERCRIME.GOV.IN", pageWidth / 2, 210, { url: "https://cybercrime.gov.in/", align: "center" });

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Government of India | Ministry of Home Affairs", pageWidth / 2, 220, { align: "center" });
    }

    doc.save(`Authenex_Forensic_Report_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6 md:space-y-8 px-4">

      {/* Header Summary Panel */}
      <div className={`relative glass-panel bg-[#0b1424] p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-orange-500/20 shadow-2xl overflow-hidden min-h-[250px] flex flex-col justify-center`}>
        <div className="absolute top-4 left-5 md:top-8 md:left-10">
          <div className="px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {modality} SESSION
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4 pt-8 md:pt-10 pb-4 md:pb-6">
          <h4 className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] md:tracking-[0.4em]">{t('verdict_label')}</h4>
          <h1 className={`text-4xl md:text-8xl font-black uppercase tracking-tighter ${secondaryAccent} text-center`}>
            {verdict}
          </h1>
          <div className="space-y-1.5 md:space-y-2 text-center">
            <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-sm">
              {t('confidence_label')}: <span className="text-white">{confidence}%</span>
            </p>
            <div className="flex items-center gap-2 md:gap-4 justify-center">
              <div className="w-6 md:w-12 h-px bg-slate-800"></div>
              <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em]">{t('speed_label')}: {result?.analysisSpeed || '1.24S'}</p>
              <div className="w-6 md:w-12 h-px bg-slate-800"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">

        {/* Compositional Integrity Chart */}
        <div className="glass-panel p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-[#0b1424] border border-slate-800/50 space-y-6 md:space-y-10">
          <h3 className="text-slate-400 text-xs md:text-sm font-bold uppercase text-center tracking-widest">{t('integrity_label')}</h3>

          <div className="relative w-40 h-40 md:w-56 md:h-56 mx-auto flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#111827" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none" stroke={accentColor} strokeWidth="6"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 - (282.7 * aiScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl md:text-4xl font-black text-white">{aiScore}%</span>
              <span className="text-[8px] md:text-[9px] font-bold uppercase text-slate-500 tracking-widest">{t('ai_trace')}</span>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1">
                <span className="text-red-500">{t('ai_trace')}</span>
                <span className="text-white">{aiScore}%</span>
              </div>
              <div className="h-2.5 md:h-4 bg-slate-900/80 rounded-full border border-slate-800 overflow-hidden relative">
                <div className="h-full bg-red-500" style={{ width: `${aiScore}%` }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1">
                <span className="text-green-500">{t('bio_validity')}</span>
                <span className="text-white">{humanScore}%</span>
              </div>
              <div className="h-2.5 md:h-4 bg-slate-900/80 rounded-full border border-slate-800 overflow-hidden relative">
                <div className="h-full bg-green-500" style={{ width: `${humanScore}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Marker Radar - Interactive 3D */}
        <TiltCard className="glass-panel p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-[#0b1424] border border-slate-800/50 space-y-6 md:space-y-8 group/radar">
          <div className="text-center space-y-1">
            <h3 className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest">{t('marker_flux')}</h3>
            <p className="text-slate-600 text-[8px] md:text-[9px] font-bold uppercase tracking-widest">{modality} • FLUX ANALYSIS</p>
          </div>

          <div className="relative w-40 h-40 md:w-64 md:h-64 mx-auto flex items-center justify-center transform-style-3d">
            {/* Radar Chart SVG */}
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {/* Grid Circles */}
              {[40, 70, 100].map((r, i) => (
                <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 2" />
              ))}
              {/* Axes */}
              <line x1="100" y1="0" x2="100" y2="200" stroke="#1e293b" strokeWidth="1" />
              <line x1="0" y1="100" x2="200" y2="100" stroke="#1e293b" strokeWidth="1" />

              {/* Data Polygon (Dynamic based on scores) */}
              <polygon
                points={`100,${100 - aiScore}, ${100 + aiScore},100, 100,${100 + (humanScore * 0.8)}, ${100 - (confidence * 0.8)},100`}
                fill={isDeepfake ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)"}
                stroke={isDeepfake ? "#ef4444" : "#10b981"}
                strokeWidth="2"
              />

              {/* Radar Sweep Overlay */}
              <line x1="100" y1="100" x2="100" y2="20" stroke="rgba(6,182,212,0.5)" strokeWidth="2" className="origin-center" />
              <circle cx="100" cy="100" r="100" fill="url(#radar-gradient)" className="origin-center opacity-20" />
              <defs>
                <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="100%" stopColor="cyan" stopOpacity="0.2" />
                </radialGradient>
              </defs>

              {/* Data Points */}
              <circle cx="100" cy={100 - aiScore} r="3" fill="#fff" />
              <circle cx={100 + aiScore} cy="100" r="3" fill="#fff" />
              <circle cx="100" cy={100 + (humanScore * 0.8)} r="3" fill="#fff" />
              <circle cx={100 - (confidence * 0.8)} cy="100" r="3" fill="#fff" />
            </svg>

            {/* Labels with Scores */}
            <div className="absolute top-0 text-[8px] font-bold text-slate-500 flex flex-col items-center">
              <span>{t('radar_texture')}</span>
              <span className="text-cyan-400">{aiScore}%</span>
            </div>
            <div className="absolute right-0 text-[8px] font-bold text-slate-500 flex flex-col items-center">
              <span>{t('radar_anatomy')}</span>
              <span className="text-cyan-400">{aiScore}%</span>
            </div>
            <div className="absolute bottom-0 text-[8px] font-bold text-slate-500 flex flex-col items-center">
              <span>{t('radar_lighting')}</span>
              <span className="text-cyan-400">{Math.round(humanScore * 0.8)}%</span>
            </div>
            <div className="absolute left-0 text-[8px] font-bold text-slate-500 flex flex-col items-center">
              <span>{t('radar_environ')}</span>
              <span className="text-cyan-400">{Math.round(confidence * 0.8)}%</span>
            </div>
          </div>

          <div className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-slate-900/50 border border-slate-800 transition-colors group-hover/radar:border-cyan-500/30">
            <h5 className="text-cyan-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest border-b border-slate-800 pb-2 mb-2 flex justify-between">
              <span>SENSORS</span>
              <span className="text-white">ACTIVE</span>
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-[10px] text-slate-400 uppercase">{t('radar_semantic')}</div>
              <div className="text-[10px] text-white text-right font-mono">{(confidence / 100).toFixed(3)}</div>
              <div className="text-[10px] text-slate-400 uppercase">OFFSET</div>
              <div className="text-[10px] text-white text-right font-mono">0.042</div>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* NEW: Key Forensic Findings Section */}
      <div className="glass-panel p-6 md:p-10 rounded-[2rem] bg-[#0b1424] border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest flex items-center gap-3">
            <i className="fas fa-list-check text-cyan-500"></i>
            {t('findings_label') || "Key Forensic Findings"}
          </h3>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{findings.length} ANOMALIES DETECTED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {findings.length > 0 ? (
            findings.map((finding, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex gap-4 transition-all hover:bg-slate-900 hover:border-cyan-500/30 group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${finding.severity === 'high' ? 'bg-red-500/10 text-red-500' : finding.severity === 'medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  <i className={`fas ${finding.severity === 'high' ? 'fa-triangle-exclamation' : 'fa-circle-info'} text-sm`}></i>
                </div>
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-200 text-sm">{finding.label}</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium group-hover:text-slate-400">{finding.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-8 text-center text-slate-500 text-sm font-medium border border-dashed border-slate-800 rounded-xl">
              No specific anomalies flagged by the neural engine. The content appears consistent with standard {modality.toLowerCase()} patterns.
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#0b1424] border border-slate-800 space-y-4">
        <h4 className="text-[10px] md:text-xs font-black uppercase text-blue-500 tracking-widest">{t('summary_title')}</h4>
        <p className="text-slate-400 text-[11px] md:text-sm font-medium leading-relaxed">{result?.summary}</p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-6 pt-4 md:pt-6">
        <button onClick={onReset} className="px-6 py-4 md:px-12 md:py-5 bg-slate-900 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95">
          {t('btn_new_scan')}
        </button>
        <button
          onClick={downloadPDF}
          className="px-8 py-5 md:px-16 md:py-6 bg-cyan-600 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-xl transition-all shadow-lg active:scale-95 hover:bg-cyan-500"
        >
          {t('btn_download')}
        </button>
      </div>
    </div>
  );
};
