import Link from 'next/link';
import { CONTACT_MESSAGES, createWhatsAppHref } from '@/lib/contact';

export function MobileStickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-ink bg-paper p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:hidden">
      <Link href="#systems" className="inline-flex min-h-11 items-center justify-center bg-ink font-mono text-xs uppercase tracking-[0.12em] text-paper">
        See systems
      </Link>
      <a href={createWhatsAppHref(CONTACT_MESSAGES.general)} className="inline-flex min-h-11 items-center justify-center border border-ink font-mono text-xs uppercase tracking-[0.12em]">
        WhatsApp
      </a>
    </div>
  );
}
