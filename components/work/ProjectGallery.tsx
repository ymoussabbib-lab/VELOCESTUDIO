'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Project, ProjectAudience } from '@/data/projects';
import { ViewToggle } from './ViewToggle';

export function ProjectGallery({ project }: { project: Project }) {
  const [view, setView] = useState<ProjectAudience>('manager');
  const assets = view === 'manager' ? project.managerAssets : project.clientAssets;
  const modules = view === 'manager' ? project.managerModules : project.clientModules;

  return (
    <section className="border-t border-line px-4 py-16 md:px-8 lg:px-12" aria-labelledby="gallery-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">Manager / Client Proof</p>
            <h2 id="gallery-title" className="mt-3 max-w-3xl text-4xl font-black uppercase leading-none md:text-6xl">
              Two sides of the same system.
            </h2>
          </div>
          <ViewToggle value={view} onChange={setView} />
        </div>

        <div className="mb-7 flex flex-wrap gap-2">
          {modules.map((module) => (
            <span key={module} className="border border-line bg-paper-alt px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em]">
              {module}
            </span>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {assets.map((image, index) => (
            <figure key={image.src} className={index === 0 ? 'md:col-span-2' : ''}>
              <div className="overflow-hidden border border-ink bg-white">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes={index === 0 ? '(min-width: 768px) 92vw, 100vw' : '(min-width: 768px) 44vw, 100vw'}
                  className="h-auto w-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
              <figcaption className="border-x border-b border-line bg-paper px-4 py-3 text-sm text-ink-muted">
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
