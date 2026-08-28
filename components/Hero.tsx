"use client";

import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section id="top" className="max-w-[1440px] mx-auto px-10 pt-[88px]">
      <div className="flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.1em] uppercase text-grey-400 mb-9 animate-vs-rise">
        <span className="w-[7px] height-[7px] h-[7px] bg-accent rounded-full animate-vs-blink shrink-0" />
        <span>Casablanca — software engineering studio</span>
      </div>

      <h1 className="text-[clamp(46px,6.1vw,100px)] leading-[0.92] tracking-[-0.04em] font-black m-0 max-w-[20ch] text-ink">
        <span className="block animate-vs-rise [animation-delay:60ms]">Five businesses</span>
        <span className="block animate-vs-rise [animation-delay:150ms]">run their entire day</span>
        <span className="block animate-vs-rise [animation-delay:240ms]">on software</span>
        <span className="block animate-vs-rise [animation-delay:330ms]">
          <span className="font-normal italic">we</span> built.
        </span>
      </h1>
    </section>
  );
};
