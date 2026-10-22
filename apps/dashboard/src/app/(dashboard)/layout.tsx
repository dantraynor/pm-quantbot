import { LogoutButton } from '@/components/LogoutButton';
import { getAppDisplayName } from '@/lib/branding';
import Link from 'next/link';

const NAV_ITEMS = [
  { num: '01', label: 'Overview', href: '/overview' },
  { num: '02', label: 'Crypto', href: '/crypto' },
  { num: '03', label: 'Sports', href: '/sports' },
  { num: '04', label: 'Positions', href: '/positions' },
  { num: '05', label: 'System', href: '/system' },
] as const;

const SIDEBAR_SERVICES = ['redis', 'ingestion', 'signal-core', 'execution', 'settlement'];

function SidebarHealthPlaceholder() {
  return (
    <div className="px-4 py-4 border-t border-bb-border">
      <div className="flex items-baseline gap-1.5 mb-2.5">
        <span className="display text-bb-dim text-[12px] leading-none">§</span>
        <span className="text-[9px] uppercase tracking-wider3 text-bb-dim">Services</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {SIDEBAR_SERVICES.map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span className="w-1 h-1 bg-bb-muted" />
            <span className="text-[10px] text-bb-dim uppercase tracking-wider">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const appName = getAppDisplayName();
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-56 flex flex-col border-r border-bb-border bg-bb-panel/40 shrink-0 backdrop-blur-sm">
        <div className="px-4 pt-5 pb-4 border-b border-bb-border">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="display text-bb-orange text-[14px] leading-none">№</span>
                <span className="text-[9px] uppercase tracking-wider3 text-bb-dim">
                  Edition I
                </span>
              </div>
              <div className="display text-bb-paper text-[26px] leading-[0.95] mt-1.5 -ml-0.5">
                {appName}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[9px] uppercase tracking-wider3 text-bb-dim">
                  Polymarket
                </span>
                <span className="w-1 h-1 bg-bb-muted" />
                <span className="text-[9px] uppercase tracking-wider3 text-bb-dim">
                  Quant Lab
                </span>
              </div>
            </div>
            <LogoutButton className="shrink-0 px-1.5 py-1 text-[9px] uppercase tracking-wider3 text-bb-dim hover:text-bb-red transition-colors" />
          </div>
        </div>

        <nav className="flex-1 py-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                group block px-4 py-2
                border-l-2 border-transparent
                hover:border-bb-orange
                transition-colors
              "
            >
              <div className="flex items-baseline gap-2.5">
                <span className="display text-bb-dim text-[11px] group-hover:text-bb-orange transition-colors leading-none">
                  {item.num}
                </span>
                <span className="text-[11px] uppercase tracking-wider2 text-bb-paper group-hover:text-bb-paper transition-colors">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </nav>

        <SidebarHealthPlaceholder />

        <div className="px-4 py-3 border-t border-bb-border">
          <div className="text-[8px] uppercase tracking-wider3 text-bb-muted leading-relaxed">
            All trading is paper-mode by default. Live execution requires explicit kill-switch enable.
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-bb-bg">
        {children}
      </main>
    </div>
  );
}
