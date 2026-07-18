'use server';

import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase-config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function signInAction(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) redirect('/login?error=1');
  }
  // DEMO mode (no Supabase env): just enter the dashboard.
  redirect('/dashboard');
}
