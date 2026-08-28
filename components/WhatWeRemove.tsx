"use client";

import React from 'react';
import { REMOVALS } from '@/data/portfolioData';

export const WhatWeRemove: React.FC = () => {
  return (
    <section className="max-w-[1440px] mx-auto mt-[116px] px-10">
      <div
        data-reveal="1"
        className="border-t border-ink pt-3.5 flex items-baseline justify-between"
      >
        <h2 className="m-0 font-mono text-[12px] tracking-[0.12em] uppercase font-medium text-ink">
          What we remove
        </h2>
        <span className="font-mono text-[12px] text-grey-400">
          03 recurring failures
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-line mt-10 border border-line">
        {REMOVALS.map((r) => (
          <div
            key={r.no}
            data-reveal="1"
            className="bg-paper p-[34px_30px_40px] hover:bg-paper-alt transition-colors"
          >
            <div className="font-mono text-[11.5px] text-accent tracking-[0.08em]">
              {r.no}
            </div>
            <h3 className="my-[18px_14px] text-[25px] font-extrabold tracking-[-0.02em] leading-[1.15] text-ink [text-wrap:balance]">
              {r.title}
            </h3>
            <p className="m-0 mb-[22px] text-[15.5px] leading-[1.55] text-ink-muted">
              {r.body}
            </p>
            <div className="font-mono text-[11px] tracking-[0.05em] uppercase text-grey-400 border-t border-line pt-3">
              Replaced by → {r.replacedBy}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
