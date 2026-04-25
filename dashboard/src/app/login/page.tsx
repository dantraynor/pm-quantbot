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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative oversized italic */}
      <span
        aria-hidden
        className="display text-bb-paper/[0.025] absolute pointer-events-none select-none -left-12 -top-32 text-[520px] leading-none"
      >
        №
      </span>
      <span
        aria-hidden
        className="display text-bb-orange/[0.06] absolute pointer-events-none select-none right-0 bottom-0 text-[260px] leading-none mix-blend-screen"
      >
        $
      </span>

      <div className="w-full max-w-sm border border-bb-border bg-bb-panel p-7 relative">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="display text-bb-orange text-[16px] leading-none">№</span>
          <span className="text-[9px] uppercase tracking-wider3 text-bb-dim">Edition I</span>
        </div>
        <div className="display-roman text-bb-paper text-[28px] leading-[0.95] mb-1">
          {getAppDisplayName()}
        </div>
        <div className="text-[10px] text-bb-dim mb-7 uppercase tracking-wider2">
          Polymarket · Quant Lab Terminal
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pw"
              className="block text-[9px] uppercase tracking-wider3 text-bb-dim mb-1.5"
            >
              <span className="display text-bb-dim text-[10px] mr-1">I</span>
              Password
            </label>
            <input
              id="pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bb-bg border border-bb-border px-3 py-2 text-[12px] text-bb-text font-mono focus:outline-none focus:border-bb-orange focus:bg-bb-panel transition-colors"
              disabled={pending}
            />
          </div>
          {error ? (
            <div className="text-[10px] text-bb-red flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-bb-red" />
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={pending || !password}
            className="w-full py-2.5 text-[10px] font-bold uppercase tracking-wider3 border border-bb-orange text-bb-orange hover:bg-bb-orange hover:text-bb-ink disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-bb-orange transition-colors"
          >
            {pending ? '· · ·' : 'Sign in →'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-bb-rule text-[9px] uppercase tracking-wider2 text-bb-muted leading-relaxed">
          Demo mode default. Trading is disabled until kill-switch is explicitly enabled in Redis.
        </div>
      </div>
    </div>
  );
}
