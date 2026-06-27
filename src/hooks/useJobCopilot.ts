import { useState, useEffect } from 'react';
import { Job, mockJobs } from '@/utils/mockData';
import { calculateMatchScore } from '@/utils/matchEngine';

export function useJobCopilot(isGuest: boolean, userGroqKey?: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function syncJobPipeline() {
      setLoading(true);

      // --- SANDBOX/DEMO MODE ---
      if (isGuest) {
        const matchedMockJobs = mockJobs.map(job => ({
          ...job,
          match_score: calculateMatchScore(job.title, job.description)
        }));
        setJobs(matchedMockJobs);
        setLoading(false);
        return;
      }

      // --- PRODUCTION/LIVE MODE: STAGE GATE VALIDATION ---
      try {
        const response = await fetch('/api/jobs'); // Your live Supabase proxy route
        if (!response.ok) {
          throw new Error(`PIPELINE_DESYNC: Server status ${response.status}`);
        }
        
        const rawDatabaseData = await response.json();
        
        // Process real database text records through your local matching algorithm
        const liveMatchedJobs = rawDatabaseData.map((job: any) => ({
          ...job,
          status: job.status || 'Backlog', // Fallback defaults if columns are empty
          match_score: calculateMatchScore(job.title, job.description)
        }));

        setJobs(liveMatchedJobs);
      } catch (error) {
        console.error("LIVE_DATABASE_FETCH_ERROR:", error);
        setJobs([]); // Clear board state to prevent silent leaks or mixed mock data artifacts
      } finally {
        setLoading(false);
      }
    }

    syncJobPipeline();
  }, [isGuest]); // Triggers database synchronization instantly upon mode switch toggles

  const updateJobStatus = async (jobId: string, newStatus: Job['status']) => {
    // Instantly update local UI state layout layout optimizations 
    setJobs(prevJobs =>
      prevJobs.map(job => (job.id === jobId ? { ...job, status: newStatus } : job))
    );
    
    // Write dynamic record mutations safely back to your production database
    if (!isGuest && userGroqKey?.trim()) {
      try {
        console.log(`Live DB Action: Committing row updates to remote table layout...`);
        
        // OPTIONAL / PHASE 2 STUB: Add a PATCH/POST request here if you want column changes 
        // to persist permanently inside your Supabase scanned_jobs table on drag/move events.
      } catch (err) {
        console.error("REMOTE_DATABASE_MUTATION_FAILURE:", err);
      }
    }
  };

  return { jobs, updateJobStatus, loading };
}