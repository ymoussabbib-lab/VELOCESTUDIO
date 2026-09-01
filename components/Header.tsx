'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { CONTACT_MESSAGES, createWhatsAppHref } from '@/lib/contact';

const navItems = [
  { href: '/#systems', label: 'Systems' },
  { href: '/#work', label: 'Work' },
  { href: '/#process', label: 'Process' },
  { href: '/#about', label: 'About' },
];

interface HeaderProps {
  onGoHome?: (hash?: string) => void;
  onOpenConsult?: () => void;
}

export function Header(_props: HeaderProps = {}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
        <Link href="/" className="font-mono text-sm tracking-[0.08em]" onClick={() => setOpen(false)}>
          <span className="font-bold">VELOCE</span> <span className="text-grey-600">STUDIO</span>
        </Link>

        <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-[0.12em] md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="min-h-11 content-center hover:text-accent">
              {item.label}
            </Link>
          ))}
          <a href={createWhatsAppHref(CONTACT_MESSAGES.general)} className="inline-flex min-h-11 items-center bg-ink px-4 text-paper hover:bg-accent hover:text-paper">
            Start a project &rarr;
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-ink md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden size={19} /> : <Menu aria-hidden size={19} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-ink bg-paper px-4 pb-5 pt-2 md:hidden" role="dialog" aria-label="Mobile navigation">
          <nav className="flex flex-col font-mono text-sm uppercase tracking-[0.12em]">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="border-b border-line py-4" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <a href={createWhatsAppHref(CONTACT_MESSAGES.general)} className="mt-4 inline-flex min-h-11 items-center justify-center bg-ink px-4 text-paper">
              Start a project &rarr;
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
