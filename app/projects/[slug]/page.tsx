import React from 'react';
import { PROJECTS_DATA } from '@/data/projects';
import { WorkflowStepper } from '@/components/WorkflowStepper';
import { ProjectHeroImage } from '@/components/ProjectHeroImage';
import { ExternalLink, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return PROJECTS_DATA.map((p) => ({
    slug: p.slug,
  }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = PROJECTS_DATA.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-obsidian pb-24">
      <header className="border-b border-surfaceHover bg-surface/40 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link className="inline-flex items-center gap-2 text-xs font-semibold text-accentCyan mb-6 hover:underline" href="/">
            <ArrowLeft className="h-4 w-4"/> Back to Overview
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-accentCyan uppercase tracking-widest">{project.category}</span>
              <h1 className="mt-1 text-4xl font-extrabold text-brightText sm:text-5xl">{project.name}</h1>
              <p className="mt-2 text-lg text-mutedText">{project.tagline}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-accentCyan px-6 py-3 text-xs font-bold text-obsidian shadow-lg shadow-accentCyan/20 hover:opacity-95"
              >
                <span>Launch Live Application</span>
                <ExternalLink className="h-4 w-4"/>
              </a>
              {project.secondLiveUrl && (
                <a
                  href={project.secondLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-accentTeal px-6 py-3 text-xs font-bold text-obsidian shadow-lg shadow-accentTeal/20 hover:opacity-95"
                >
                  <span>Launch Kitchen KDS</span>
                  <ExternalLink className="h-4 w-4"/>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12 space-y-16">
        <div className="rounded-2xl border border-surfaceHover bg-surface overflow-hidden shadow-2xl">
          <ProjectHeroImage src={project.heroImage} alt={project.name} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-surfaceHover bg-surface/30 p-8">
            <h3 className="text-lg font-bold text-brightText mb-3">The Operational Bottleneck</h3>
            <p className="text-sm text-mutedText leading-relaxed">
              Traditional businesses lose efficiency due to disconnected software systems, manual verification tasks, physical paper scheduling, and delayed payment logging.
            </p>
          </div>

          <div className="rounded-2xl border border-accentCyan/30 bg-accentCyan/5 p-8">
            <h3 className="text-lg font-bold text-accentCyan mb-3">The Software Solution</h3>
            <p className="text-sm text-mutedText leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-brightText mb-6">End-to-End System Workflow</h3>
          <WorkflowStepper workflows={project.workflows}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-surfaceHover bg-surface/40 p-8">
            <h3 className="text-xl font-bold text-brightText mb-6">Engineered Features</h3>
            <ul className="space-y-3">
              {project.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-mutedText">
                  <CheckCircle2 className="h-4 w-4 text-statusEmerald"/>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-surfaceHover bg-surface/40 p-8">
            <h3 className="text-xl font-bold text-brightText mb-6">Technologies Implemented</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span key={i} className="rounded-xl border border-surfaceHover bg-obsidian px-4 py-2 text-xs font-semibold text-accentCyan">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
