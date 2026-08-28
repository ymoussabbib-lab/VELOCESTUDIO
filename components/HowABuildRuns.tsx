"use client";

import React from 'react';
import { METHOD } from '@/data/portfolioData';

export const HowABuildRuns: React.FC = () => {
  return (
    <section id="method" className="max-w-[1440px] mx-auto mt-[116px] px-10">
      <div
        data-reveal="1"
        className="border-t border-ink pt-3.5 flex items-baseline justify-between"
      >
        <h2 className="m-0 font-mono text-[12px] tracking-[0.12em] uppercase font-medium text-ink">
          How a build runs
        </h2>
        <span className="font-mono text-[12px] text-grey-400">
          Four phases, one team
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-11">
        {METHOD.map((m) => (
          <div
            key={m.no}
            data-reveal="1"
            className="border-t-2 border-ink pt-[18px]"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-[42px] font-black tracking-[-0.04em] leading-none text-ink">
                {m.no}
              </span>
              <span className="font-mono text-[11px] text-grey-400 tracking-[0.05em] uppercase">
                {m.dur}
              </span>
            </div>

            <h3 className="my-[20px_10px] text-[19px] font-extrabold tracking-[-0.015em] text-ink">
              {m.title}
            </h3>
            <p className="m-0 text-[15px] leading-[1.5] text-ink-muted">
              {m.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
