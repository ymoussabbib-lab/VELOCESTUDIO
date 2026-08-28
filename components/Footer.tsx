"use client";

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-line-dark bg-ink text-grey-400">
      <div className="max-w-[1440px] mx-auto px-10 py-7 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[11.5px] tracking-[0.05em]">
        <span>© 2026 Veloce Studio — Casablanca</span>
        <span>Systems in production, not concepts</span>
      </div>
    </footer>
  );
};
