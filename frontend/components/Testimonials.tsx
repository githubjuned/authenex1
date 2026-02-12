
import React from 'react';

export const Testimonials: React.FC = () => {
  const comments = [
    {
      name: "Dr. Aris Varma",
      role: "Cyber Forensics Expert",
      text: "The granularity of Authenex's visual deconstruction is unmatched. It identified a sophisticated 4K deepfake that traditional spectral tools completely missed.",
      avatar: "AV"
    },
    {
      name: "Sandeep K.",
      role: "Security Director, FinTech",
      text: "Integrating Authenex into our onboarding pipeline reduced synthetic identity fraud by 84% in the first quarter. A mandatory tool for modern trust.",
      avatar: "SK"
    },
    {
      name: "Maya Deshmukh",
      role: "Independent Journalist",
      text: "As media manipulation becomes rampant, Authenex gives us the ability to verify source authenticity in seconds. It's the ultimate truth engine.",
      avatar: "MD"
    }
  ];

  return (
    <div className="py-12 space-y-10">
      <div className="text-center space-y-2">
        <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">Member Feedback</h3>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Verified Commendations</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comments.map((comment, i) => (
          <div key={i} className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-between hover:border-blue-500/30 transition-all group">
            <div className="space-y-4">
              <div className="flex text-blue-500 gap-1 text-[8px]">
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed italic italic">
                "{comment.text}"
              </p>
            </div>
            <div className="flex items-center gap-4 pt-6 mt-6 border-t border-white/5">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-blue-400 border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {comment.avatar}
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase">{comment.name}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{comment.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
