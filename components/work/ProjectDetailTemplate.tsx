import Image from 'next/image';
import type { Project } from '@/data/projects';
import { ProjectGallery } from './ProjectGallery';
import { ProjectCTA } from './ProjectCTA';
import { WorkflowTimeline } from './WorkflowTimeline';

export function ProjectDetailTemplate({ project }: { project: Project }) {
  const hero = project.managerAssets[0];

  return (
    <main className="bg-paper pb-24 text-ink">
      <section className="px-4 pb-12 pt-28 md:px-8 lg:px-12" aria-labelledby="project-title">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">Demo system / {project.category}</p>
            <h1 id="project-title" className="mt-4 text-5xl font-black uppercase leading-[0.9] md:text-7xl">
              {project.name}
            </h1>
            <p className="mt-5 max-w-xl text-xl leading-snug text-ink-muted">{project.shortPromise}</p>
            <div className="mt-7">
              <ProjectCTA href={project.demoUrl} label="Explore demo" whatsappMessage={project.whatsappMessage} />
            </div>
          </div>
          <div className="overflow-hidden border border-ink bg-white">
            <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority sizes="(min-width: 1024px) 54vw, 100vw" className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className="border-t border-line px-4 py-14 md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">The Problem</p>
          <div>
            <h2 className="text-3xl font-black uppercase leading-none md:text-5xl">What the business is buying.</h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-muted">{project.problem}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-4 py-14 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">System Architecture</p>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {['Owner / manager', 'Admin dashboard', 'Operations data', 'Automation', 'Customer experience'].map((item) => (
              <div key={item} className="border border-ink bg-paper-alt p-5 text-center font-mono text-xs uppercase tracking-[0.12em]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectGallery project={project} />

      <section className="border-t border-line px-4 py-16 md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">Example daily workflow</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none">From action to traceable result.</h2>
          </div>
          <WorkflowTimeline items={project.workflows} />
        </div>
      </section>

      <section className="border-t border-line px-4 py-16 md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            ['Automations', project.automations],
            ['Customization', project.customization],
            ['Implementation includes', project.implementation],
          ].map(([title, items]) => (
            <div key={title as string} className="border border-line bg-paper-alt p-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em]">{title as string}</h2>
              <ul className="mt-5 space-y-3 text-sm text-ink-muted">
                {(items as string[]).map((item) => (
                  <li key={item} className="border-t border-line pt-3">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-ink bg-ink px-4 py-16 text-paper md:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-on-dark-muted">Your business could run like this.</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-none md:text-6xl">Build your version around your workflow.</h2>
          </div>
          <ProjectCTA href={project.demoUrl} label="Explore demo" whatsappMessage={project.whatsappMessage} />
        </div>
      </section>
    </main>
  );
}
