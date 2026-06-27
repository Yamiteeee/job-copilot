import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// 1. GET: Fetches jobs for your portfolio frontend board
export async function GET() {
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
    // Check Authorization Header Token
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized Pipeline Access' }, { status: 401 });
    }

    // Parse the payload incoming from Make.com
    const { title, company, description, url } = await req.json();

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Insert data row straight into Supabase table
    const { data, error } = await supabase
      .from('scanned_jobs')
      .insert([{ title, company, description, url }])
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