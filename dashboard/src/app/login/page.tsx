'use client';

import { getAppDisplayName } from '@/lib/branding';
import { dashboardFetch } from '@/lib/dashboard-fetch';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await dashboardFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || `Login failed (${res.status})`);
        setPending(false);
        return;
      }
      router.replace('/overview');
      router.refresh();
    } catch {
      setError('Network error');
    }
    setPending(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-sm border border-bb-border bg-bb-panel p-6">
        <div className="text-[11px] font-bold text-bb-orange tracking-wider mb-1">{getAppDisplayName()}</div>
        <div className="text-[10px] text-bb-dim mb-6">Sign in to access the dashboard</div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="pw" className="block text-[10px] uppercase tracking-wider text-bb-dim mb-1">
              Password
            </label>
            <input
              id="pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bb-bg border border-bb-border px-2 py-1.5 text-[11px] text-bb-text focus:outline-none focus:border-bb-orange"
              disabled={pending}
            />
          </div>
          {error ? <div className="text-[10px] text-bb-red">{error}</div> : null}
          <button
            type="submit"
            disabled={pending || !password}
            className="w-full py-2 text-[10px] font-bold uppercase tracking-wider border border-bb-orange text-bb-orange hover:bg-bb-orange/10 disabled:opacity-50"
          >
            {pending ? '…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
