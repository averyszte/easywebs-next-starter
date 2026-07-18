import { redirect } from 'next/navigation';

// Root → the dashboard. (A public marketing page, if any, would live on the Astro site.)
export default function Home() {
  redirect('/dashboard');
}
