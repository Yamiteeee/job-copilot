// src/utils/matchEngine.ts
import { devProfile } from '@/utils/profile'; // Adjust this path if your profile file is somewhere else

export function calculateMatchScore(title: string, description: string | null): number {
  if (!description) return 0;

  const combinedText = `${title} ${description}`.toLowerCase();
  let totalWeight = 0;
  let matchedWeight = 0;

  // 1. Define Core Stack Items with heavy weights (Primary Technical Drivers)
  const coreStack = [
    { keywords: ['next.js', 'nextjs'], weight: 25 },
    { keywords: ['react'], weight: 20 },
    { keywords: ['typescript', 'ts'], weight: 15 },
    { keywords: ['node.js', 'nodejs', 'node'], weight: 15 },
    { keywords: ['php'], weight: 15 },
    { keywords: ['supabase', 'postgresql', 'postgres'], weight: 10 }
  ];

  // Evaluate Core Stack
  coreStack.forEach(skill => {
    totalWeight += skill.weight;
    const matches = skill.keywords.some(keyword => combinedText.includes(keyword));
    if (matches) {
      matchedWeight += skill.weight;
    }
  });

  // 2. Define Supporting Toolkit Items with secondary weights
  const supportingStack = [
    { keywords: ['automation', 'n8n', 'make.com', 'make', 'zapier'], weight: 15 },
    { keywords: ['openai', 'groq', 'llm', 'ai api'], weight: 15 },
    { keywords: ['javascript', 'js'], weight: 10 },
    { keywords: ['tailwind'], weight: 5 },
    { keywords: ['rest api', 'apis'], weight: 5 },
    { keywords: ['git', 'github'], weight: 5 }
  ];

  // Evaluate Supporting Stack
  supportingStack.forEach(skill => {
    totalWeight += skill.weight;
    const matches = skill.keywords.some(keyword => combinedText.includes(keyword));
    if (matches) {
      matchedWeight += skill.weight;
    }
  });

  // 3. Contextual Title Boosters (If the title fits your professional target role)
  const titleText = title.toLowerCase();
  let titleBonus = 0;
  if (titleText.includes('full-stack') || titleText.includes('fullstack')) titleBonus += 10;
  if (titleText.includes('automation') || titleText.includes('integrator')) titleBonus += 10;
  if (titleText.includes('junior') || titleText.includes('associate')) titleBonus += 5;

  // Calculate base math matching percentage
  const basePercentage = (matchedWeight / totalWeight) * 100;
  
  // Combine base match score + title bonus metrics, capped neatly at 100%
  const finalScore = Math.min(Math.round(basePercentage + titleBonus), 100);

  // Fallback floor: If it doesn't match basic modern JS requirements, drop score floor safely
  const hasBasicStack = ['react', 'next.js', 'nextjs', 'typescript', 'php', 'automation'].some(k => combinedText.includes(k));
  if (!hasBasicStack && finalScore > 30) {
    return Math.round(finalScore * 0.4); // Suppress misleading high scores for unrelated listings
  }

  return finalScore;
}