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
      if (isGuest || !userGroqKey?.trim()) {
        const matchedMockJobs = mockJobs.map(job => ({
          ...job,
          match_score: calculateMatchScore(job.title, job.description)
        }));
        setJobs(matchedMockJobs);
        setLoading(false);
        return;
      }

      // --- PRODUCTION/LIVE MODE ---
      try {
        const response = await fetch('/api/jobs', {
          headers: {
            'Authorization': `Bearer ${userGroqKey}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`PIPELINE_DESYNC: Server status ${response.status}`);
        }
        
        const rawDatabaseData = await response.json();
        
        const liveMatchedJobs = rawDatabaseData.map((job: any) => ({
          ...job,
          status: job.status || 'Backlog',
          match_score: calculateMatchScore(job.title, job.description)
        }));

        setJobs(liveMatchedJobs);
      } catch (error) {
        console.error("LIVE_DATABASE_FETCH_ERROR:", error);
        setJobs([]); 
      } finally {
        setLoading(false);
      }
    }

    syncJobPipeline();
  }, [isGuest, userGroqKey]); 

  const updateJobStatus = async (jobId: string, newStatus: Job['status']) => {
    // 1. Snappy UI state switch
    setJobs(prevJobs =>
      prevJobs.map(job => (job.id === jobId ? { ...job, status: newStatus } : job))
    );
    
    // 2. Persistent Mutation to DB via backend proxy
    if (!isGuest && userGroqKey?.trim()) {
      try {
        const response = await fetch('/api/jobs', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userGroqKey}` 
          },
          body: JSON.stringify({ jobId, status: newStatus }),
        });

        if (!response.ok) {
          throw new Error('Failed to synchronize status mutation to remote database.');
        }
      } catch (err) {
        console.error("REMOTE_DATABASE_MUTATION_FAILURE:", err);
      }
    }
  };

  return { jobs, updateJobStatus, loading };
}