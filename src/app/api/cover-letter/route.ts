import { NextResponse } from 'next/server';
import { devProfile } from '@/utils/profile'; // Import your developer profile

export async function POST(req: Request) {
  try {
    const { title, company, description, isGuest, customKey } = await req.json();
    const isOwnerRequest = customKey === process.env.ADMIN_SECRET_KEY || (customKey && customKey.startsWith('gsk_'));

    if (!isOwnerRequest || isGuest) {
      await new Promise(res => setTimeout(res, 1200));
      return NextResponse.json({
        letter: `Dear Hiring Team at ${company},\n\nI am writing to express my strong interest in the ${title} position. Your focus on highly scalable software layouts matches my execution engineering with Next.js, React, and server-side configurations.\n\n[SANDBOX PREVIEW: Active for viewers. Real-time API loops and database hooks are masked to protect owner quotas.]`
      });
    }

    const activeApiKey = customKey.startsWith('gsk_') ? customKey : process.env.GROQ_API_KEY;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeApiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', 
    messages: [
            {
                role: 'system',
                content: `You are an expert technical career coach. Write hyper-focused, high-signal, and professional engineering cover letters that maximize applicant-to-job keyword alignment.
                
                Applicant Info:
                - Name: ${devProfile.name}
                - Current Location: ${devProfile.location}
                - Professional Focus: ${devProfile.title}
                - Key Core Stack: ${devProfile.skills.join(', ')}
                - Key Achievements: ${devProfile.experienceSummary}

                FORMATTING RULES:
                1. Do NOT include generic header placeholders (e.g., no [Date], [Company Address], or [Your Phone]). Start directly with a clean greeting.
                2. Use explicit double line breaks (\\n\\n) between paragraphs so it renders beautifully in a dashboard textarea.
                3. Maintain an innovative, direct, and elite engineering tone.`
            },
            {
                role: 'user',
                content: `Write a tailored, professional cover letter for a ${title} role at ${company} based on this job description: "${description}". 
                
                Analyze the description for key technical challenges and directly align them with my skills in Next.js, Supabase, and automation frameworks. 
                
                Structure the response exactly as follows:
                - Salutation: Dear the Engineering Team at ${company},
                - Paragraph 1: A powerful hook aligning my full-stack capabilities with their specific product/stack needs.
                - Paragraph 2: Core proof highlighting how my background in state-synchronized applications and data pipeline automations solves their requirements.
                - Sign-off: Best regards,\\n\\n${devProfile.name}

                Keep the total body strictly under 3 short paragraphs.`
            }
            ],
            temperature: 0.65 // Slightly lowered temperature for more consistent, highly-aligned professional phrasing
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Groq loop failed');

    return NextResponse.json({ letter: data.choices[0].message.content });

  } catch (err: any) {
    console.error('Secure Pipeline Exception:', err);
    return NextResponse.json({ error: err.message || 'Pipeline timeout' }, { status: 500 });
  }
}