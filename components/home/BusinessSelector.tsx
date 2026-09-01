'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BUSINESS_SOLUTIONS } from '@/data/projects';
import { createWhatsAppHref } from '@/lib/contact';

export function BusinessSelector() {
  const [activeKey, setActiveKey] = useState(BUSINESS_SOLUTIONS[0].key);
  const active = BUSINESS_SOLUTIONS.find((solution) => solution.key === activeKey) ?? BUSINESS_SOLUTIONS[0];

  return (
    <section id="systems" className="border-t border-ink px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">Business type selector</p>
        <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-none md:text-6xl">What kind of business are you running?</h2>
        <div className="mt-9 flex snap-x gap-2 overflow-x-auto pb-2">
          {BUSINESS_SOLUTIONS.map((solution) => (
            <button
              key={solution.key}
              type="button"
              aria-pressed={active.key === solution.key}
              onClick={() => setActiveKey(solution.key)}
              className={`min-h-11 shrink-0 border px-4 font-mono text-xs uppercase tracking-[0.12em] ${active.key === solution.key ? 'border-ink bg-ink text-paper' : 'border-line bg-paper-alt'}`}
            >
              {solution.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 border border-ink bg-paper-alt p-4 md:p-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h3 className="text-3xl font-black uppercase leading-none md:text-5xl">{active.heading}</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <List title="Pain points" items={active.painPoints} />
              <List title="The system handles" items={active.modules.slice(0, 9)} />
            </div>
            <div className="mt-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">Sample workflow</p>
              <p className="mt-3 text-lg leading-relaxed text-ink-muted">{active.workflow.join(' -> ')}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {active.projectSlug ? (
                <Link href={`/work/${active.projectSlug}`} className="inline-flex min-h-11 items-center justify-center bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-paper">
                  {active.ctaLabel} &rarr;
                </Link>
              ) : null}
              <a href={createWhatsAppHref(active.whatsappMessage)} className="inline-flex min-h-11 items-center justify-center border border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.14em]">
                WhatsApp us
              </a>
            </div>
          </div>
          <div className="overflow-hidden border border-ink bg-white">
            <Image src={active.visual.src} alt={active.visual.alt} width={active.visual.width} height={active.visual.height} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[16/10] h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">{title}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="border border-line bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
