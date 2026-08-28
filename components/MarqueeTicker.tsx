"use client";

import React from 'react';
import { PROJECTS } from '@/data/portfolioData';

export const MarqueeTicker: React.FC = () => {
  const tickerItems = [
    ...PROJECTS.map((p) => `${p.no} ${p.name} — ${p.sector}`),
    'Workflow audits open'
  ];

  const renderTickerGroup = () => (
    <div className="flex items-center gap-10 px-5 py-[13px] font-mono text-[12px] tracking-[0.08em] uppercase whitespace-nowrap text-on-dark shrink-0">
      {tickerItems.map((item, idx) => (
        <React.Fragment key={idx}>
          <span>{item}</span>
          <span className="text-accent select-none">◆</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section className="mt-16 border-y border-ink overflow-hidden bg-ink text-on-dark">
      <div className="flex w-max animate-vs-slide will-change-transform">
        {renderTickerGroup()}
        {renderTickerGroup()}
      </div>
    </section>
  );
};
