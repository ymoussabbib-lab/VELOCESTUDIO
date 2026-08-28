"use client";

import React from 'react';
import Link from 'next/link';
import { Terminal, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenConsult: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConsult }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-surfaceHover bg-obsidian/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link className="flex items-center gap-3 group" href="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accentCyan to-accentTeal text-obsidian shadow-lg shadow-accentCyan/20 group-hover:scale-105 transition-transform">
            <Terminal className="h-5 w-5 stroke-[2.5]"/>
          </div>
          <span className="text-xl font-bold tracking-tight text-brightText">VELOCE<span className="text-accentCyan">STUDIO</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-mutedText">
          <a href="#capabilities" className="hover:text-accentCyan transition-colors">Capabilities</a>
          <a href="#showcase" className="hover:text-accentCyan transition-colors">Work Portfolio</a>
          <a href="#process" className="hover:text-accentCyan transition-colors">How We Build</a>
        </nav>

        <button
          onClick={onOpenConsult}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accentCyan to-accentTeal px-5 py-2.5 text-sm font-semibold text-obsidian shadow-md shadow-accentCyan/20 hover:opacity-95 transition-opacity"
        >
          <span>Book Consult</span>
          <ArrowUpRight className="h-4 w-4"/>
        </button>
      </div>
    </header>
  );
};
