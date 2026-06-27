export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  url: string;
  // Add 'Suspended' right here at the end of the union type string array:
  status: 'Backlog' | 'Applied' | 'Interviewing' | 'Offer' | 'Suspended';
  match_score: number;
}

export const mockJobs: Job[] = [
  {
    id: 'mock-1',
    title: 'Junior Full-Stack Developer',
    company: 'US Tech Venture (Remote)',
    description: 'Looking for a Next.js and Supabase wizard to handle rapid prototyping, responsive React layouts, and real-time feature deployment.',
    url: 'https://weworkremotely.com',
    status: 'Backlog',
    match_score: 95
  },
  {
    id: 'mock-2',
    title: 'Junior Automation Specialist',
    company: 'Growth Scale AI',
    description: 'Build robust backend data pipelines, custom webhooks, and asynchronous cron architectures using TypeScript, Next.js API routing, and cloud automation workflows.',
    url: 'https://remoteok.com',
    status: 'Applied',
    match_score: 89
  },
  {
    id: 'mock-3',
    title: 'React & Node.js Engineer',
    company: 'SaaS Pulse Media',
    description: 'Looking for an engineering talent comfortable building complex client-side state synchronization engines and high-throughput Node.js microservices.',
    url: 'https://wellfound.com',
    status: 'Interviewing',
    match_score: 92
  },
  {
    id: 'mock-4',
    title: 'AI Integration Developer',
    company: 'Nexus Core Automation',
    description: 'Fusing Large Language Models into enterprise production routines. Heavy emphasis on OpenAI/Groq prompt fine-tuning, structural JSON schema responses, and Edge function delivery.',
    url: 'https://linkedin.com',
    status: 'Backlog',
    match_score: 94
  },
  {
    id: 'mock-5',
    title: 'Software Engineer - Mobile Applications',
    company: 'Veloce Digital Systems',
    description: 'Seeking a component architect to handle cross-platform interfaces, client-side caching strategies, and offline database state replication.',
    url: 'https://indeed.com',
    status: 'Applied',
    match_score: 87
  },
  {
    id: 'mock-6',
    title: 'Junior Web Developer (PHP & Next.js)',
    company: 'Pixel Forge Studio',
    description: 'Migrating legacy backend dashboards into modern full-stack web instances. Requires solid foundations in relational databases, state lifting, and component lifecycle paradigms.',
    url: 'https://onlinejobs.ph',
    status: 'Interviewing',
    match_score: 91
  },
  {
    id: 'mock-7',
    title: 'Full-Stack Developer (Next.js/TypeScript)',
    company: 'Apex Launchpad',
    description: 'Congratulations! Technical assessment and system panels concluded successfully. Finalizing alignment for direct development operations over high-speed async server routes.',
    url: 'https://weworkremotely.com',
    status: 'Offer',
    match_score: 96
  }
];