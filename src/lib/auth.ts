import { isSupabaseConfigured } from '@/lib/supabase-config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type CurrentUser = { email: string };

/**
 * The current user, or null. In DEMO mode (no Supabase env) returns a demo user
 * so the dashboard is viewable out of the box. PER PROJECT: also read the role
 * from a `profiles` table and gate on it (see docs/auth-roles.md).
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured) return { email: 'demo@easywebs.dev' };
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ? { email: data.user.email ?? '' } : null;
}
