"use client";

import React from 'react';
import Link from 'next/link';
import { PROJECTS, LOAD_PROFILES, ProjectData } from '@/data/portfolioData';

interface ProductionIndexProps {
  activeIdx: number;
  onHoverProject: (index: number) => void;
}

export const ProductionIndex: React.FC<ProductionIndexProps> = ({
  activeIdx,
  onHoverProject
}) => {
  const activeProject: ProjectData = PROJECTS[activeIdx] || PROJECTS[0];
  const activeLoad = LOAD_PROFILES[activeProject.slug] || [];

  return (
    <section id="index" className="max-w-[1440px] mx-auto mt-[116px] px-10">
      <div
        data-reveal="1"
        className="flex items-baseline justify-between border-b border-ink pb-3.5"
      >
        <h2 className="m-0 font-mono text-[12px] tracking-[0.12em] uppercase font-medium text-ink">
          Production index
        </h2>
        <span className="font-mono text-[12px] text-grey-400">
          Hover to preview · click to read the build
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-start">
        {/* Left Column: Project Rows */}
        <div>
          {PROJECTS.map((p, idx) => {
            const isActive = idx === activeIdx;
            return (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                data-reveal="1"
                onMouseEnter={() => onHoverProject(idx)}
                className="relative block py-[26px] px-1 border-b border-line cursor-pointer group select-none transition-colors"
              >
                {/* Accent Wipe */}
                <span
                  style={{
                    backgroundColor: p.accent,
                    width: isActive ? '100%' : '0%',
                    transition: 'width 620ms cubic-bezier(0.22, 0.61, 0.36, 1)'
                  }}
                  className="absolute left-0 -bottom-[1px] h-[2px] pointer-events-none"
                />

                <div className="grid grid-cols-[46px_1fr_auto] gap-5 items-start">
                  {/* Number */}
                  <span className="font-mono text-[12px] text-grey-400 pt-[7px]">
                    {p.no}
                  </span>

                  {/* Main info */}
                  <div>
                    <span className="block text-[30px] font-extrabold tracking-[-0.025em] leading-[1.1] text-ink group-hover:text-accent transition-colors">
                      {p.name}
                    </span>
                    <span className="block mt-[7px] text-[15px] text-ink-muted max-w-[46ch] leading-[1.45]">
                      {p.oneLine}
                    </span>

                    {/* Tag Chips */}
                    <div className="flex flex-wrap gap-2 mt-3.5">
                      {p.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="font-mono text-[10.5px] tracking-[0.05em] uppercase border border-line-alt px-2 py-[3px] text-grey-600 bg-paper"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Meta */}
                  <div className="font-mono text-[11px] tracking-[0.06em] uppercase text-grey-400 pt-[9px] text-right">
                    <span className="block text-ink">{p.sector}</span>
                    <span className="block mt-[5px] text-grey-400">{p.status}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Column: Sticky Mockup Preview */}
        <div className="lg:sticky lg:top-[108px] pt-6">
          <div className="border border-ink bg-paper shadow-none">
            {/* Browser Top Bar */}
            <div className="flex items-center gap-2.5 px-3 py-[9px] border-b border-ink">
              <div className="flex gap-1.25">
                <span className="w-2 h-2 border border-ink rounded-full" />
                <span className="w-2 h-2 border border-ink rounded-full" />
                <span className="w-2 h-2 border border-ink rounded-full" />
              </div>
              <div className="flex-1 font-mono text-[10.5px] text-grey-600 bg-paper-alt px-2 py-1 border border-line select-all">
                {activeProject.url}
              </div>
            </div>

            {/* Viewport with Stacked Crossfade Layers */}
            <div className="relative aspect-[552/280] overflow-hidden bg-ink">
              {PROJECTS.map((p, idx) => {
                const isCur = idx === activeIdx;
                return (
                  <div
                    key={p.slug}
                    role="img"
                    aria-label={p.name}
                    style={{
                      backgroundImage: `url("${p.shot}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'top center',
                      backgroundRepeat: 'no-repeat',
                      opacity: isCur ? 1 : 0,
                      transform: isCur ? 'scale(1)' : 'scale(1.05)',
                      transition: 'opacity 460ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1)'
                    }}
                    className="absolute inset-0 w-full h-full"
                  />
                );
              })}
            </div>
          </div>

          {/* Activity Strip below preview */}
          <div className="mt-3.5">
            <div className="flex justify-between font-mono text-[11px] tracking-[0.08em] uppercase text-grey-400">
              <span>Activity profile — {activeProject.name}</span>
              <span>00 → 24h</span>
            </div>

            <div className="flex items-end gap-[3px] h-[62px] mt-2.5 border-b border-ink">
              {activeLoad.map((val, bIdx) => (
                <span
                  key={bIdx}
                  style={{
                    flex: '1 1 0',
                    display: 'block',
                    backgroundColor: activeProject.accent,
                    height: `${Math.max(2, val * 100)}%`,
                    opacity: val === 0 ? 0.18 : 0.85,
                    transition: `height 780ms cubic-bezier(0.22, 0.61, 0.36, 1) ${bIdx * 22}ms`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
