import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Helper function to extract and validate bearer tokens from headers
function getAuthorizedToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7); // Removes 'Bearer ' prefix
}

// 1. GET: Fetches jobs for your frontend board (Secured for cross-device syncing)
export async function GET(req: Request) {
  const token = getAuthorizedToken(req);
  
  // Protects your backend records so random public viewers only see standard mock samples
  if (token !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized Pipeline Access' }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const { data, error } = await supabase
    .from('scanned_jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 2. POST: Receives new jobs from Make.com automation pipeline
export async function POST(req: Request) {
  try {
    const token = getAuthorizedToken(req);
    if (token !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized Pipeline Access' }, { status: 401 });
    }

    const { title, company, description, url } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // --- DUPLICATE FILTER CHECK ---
    let query = supabase.from('scanned_jobs').select('id');
    
    if (url) {
      query = query.eq('url', url);
    } else {
      query = query.eq('title', title).eq('company', company);
    }

    const { data: existingJobs, error: checkError } = await query;

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existingJobs && existingJobs.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Duplicate detected. Entry skipped.', 
        skipped: true 
      }, { status: 200 });
    }
    // -------------------------------

    const { data, error } = await supabase
      .from('scanned_jobs')
      .insert([{ title, company, description, url, status: 'Backlog' }]) // Default explicitly to Backlog
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });

  } catch (err: any) {
    console.error('Database Insertion Exception:', err);
    return NextResponse.json({ error: err.message || 'Server Processing Error' }, { status: 500 });
  }
}

// 3. PATCH: Updates job tracking pipeline stage (Saves status across all devices)
export async function PATCH(req: Request) {
  try {
    const token = getAuthorizedToken(req);
    if (token !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized Mutation Attempt' }, { status: 401 });
    }

    const { jobId, status } = await req.json();

    if (!jobId || !status) {
      return NextResponse.json({ error: 'Missing Mutation Payload parameters' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Execute the stage alteration row update
    const { error } = await supabase
      .from('scanned_jobs')
      .update({ status: status })
      .eq('id', jobId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Database state updated.' }, { status: 200 });

  } catch (err: any) {
    console.error('Database Mutation Exception:', err);
    return NextResponse.json({ error: err.message || 'Server Processing Error' }, { status: 500 });
  }
}