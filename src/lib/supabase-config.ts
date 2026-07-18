// Public Supabase config. `isSupabaseConfigured` lets the app run in a DEMO mode
// (example data, no auth) until real Supabase env vars are set — so the scaffold
// builds and runs out of the box. See skills/supabase-skill.md.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
