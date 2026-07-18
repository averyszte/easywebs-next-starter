import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '@/lib/supabase-config';

/**
 * Service-role client — BYPASSES RLS. Use ONLY in trusted server code (webhooks,
 * admin jobs). NEVER import into a client component or expose the key. The key is
 * read from a server-only env var (never NEXT_PUBLIC_).
 */
export function createSupabaseAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
