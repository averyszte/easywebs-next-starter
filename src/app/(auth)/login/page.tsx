import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { isSupabaseConfigured } from '@/lib/supabase-config';
import { signInAction } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const fieldClass =
    'mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2 text-heading focus:border-brand focus:ring-2 focus:ring-brand focus:outline-none';

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Sign in</CardTitle>
          <p className="text-muted mt-1 text-sm">EasyWebs admin</p>
        </CardHeader>
        <CardContent>
          <form action={signInAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-heading text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-heading text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={fieldClass}
              />
            </div>
            {error && <p className="text-sm text-red-600">Incorrect email or password.</p>}
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          {!isSupabaseConfigured && (
            <p className="text-muted mt-4 text-center text-xs">
              Demo mode — Supabase isn’t configured, so any sign-in enters the dashboard.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
