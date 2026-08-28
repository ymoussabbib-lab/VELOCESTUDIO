"use client";

import React from 'react';
import Link from 'next/link';
import { Project } from '@/data/projects';
import { ExternalLink, ArrowRight, Layers } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="flex flex-col rounded-2xl border border-surfaceHover bg-surface/50 overflow-hidden hover:border-accentCyan/40 transition-all">
      <div className="relative aspect-[16/10] bg-obsidian border-b border-surfaceHover overflow-hidden">
        <img 
          src={project.heroImage} 
          alt={project.name}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x500/161E2E/F8FAFC?text=' + encodeURIComponent(project.name); }}
        />
        <div className="absolute top-4 left-4 rounded-full bg-obsidian/80 backdrop-blur-md px-3 py-1 text-xs font-medium text-accentCyan border border-accentCyan/20">
          {project.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 lg:p-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-brightText">{project.name}</h3>
          {project.isEcosystem && (
            <span className="flex items-center gap-1 rounded-md bg-accentTeal/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accentTeal border border-accentTeal/30">
              <Layers className="h-3 w-3"/> Dual Ecosystem
            </span>
          )}
        </div>
        
        <p className="text-xs font-semibold text-accentCyan mb-4">{project.tagline}</p>
        <p className="text-sm text-mutedText leading-relaxed mb-6 flex-1">{project.description}</p>

        <div className="mb-6 rounded-xl bg-obsidian/60 p-3 border border-surfaceHover">
          <span className="text-[10px] font-bold uppercase tracking-widest text-mutedText block mb-2">Workflow Progression</span>
          <div className="flex items-center gap-1.5 text-xs text-brightText overflow-x-auto pb-1">
            {project.workflows.map((w, i) => (
              <React.Fragment key={i}>
                <span className="whitespace-nowrap rounded bg-surface px-2 py-0.5">{w.title}</span>
                {i < project.workflows.length - 1 && <span className="text-accentCyan">➔</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-surfaceHover">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-accentCyan/10 border border-accentCyan/30 px-4 py-2 text-xs font-semibold text-accentCyan hover:bg-accentCyan hover:text-obsidian transition-colors"
          >
            <span>Live App</span>
            <ExternalLink className="h-3.5 w-3.5"/>
          </a>

          {project.secondLiveUrl && (
            <a
              href={project.secondLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-accentTeal/10 border border-accentTeal/30 px-4 py-2 text-xs font-semibold text-accentTeal hover:bg-accentTeal hover:text-obsidian transition-colors"
            >
              <span>Kitchen KDS</span>
              <ExternalLink className="h-3.5 w-3.5"/>
            </a>
          )}

          <Link className="ml-auto flex items-center gap-1 text-xs font-semibold text-brightText hover:text-accentCyan transition-colors" href={`/projects/${project.slug}`}>
            <span>Case Study</span>
            <ArrowRight className="h-3.5 w-3.5"/>
          </Link>
        </div>
      </div>
    </div>
  );
};
