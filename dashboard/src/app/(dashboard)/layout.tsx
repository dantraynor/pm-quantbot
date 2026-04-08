import { LogoutButton } from '@/components/LogoutButton';
import { getAppDisplayName } from '@/lib/branding';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'OVERVIEW', href: '/overview' },
  { label: 'CRYPTO', href: '/crypto' },
  { label: 'SPORTS', href: '/sports' },
  { label: 'POSITIONS', href: '/positions' },
  { label: 'SYSTEM', href: '/system' },
] as const;

// Mini service health sidebar component (server-rendered, static labels only
// — real-time dots are driven by client state on each page)
function SidebarHealthPlaceholder() {
  const services = ['redis', 'ingestion', 'signal-core', 'execution', 'settlement'];
  return (
    <div className="px-3 py-2 border-t border-bb-border">
      <div className="text-[10px] uppercase tracking-wider text-bb-dim mb-1.5">Services</div>
      <div className="flex flex-col gap-1">
        {services.map((s) => (
          <div key={s} className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-bb-muted" />
            <span className="text-[10px] text-bb-dim uppercase">{s}</span>
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
      {/* Left sidebar */}
      <aside className="w-48 flex flex-col border-r border-bb-border bg-bb-bg shrink-0">
        {/* Top bar branding + logout */}
        <div className="px-3 py-3 border-b border-bb-border flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-bb-orange tracking-wider">{appName}</div>
            <div className="text-[10px] text-bb-dim mt-0.5">Polymarket</div>
          </div>
          <LogoutButton className="shrink-0 px-2 py-1 text-[10px] uppercase tracking-wider text-bb-dim hover:text-bb-red border border-transparent hover:border-bb-border disabled:opacity-50" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                block px-3 py-1.5
                text-[10px] uppercase tracking-wider text-bb-dim
                hover:text-bb-text hover:bg-bb-border/30
                transition-colors
                border-l-2 border-transparent
                hover:border-bb-orange
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom: service health placeholders */}
        <SidebarHealthPlaceholder />
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-auto bg-bb-bg">
        {children}
      </main>
    </div>
  );
}
