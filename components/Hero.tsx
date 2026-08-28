"use client";

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenConsult: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsult }) => {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accentCyan/30 bg-accentCyan/10 px-4 py-1.5 text-xs font-semibold text-accentCyan mb-8">
            <Sparkles className="h-3.5 w-3.5"/>
            <span>5 Live Deployed B2B Systems</span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-brightText sm:text-6xl leading-[1.15]">
            Custom software built around how your business <span className="bg-gradient-to-r from-accentCyan to-accentTeal bg-clip-text text-transparent">actually works</span>.
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-mutedText">
            We engineer bespoke web applications, customer portals, QR ordering systems, and operational management platforms designed to eliminate manual bottlenecks.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#showcase"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-surface hover:bg-surfaceHover border border-surfaceHover px-7 py-3.5 text-sm font-semibold text-brightText transition-all"
            >
              <span>Explore Deployed Apps</span>
              <ArrowRight className="h-4 w-4 text-accentCyan"/>
            </a>
            <button
              onClick={onOpenConsult}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accentCyan to-accentTeal px-7 py-3.5 text-sm font-semibold text-obsidian shadow-lg shadow-accentCyan/20 hover:opacity-95 transition-all"
            >
              <span>Schedule Architecture Audit</span>
            </button>
          </div>
        </div>

        <div className="mt-16 relative rounded-2xl border border-surfaceHover bg-surface/50 p-3 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-surfaceHover/50 mb-3">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
            <div className="ml-4 rounded-md bg-obsidian px-4 py-1 text-xs text-mutedText font-mono">https://veloce.studio/live-ecosystem</div>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-obsidian border border-surfaceHover">
            <img 
              src="/screenshots/fitpulse-desktop.png" 
              alt="Live Production Ecosystem Preview"
              className="object-cover w-full h-full opacity-90"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-mutedText border-t border-surfaceHover/60 pt-4">
              <span className="flex items-center gap-2 text-statusEmerald font-medium"><span className="h-2 w-2 rounded-full bg-statusEmerald animate-pulse" /> Live Production Environments</span>
              <span>Next.js 14 • TypeScript • Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
