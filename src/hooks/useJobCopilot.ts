import { useState, useEffect } from 'react';
import { Job, mockJobs } from '@/utils/mockData';
import { calculateMatchScore } from '@/utils/matchEngine'; // Imported your new engine

// Added userGroqKey parameter for state gate validation
export function useJobCopilot(isGuest: boolean, userGroqKey?: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Run the match engine across the data array to override mock values with profile logic
    const matchedMockJobs = mockJobs.map(job => ({
      ...job,
      match_score: calculateMatchScore(job.title, job.description)
    }));

    setJobs(matchedMockJobs);
    setLoading(false);
  }, [isGuest]);

  const updateJobStatus = (jobId: string, newStatus: Job['status']) => {
    // Instantly update the UI layout on drag or button click
    setJobs(prevJobs =>
      prevJobs.map(job => (job.id === jobId ? { ...job, status: newStatus } : job))
    );
    
    // Double safeguard check: Only log or interact with production endpoints if verified
    if (!isGuest && userGroqKey?.trim()) {
      console.log(`Live DB Action: Updating database row ${jobId} to status: ${newStatus}`);
      // Supabase persistent code will plug right here later in Phase 2!
    }
  };

  return { jobs, updateJobStatus, loading };
}