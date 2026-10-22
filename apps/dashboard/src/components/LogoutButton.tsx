'use client';

import { dashboardFetch } from '@/lib/dashboard-fetch';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  /** e.g. compact header vs full-width sidebar footer */
  className?: string;
}

export function LogoutButton({ className }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await dashboardFetch('/api/auth/logout', { method: 'POST' });
      router.replace('/login');
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      disabled={pending}
      className={
        className ??
        'w-full text-left px-3 py-1.5 text-[10px] uppercase tracking-wider text-bb-dim hover:text-bb-red hover:bg-bb-border/30 disabled:opacity-50'
      }
    >
      {pending ? '…' : 'Log out'}
    </button>
  );
}
