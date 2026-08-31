"use client";

import React, { useEffect, useState } from 'react';
import { PROJECTS, LOAD_PROFILES, ProjectData } from '@/data/portfolioData';

interface CaseStudyViewProps {
  slug: string;
  onGoHome: (hash?: string) => void;
  onSelectProject: (slug: string) => void;
}

export const CaseStudyView: React.FC<CaseStudyViewProps> = ({
  slug,
  onGoHome,
  onSelectProject
}) => {
  const [chartOn, setChartOn] = useState(false);

  const curIdx = PROJECTS.findIndex((p) => p.slug === slug);
  const project: ProjectData = PROJECTS[curIdx < 0 ? 0 : curIdx];
  const nextProject: ProjectData = PROJECTS[(curIdx + 1) % PROJECTS.length];
  const loadProfile = LOAD_PROFILES[project.slug] || [];

  useEffect(() => {
    setChartOn(false);
    const timer = setTimeout(() => {
      setChartOn(true);
    }, 140);
    return () => clearTimeout(timer);
  }, [slug]);

  return (
    <article className="animate-vs-rise-case">
      {/* 1. Back link and Title Block */}
      <section className="max-w-[1440px] mx-auto px-10 pt-16">
        <button
          onClick={() => onGoHome('#index')}
          className="font-mono text-[11.5px] tracking-[0.08em] uppercase text-grey-400 hover:text-accent transition-colors cursor-pointer bg-transparent border-0 p-0"
        >
          ← Production index
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16 items-end mt-11 border-b border-ink pb-10">
          <div>
            <div className="font-mono text-[12px] tracking-[0.1em] uppercase text-accent">
              {project.no} — {project.sector}
            </div>
            <h1 className="mt-[22px] mb-0 text-[clamp(44px,5.6vw,88px)] leading-[0.93] tracking-[-0.04em] font-black text-ink">
              {project.name}
            </h1>
            <p className="mt-6 mb-0 text-[21px] leading-[1.42] text-ink-muted max-w-[44ch] [text-wrap:pretty]">
              {project.oneLine}
            </p>
          </div>

          {/* Right Spec Sheet */}
          <div className="flex flex-col gap-[9px] font-mono text-[11.5px] tracking-[0.04em]">
            {project.spec.map((s, sIdx) => (
              <div
                key={sIdx}
                className="flex justify-between gap-4 border-t border-line pt-[9px]"
              >
                <span className="text-grey-400 uppercase">{s.k}</span>
                <span className="text-ink text-right">{s.v}</span>
              </div>
            ))}
            {project.liveUrl && (
              <div className="flex justify-between gap-4 border-t border-line pt-[9px]">
                <span className="text-grey-400 uppercase">Live Deployment</span>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-bold text-right inline-flex items-center gap-1"
                >
                  <span>Launch App</span>
                  <span>↗</span>
                </a>
              </div>
            )}
            {project.secondLiveUrl && (
              <div className="flex justify-between gap-4 border-t border-line pt-[9px]">
                <span className="text-grey-400 uppercase">Kitchen KDS</span>
                <a
                  href={project.secondLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-bold text-right inline-flex items-center gap-1"
                >
                  <span>Launch KDS</span>
                  <span>↗</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Hero Screenshot */}
      <section className="max-w-[1440px] mx-auto px-10 mt-10">
        <div
          role="img"
          aria-label={project.name}
          style={{
            backgroundImage: `url("${project.shot}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            aspectRatio: '552 / 280'
          }}
          className="w-full border border-ink bg-ink"
        />
        <div className="flex justify-between mt-3 font-mono text-[11px] tracking-[0.05em] uppercase text-grey-400">
          <span>{project.shotCaption}</span>
          <span>Live production environment</span>
        </div>
      </section>

      {/* 3. Where the load falls */}
      <section className="max-w-[1440px] mx-auto px-10 mt-[84px]">
        <div className="border-t border-ink pt-3.5 flex items-baseline justify-between">
          <h2 className="m-0 font-mono text-[12px] tracking-[0.12em] uppercase font-medium text-ink">
            Where the load falls
          </h2>
          <span className="font-mono text-[12px] text-grey-400">
            Operating window {project.windowLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-14 mt-[34px] items-end">
          <div>
            <div className="flex items-end gap-[5px] h-[190px] border-b border-ink">
              {loadProfile.map((val, bIdx) => (
                <span
                  key={bIdx}
                  style={{
                    flex: '1 1 0',
                    display: 'block',
                    backgroundColor: project.accent,
                    height: chartOn ? `${Math.max(2, val * 100)}%` : '2%',
                    opacity: val === 0 ? 0.18 : 0.85,
                    transition: `height 780ms cubic-bezier(0.22, 0.61, 0.36, 1) ${bIdx * 22}ms`
                  }}
                />
              ))}
            </div>

            <div className="flex justify-between mt-2.5 font-mono text-[10.5px] text-grey-400">
              <span>00</span>
              <span>06</span>
              <span>12</span>
              <span>18</span>
              <span>24</span>
            </div>
          </div>

          <p className="m-0 text-[15.5px] leading-[1.55] text-ink-muted">
            {project.loadNote}
          </p>
        </div>
      </section>

      {/* 4. Chapters */}
      <section className="max-w-[1440px] mx-auto px-10 mt-[84px]">
        {project.chapters.map((c, cIdx) => (
          <div
            key={cIdx}
            className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16 border-t border-ink pt-[34px] pb-[56px] items-start"
          >
            <div>
              <div className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-grey-400">
                {c.label}
              </div>
              <h2 className="mt-4 text-[29px] font-extrabold tracking-[-0.025em] leading-[1.12] text-ink [text-wrap:balance]">
                {c.title}
              </h2>
            </div>

            <div>
              {c.paras.map((pText, pIdx) => (
                <p
                  key={pIdx}
                  className="m-0 mb-[18px] text-[18px] leading-[1.58] text-ink-soft max-w-[68ch] [text-wrap:pretty]"
                >
                  {pText}
                </p>
              ))}

              {c.hasList && c.list && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-line border border-line mt-[26px]">
                  {c.list.map((li, liIdx) => (
                    <div key={liIdx} className="bg-paper p-5">
                      <div className="font-mono text-[10.5px] tracking-[0.06em] uppercase text-accent">
                        {li.k}
                      </div>
                      <div className="mt-2 text-[15.5px] leading-[1.45] text-ink-soft">
                        {li.v}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* 5. Workflow it owns */}
      <section className="max-w-[1440px] mx-auto px-10 pb-2">
        <div className="border-t border-ink pt-[34px]">
          <div className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-grey-400">
            Workflow it owns
          </div>

          <div className="flex flex-wrap mt-[26px] border border-ink">
            {project.flow.map((f) => (
              <div
                key={f.no}
                className="flex-[1_1_180px] p-[24px_22px_26px] border-r border-line last:border-r-0 hover:bg-paper-alt transition-colors"
              >
                <div className="font-mono text-[10.5px] text-grey-400">{f.no}</div>
                <div className="mt-3 text-[17px] font-extrabold tracking-[-0.015em] leading-[1.2] text-ink">
                  {f.step}
                </div>
                <div className="mt-2 text-[14px] leading-[1.45] text-grey-600">
                  {f.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Next build */}
      <section className="mt-24 bg-ink text-on-dark">
        <div className="max-w-[1440px] mx-auto p-[72px_40px]">
          <div className="font-mono text-[11.5px] tracking-[0.1em] uppercase text-grey-400">
            Next build
          </div>

          <button
            onClick={() => onSelectProject(nextProject.slug)}
            className="w-full flex items-baseline justify-between gap-10 mt-5 cursor-pointer text-on-dark hover:text-accent transition-colors text-left bg-transparent border-0 p-0"
          >
            <span className="text-[clamp(36px,5vw,76px)] font-black tracking-[-0.04em] leading-none">
              {nextProject.name}
            </span>
            <span className="text-[40px] leading-none">→</span>
          </button>

          <p className="mt-[22px] mb-0 text-[17px] text-on-dark-muted max-w-[58ch] leading-[1.5]">
            {nextProject.oneLine}
          </p>
        </div>
      </section>
    </article>
  );
};
