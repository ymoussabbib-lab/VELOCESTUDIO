"use client";

import React from 'react';

interface ContactBandProps {
  onOpenConsult?: () => void;
  onGoIndex?: () => void;
}

export const ContactBand: React.FC<ContactBandProps> = ({ onOpenConsult, onGoIndex }) => {
  return (
    <section id="contact" className="mt-[116px] bg-ink text-on-dark">
      <div className="max-w-[1440px] mx-auto px-10 pt-24 pb-[88px] grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-16 items-end">
        <div>
          <h2 className="m-0 text-[clamp(38px,4.6vw,68px)] leading-[0.98] tracking-[-0.035em] font-black [text-wrap:balance]">
            Tell us the part of the day that always goes wrong.
          </h2>
          <p className="mt-[26px] mb-0 text-[17px] leading-[1.55] text-on-dark-muted max-w-[56ch]">
            A workflow audit is one session. We sit with the people doing the manual work, map every step,
            and come back with what software should own and what it shouldn&apos;t.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          <button
            onClick={onOpenConsult}
            className="w-full bg-accent text-on-dark px-6 py-5 font-mono text-[13px] tracking-[0.06em] uppercase flex justify-between items-center hover:bg-paper hover:text-ink transition-colors cursor-pointer text-left"
          >
            <span>Book a workflow audit</span>
            <span className="text-[16px]">→</span>
          </button>

          <button
            onClick={onGoIndex}
            className="w-full border border-line-dark text-on-dark px-6 py-5 font-mono text-[13px] tracking-[0.06em] uppercase flex justify-between items-center hover:border-paper transition-colors cursor-pointer text-left"
          >
            <span>Read a build in full</span>
            <span className="text-[16px]">↑</span>
          </button>
        </div>
      </div>
    </section>
  );
};
