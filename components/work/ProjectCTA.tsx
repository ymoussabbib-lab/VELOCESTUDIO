import Link from 'next/link';
import { createWhatsAppHref } from '@/lib/contact';

interface ProjectCTAProps {
  href?: string;
  label?: string;
  whatsappMessage: string;
}

export function ProjectCTA({ href, label = 'Start a project', whatsappMessage }: ProjectCTAProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {href ? (
        <Link href={href} className="inline-flex min-h-11 items-center justify-center border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-paper">
          {label} &rarr;
        </Link>
      ) : null}
      <a
        href={createWhatsAppHref(whatsappMessage)}
        className="inline-flex min-h-11 items-center justify-center border border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.14em]"
      >
        WhatsApp us
      </a>
    </div>
  );
}
