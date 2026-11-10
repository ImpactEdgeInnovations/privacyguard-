import Link from 'next/link';

type IconName = 'shield' | 'cases' | 'plus' | 'lock' | 'help' | 'queue' | 'message';
const paths: Record<IconName, React.ReactNode> = {
  shield: <><path d="M12 22s7-3 7-10V5l-7-3-7 3v7c0 7 7 10 7 10Z" /><path d="m9 12 2 2 4-4" /></>,
  cases: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9 9a3 3 0 1 1 4 3c-.8.4-1 1-1 2m0 3h.01" /></>,
  queue: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2m6 2V2M9 10h6m-6 4h6" /></>,
  message: <path d="M20 11a8 8 0 0 1-8 8H4l1.5-3.5A8 8 0 1 1 20 11Z" />,
};

export function Icon({ name }: { name: IconName }) {
  return <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export type ConsumerPage = 'home' | 'new' | 'privacy' | 'help';
const links: { id: ConsumerPage; label: string; icon: IconName }[] = [
  { id: 'home', label: 'My cases', icon: 'cases' },
  { id: 'new', label: 'Report', icon: 'plus' },
  { id: 'privacy', label: 'Privacy', icon: 'lock' },
  { id: 'help', label: 'Help', icon: 'help' },
];

export function ConsumerNavigation({ page }: { page: ConsumerPage }) {
  return <nav className="consumer-nav" aria-label="Your workspace">
    {links.map(({ id, label, icon }) => <Link key={id} href={'/?view=' + id} aria-current={page === id ? 'page' : undefined}>
      <Icon name={icon} /><span>{label}</span>
    </Link>)}
  </nav>;
}
