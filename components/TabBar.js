'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, DiscoverIcon } from './Icons.js';

const TABS = [
  { href: '/home', label: 'Home', Icon: HomeIcon },
  { href: '/discover', label: 'Discover', Icon: DiscoverIcon },
];

export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`tab ${active ? 'tab--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <Icon width={24} height={24} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
