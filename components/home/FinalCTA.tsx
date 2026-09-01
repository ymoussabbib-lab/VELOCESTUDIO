import { CONTACT_MESSAGES, createWhatsAppHref } from '@/lib/contact';

export function FinalCTA() {
  return (
    <section className="border-t border-ink bg-ink px-4 py-20 text-paper md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-on-dark-muted">Demo systems / workflow audit / WhatsApp</p>
        <h2 className="mt-4 max-w-5xl text-5xl font-black uppercase leading-[0.9] md:text-7xl">Tell us the part of your day that always goes wrong.</h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-dark-muted">
          We&apos;ll map the workflow, show you what the software could look like, and tell you what it would take to build it.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={createWhatsAppHref(CONTACT_MESSAGES.general)} className="inline-flex min-h-11 items-center justify-center bg-accent px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-paper">
            Book a workflow audit &rarr;
          </a>
          <a href={createWhatsAppHref(CONTACT_MESSAGES.general)} className="inline-flex min-h-11 items-center justify-center border border-line-dark px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-paper">
            WhatsApp us
          </a>
        </div>
        <p className="mt-7 font-mono text-xs uppercase tracking-[0.18em] text-on-dark-muted">Sale / Rabat / Casablanca / Remote</p>
      </div>
    </section>
  );
}
