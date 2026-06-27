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

  const columns: Job['status'][] = ['Backlog', 'Applied', 'Interviewing', 'Offer', 'Suspended'];
  const [activeTab, setActiveTab] = useState<Job['status']>('Backlog');

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
    setCoverLetter('');
    
    try {
      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: job.title,
          company: job.company,
          description: job.description || '',
          isGuest: isGuest,
          customKey: userGroqKey
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Pipeline execution failed');
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
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center font-mono text-xs tracking-widest gap-3">
        <span className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        INITIALIZING COPILOT PIPELINES...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* App Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 sm:p-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur sticky top-0 z-40">
        <div>
          <Logo />
          <p className="text-xs text-zinc-500 mt-1 font-mono uppercase tracking-tight">Full-Stack Data Engineering & Vector Metric Dashboard</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <input
            type="password"
            placeholder="ENTER_PASSPHRASE_TO_UNLOCK_LIVE_SYSTEM"
            value={userGroqKey}
            onChange={(e) => setUserGroqKey(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none focus:border-zinc-700 w-full sm:min-w-[280px] transition-colors"
          />

          <button 
            onClick={toggleProductionMode} 
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold border tracking-wide transition-all active:scale-98 whitespace-nowrap ${
              isGuest 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            {isGuest ? '⚠️ DEMO_MODE: SANDBOX_ACTIVE' : '🔒 PRODUCTION_MODE: DATABASE_LIVE'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 max-w-[1600px] w-full mx-auto gap-4 overflow-hidden">
        {/* Mobile Filter Tabs */}
        <div className="flex lg:hidden overflow-x-auto pb-2 gap-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {columns.map(col => (
            <button
              key={col}
              onClick={() => setActiveTab(col)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase border transition-all whitespace-nowrap snap-center ${
                activeTab === col
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800/60 hover:text-zinc-400'
              }`}
            >
              {col} ({jobs.filter(j => j.status === col).length})
            </button>
          ))}
        </div>

        {/* Kanban Board Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1 h-full min-h-0">
          {columns.map(col => {
            const columnJobs = jobs.filter(j => j.status === col);
            return (
              <div 
                key={col} 
                className={`bg-zinc-900/30 rounded-xl p-4 border border-zinc-900 flex flex-col max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-160px)] ${
                  activeTab === col ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Column Header */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-900 shrink-0">
                  <h3 className="text-xs font-bold uppercase font-mono tracking-widest text-zinc-400">{col}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 font-mono border border-zinc-800/40">
                    {columnJobs.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1 -mr-1 [scrollbar-color:#27272a_#09090b] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700">
                  {columnJobs.length === 0 ? (
                    <div className="h-24 border border-dashed border-zinc-800/60 rounded-xl flex items-center justify-center text-xs text-zinc-600 font-mono">
                      NO_ACTIVE_DATA
                    </div>
                  ) : (
                    columnJobs.map(job => (
                      <div key={job.id} className="bg-zinc-900/80 border border-zinc-800/60 p-4 rounded-xl hover:border-zinc-700 transition-all duration-150 flex flex-col min-h-[160px]">
                        <div className="flex justify-between items-start gap-3 mb-1">
                          <h4 className="font-semibold text-sm text-zinc-200 tracking-tight leading-snug">{job.title}</h4>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                            job.match_score >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {job.match_score}% MATCH
                          </span>
                        </div>
                        
                        <p className="text-xs text-zinc-400 mb-3">{job.company}</p>

                        <div className="mb-4 space-y-2 flex-1">
                          <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed italic">
                            {job.description || "No description provided."}
                          </p>
                          {job.url && (
                            <a 
                              href={job.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-block text-[10px] text-emerald-500 hover:text-emerald-400 font-mono tracking-tighter"
                            >
                              VIEW_JOB_SOURCE →
                            </a>
                          )}
                        </div>

                        {/* Actions Alignment Setup */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-zinc-900 mt-auto">
                          <button 
                            onClick={() => triggerMockAIScript(job)} 
                            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-[11px] font-bold px-2.5 py-1.5 rounded-md transition font-mono tracking-tight"
                          >
                            GENERATE_AI
                          </button>
                          
                        {col === 'Backlog' && (
                          <button 
                            onClick={() => updateJobStatus(job.id, 'Applied')} 
                            className="text-zinc-400 border border-zinc-800 hover:bg-zinc-800 text-[11px] font-mono px-2.5 py-1.5 rounded-md transition ml-auto"
                          >
                            MOVE →
                          </button>
                        )}

                          {col === 'Applied' && (
                            <div className="flex items-center gap-1.5 ml-auto">
                              <button 
                                onClick={() => updateJobStatus(job.id, 'Backlog')} 
                                className="text-zinc-500 border border-zinc-800 hover:bg-zinc-800 text-[10px] font-mono px-2 py-1.5 rounded-md transition"
                                title="Return to Backlog"
                              >
                                ↩️ BACK
                              </button>
                              <button 
                                onClick={() => updateJobStatus(job.id, 'Suspended')} 
                                className="text-red-400/80 border border-red-950/40 hover:bg-red-950/20 text-[10px] font-mono px-2 py-1.5 rounded-md transition"
                                title="No response/Stalled"
                              >
                                🛑 HOLD
                              </button>
                              <button 
                                onClick={() => updateJobStatus(job.id, 'Interviewing')} 
                                className="text-zinc-400 border border-zinc-800 hover:bg-zinc-800 text-[11px] font-mono px-2.5 py-1.5 rounded-md transition"
                              >
                                INTERVIEW →
                              </button>
                            </div>
                          )}

                          {col === 'Interviewing' && (
                            <div className="flex flex-col gap-1.5 w-full mt-1">
                              <div className="flex justify-between items-center gap-1.5 w-full">
                                <button 
                                  onClick={() => updateJobStatus(job.id, 'Applied')} 
                                  className="text-zinc-500 border border-zinc-800 hover:bg-zinc-800/60 text-[10px] font-mono px-2 py-1 rounded-md transition"
                                >
                                  ↩️ BACK
                                </button>
                                <button 
                                  onClick={() => updateJobStatus(job.id, 'Suspended')} 
                                  className="text-red-400/60 border border-zinc-800/50 hover:bg-red-950/20 text-[10px] font-mono px-2 py-1 rounded-md transition"
                                >
                                  🛑 HOLD
                                </button>
                              </div>
                              <button 
                                onClick={() => updateJobStatus(job.id, 'Offer')} 
                                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[11px] font-mono py-1.5 rounded-md transition tracking-tight text-center"
                              >
                                ⭐ RECEIVE_OFFER →
                              </button>
                            </div>
                          )}

                          {col === 'Offer' && (
                            <div className="flex items-center gap-1.5 ml-auto">
                              <button 
                                onClick={() => updateJobStatus(job.id, 'Interviewing')} 
                                className="text-zinc-500 border border-zinc-800 hover:bg-zinc-800 text-[10px] font-mono px-2 py-1.5 rounded-md transition"
                              >
                                ↩️ BACK
                              </button>
                              <button 
                                onClick={() => updateJobStatus(job.id, 'Suspended')} 
                                className="text-red-400/80 border border-red-950/40 hover:bg-red-950/20 text-[10px] font-mono px-2 py-1.5 rounded-md transition"
                              >
                                🛑 HOLD
                              </button>
                            </div>
                          )}

                          {col === 'Suspended' && (
                            <button 
                              onClick={() => updateJobStatus(job.id, 'Backlog')} 
                              className="text-zinc-500 border border-zinc-800/50 hover:bg-zinc-800 text-[10px] font-mono px-2 py-1.5 rounded-md transition ml-auto"
                            >
                              ↩️ REACTIVATE
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* AI Prompt Script Modal Overlay */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 max-w-xl w-full rounded-2xl p-5 md:p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <h3 className="text-xs font-bold text-emerald-400 font-mono tracking-wider mb-1">TAILORED APPLICATION ENGINE</h3>
            <p className="text-xs text-zinc-400 font-mono mb-4 truncate">{selectedJob.title} // {selectedJob.company}</p>
            
            <div className="flex-1 min-h-0">
              {generating ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 text-xs font-mono text-zinc-500 border border-zinc-800 rounded-xl bg-zinc-950">
                  <span className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  RUNNING SEMANTIC EXTRACTION MATRIX...
                </div>
              ) : (
                <textarea 
                  className="w-full h-64 md:h-80 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 leading-relaxed focus:outline-none focus:border-zinc-700 resize-none [scrollbar-color:#27272a_#09090b] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full" 
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