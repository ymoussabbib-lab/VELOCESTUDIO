"use client";

import React from 'react';

interface HeaderProps {
  onGoHome: (hash?: string) => void;
  onOpenConsult?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoHome, onOpenConsult }) => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    onGoHome(hash);
  };

  return (
    <header className="sticky top-0 z-50 h-[68px] bg-paper/90 backdrop-blur-[10px] border-b border-ink">
      <div className="max-w-[1440px] mx-auto px-10 h-full flex items-center justify-between gap-8">
        <a
          href="#top"
          onClick={(e) => handleNav(e, '#top')}
          className="flex items-baseline gap-2.5 font-mono text-[15px] tracking-[-0.02em] cursor-pointer group"
        >
          <span className="font-bold text-ink">VELOCE</span>
          <span className="font-normal text-grey-400">STUDIO</span>
        </a>

        <nav className="flex items-center gap-6 sm:gap-7 font-mono text-[11.5px] tracking-[0.06em] uppercase">
          <a
            href="#day"
            onClick={(e) => handleNav(e, '#day')}
            className="text-ink hover:text-accent transition-colors cursor-pointer hidden sm:inline-block"
          >
            The day
          </a>
          <a
            href="#index"
            onClick={(e) => handleNav(e, '#index')}
            className="text-ink hover:text-accent transition-colors cursor-pointer"
          >
            Systems
          </a>
          <a
            href="#method"
            onClick={(e) => handleNav(e, '#method')}
            className="text-ink hover:text-accent transition-colors cursor-pointer hidden md:inline-block"
          >
            Method
          </a>
          <button
            onClick={() => {
              if (onOpenConsult) {
                onOpenConsult();
              } else {
                onGoHome('#contact');
              }
            }}
            className="bg-ink text-paper px-4 py-[9px] pb-2 font-mono text-[11.5px] tracking-[0.06em] uppercase hover:bg-accent transition-colors cursor-pointer"
          >
            Book an audit →
          </button>
        </nav>
      </div>
    </header>
  );
};
