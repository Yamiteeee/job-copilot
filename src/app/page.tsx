'use client';

import { useState } from 'react';
import { useJobCopilot } from '@/hooks/useJobCopilot';
import { Job } from '@/utils/mockData';
import Logo from '@/components/logo';

export default function Dashboard() {
  const [isGuest, setIsGuest] = useState(true);
  const [userGroqKey, setUserGroqKey] = useState('');
  const { jobs, updateJobStatus, loading } = useJobCopilot(isGuest, userGroqKey);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [generating, setGenerating] = useState(false);

  // Expanded Kanban columns to track ghosted or stalled roles
  const columns: Job['status'][] = ['Backlog', 'Applied', 'Interviewing', 'Offer', 'Suspended'];
  
  // Track active column selection for mobile & tablet breakpoints
  const [activeTab, setActiveTab] = useState<Job['status']>('Backlog');

  // UI state protection wall checking passphrase eligibility
  const toggleProductionMode = () => {
    if (isGuest) {
      if (!userGroqKey.trim()) {
        alert("ACCESS_DENIED: Input a personal authorization token or system passphrase to bypass sandbox boundaries.");
        return;
      }
      setIsGuest(false);
    } else {
      setIsGuest(true);
    }
  };

  const triggerMockAIScript = async (job: Job) => {
    setGenerating(true);
    setSelectedJob(job);
    setCoverLetter(''); // Reset panel output view
    
    try {
      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: job.title,
          company: job.company,
          description: job.description || '',
          isGuest: isGuest,
          customKey: userGroqKey // Pass individual fallback input key safely
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Pipeline execution failed');
      }

      setCoverLetter(data.letter);
    } catch (error: any) {
      console.error('AI Extraction Error:', error);
      setCoverLetter(`// PIPELINE_ERROR: Unable to communicate with Groq.\n// REASON: ${error.message || 'Check terminal server connections.'}`);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center font-mono text-sm tracking-wider">
        INITIALIZING COPILOT PIPELINES...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 md:p-8 selection:bg-emerald-500 selection:text-black">
      {/* App Header System Dashboard */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-zinc-800 pb-5">
        <div className="w-full lg:w-auto">
          <Logo />
          <p className="text-xs text-zinc-400 mt-1">Full-Stack Data Engineering & Vector Metric Dashboard</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* User API Key Override Box Masked Input */}
          <input
            type="password"
            placeholder="ENTER_PASSPHRASE_TO_UNLOCK_LIVE_SYSTEM"
            value={userGroqKey}
            onChange={(e) => setUserGroqKey(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-3 py-2 font-mono text-xs focus:outline-none focus:border-zinc-700 w-full sm:min-w-[280px]"
          />

          <button 
            onClick={toggleProductionMode} 
            className={`px-4 py-2 rounded font-mono text-xs font-bold border tracking-wide transition-all active:scale-95 whitespace-nowrap ${
              isGuest 
                ? 'bg-amber-950/30 text-amber-400 border-amber-800/60 hover:bg-amber-950/50' 
                : 'bg-emerald-950/30 text-emerald-400 border-emerald-800/60 hover:bg-emerald-950/50'
            }`}
          >
            {isGuest ? '⚠️ DEMO_MODE: SANDBOX_ACTIVE' : '🔒 PRODUCTION_MODE: DATABASE_LIVE'}
          </button>
        </div>
      </header>

      {/* MOBILE & TABLET TAB CONTROL BAR (Keeps view spacious on viewports under 1024px wide) */}
      <div className="flex lg:hidden overflow-x-auto pb-3 mb-4 gap-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
        {columns.map(col => (
          <button
            key={col}
            onClick={() => setActiveTab(col)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold uppercase border transition-all whitespace-nowrap ${
              activeTab === col
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/60'
            }`}
          >
            {col} ({jobs.filter(j => j.status === col).length})
          </button>
        ))}
      </div>

      {/* Kanban Board Grid: Dynamic mobile view filtering vs full multi-column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {columns.map(col => (
          <div 
            key={col} 
            className={`bg-zinc-900/40 rounded-lg p-4 border border-zinc-800/80 min-h-[450px] lg:min-h-[550px] flex flex-col transition-all ${
              activeTab === col ? 'block' : 'hidden lg:flex'
            }`}
          >
            {/* Column Header Metadata */}
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
              <h3 className="text-xs font-bold uppercase font-mono tracking-widest text-zinc-400">{col}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                {jobs.filter(j => j.status === col).length}
              </span>
            </div>

            {/* Column Cards Content Stream */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {jobs.filter(j => j.status === col).map(job => (
                <div key={job.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg hover:border-zinc-700 transition duration-200 shadow-md">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-zinc-200 tracking-tight leading-snug">{job.title}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                      job.match_score >= 90 ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {job.match_score}% MATCH
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">{job.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-auto pt-2 border-t border-zinc-800/50">
                    <button 
                      onClick={() => triggerMockAIScript(job)} 
                      className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold px-3 py-1.5 rounded transition font-mono tracking-tight"
                    >
                      GENERATE_AI
                    </button>
                    
                    {col === 'Backlog' && (
                      <button 
                        onClick={() => updateJobStatus(job.id, 'Applied')} 
                        className="text-zinc-400 border border-zinc-800 hover:bg-zinc-800 text-xs font-mono px-2 py-1.5 rounded transition ml-auto"
                      >
                        MOVE →
                      </button>
                    )}

                    {col === 'Applied' && (
                      <div className="flex items-center gap-1.5 ml-auto">
                        <button 
                          onClick={() => updateJobStatus(job.id, 'Suspended')} 
                          className="text-red-400/80 border border-red-950/40 hover:bg-red-950/30 text-[10px] font-mono px-2 py-1.5 rounded transition"
                          title="No response/Stalled"
                        >
                          🛑 HOLD
                        </button>
                        <button 
                          onClick={() => updateJobStatus(job.id, 'Interviewing')} 
                          className="text-zinc-400 border border-zinc-800 hover:bg-zinc-800 text-xs font-mono px-2 py-1.5 rounded transition"
                        >
                          INTERVIEW →
                        </button>
                      </div>
                    )}

                    {col === 'Interviewing' && (
                      <div className="flex flex-col gap-1.5 w-full mt-2 pt-2 border-t border-zinc-800/30">
                        <div className="flex justify-between items-center gap-1.5 w-full">
                          <button 
                            onClick={() => updateJobStatus(job.id, 'Applied')} 
                            className="text-zinc-500 border border-zinc-800 hover:bg-zinc-800/60 text-[10px] font-mono px-2 py-1 rounded transition"
                          >
                            ↩️ BACK
                          </button>
                          <button 
                            onClick={() => updateJobStatus(job.id, 'Suspended')} 
                            className="text-red-400/60 border border-zinc-800/50 hover:bg-red-950/20 text-[10px] font-mono px-2 py-1 rounded transition"
                          >
                            🛑 HOLD
                          </button>
                        </div>
                        <button 
                          onClick={() => updateJobStatus(job.id, 'Offer')} 
                          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono py-1.5 rounded transition tracking-tight text-center"
                        >
                          ⭐ RECEIVE_OFFER →
                        </button>
                      </div>
                    )}

                    {col === 'Offer' && (
                      <div className="flex items-center gap-1.5 ml-auto">
                        <button 
                          onClick={() => updateJobStatus(job.id, 'Interviewing')} 
                          className="text-zinc-500 border border-zinc-800 hover:bg-zinc-800 text-[10px] font-mono px-2 py-1.5 rounded transition"
                        >
                          ↩️ BACK
                        </button>
                        <button 
                          onClick={() => updateJobStatus(job.id, 'Suspended')} 
                          className="text-red-400/80 border border-red-950/40 hover:bg-red-950/30 text-[10px] font-mono px-2 py-1.5 rounded transition"
                        >
                          🛑 HOLD
                        </button>
                      </div>
                    )}

                    {col === 'Suspended' && (
                      <button 
                        onClick={() => updateJobStatus(job.id, 'Backlog')} 
                        className="text-zinc-500 border border-zinc-800/50 hover:bg-zinc-800 text-[10px] font-mono px-2 py-1.5 rounded transition ml-auto"
                      >
                        ↩️ REACTIVATE
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Prompt Script Modal Overlay */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 max-w-xl w-full rounded-xl p-5 md:p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <h3 className="text-sm font-bold text-emerald-400 font-mono tracking-wider mb-1">TAILORED APPLICATION ENGINE</h3>
            <p className="text-xs text-zinc-400 font-mono mb-4 truncate">{selectedJob.title} // {selectedJob.company}</p>
            
            <div className="flex-1 min-h-0">
              {generating ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 text-xs font-mono text-zinc-400 border border-zinc-800 rounded-lg bg-zinc-950">
                  <span className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  RUNNING SEMANTIC EXTRACTION MATRIX...
                </div>
              ) : (
                <textarea 
                  className="w-full h-64 md:h-80 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs font-mono text-zinc-300 leading-relaxed focus:outline-none focus:border-zinc-700 resize-none shadow-inner" 
                  value={coverLetter} 
                  readOnly 
                />
              )}
            </div>
            
            <div className="flex justify-end mt-4 shrink-0">
              <button 
                onClick={() => setSelectedJob(null)} 
                className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs px-4 py-2 rounded-lg transition text-center"
              >
                TERMINATE_WINDOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}