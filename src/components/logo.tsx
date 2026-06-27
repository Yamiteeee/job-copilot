// src/components/logo.tsx
'use client';

import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 font-mono select-none ${className}`}>
      {/* Structural Core Graphic Matrix Icon */}
      <div className="relative flex h-7 w-7 items-center justify-center rounded border border-emerald-800/80 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
        <span className="text-xs font-black text-emerald-400 tracking-tighter">⚡</span>
        
        {/* Radar Pulse Status Indicators */}
        <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
      </div>

      {/* Typography Configuration Branding */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span className="text-sm font-black tracking-wider text-zinc-100">
            JOB<span className="text-emerald-400">_COPILOT</span>
          </span>
          <span className="rounded bg-zinc-800 px-1 py-0.5 text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
            v1.0
          </span>
        </div>
        <span className="text-[9px] text-zinc-500 tracking-tight mt-0.5 font-sans">
          AUTOMATED_MATCH_ENGINE
        </span>
      </div>
    </div>
  );
}