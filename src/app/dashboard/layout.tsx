import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { getCurrentUser } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase-config';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-surface flex h-16 items-center justify-between border-b px-6">
          <span className="text-heading font-semibold">Dashboard</span>
          <div className="flex items-center gap-3">
            {!isSupabaseConfigured && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Demo mode
              </span>
            )}
            <span className="text-muted text-sm">{user.email}</span>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
