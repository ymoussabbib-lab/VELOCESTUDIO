import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS } from '@/data/projects';

export function ProductShowcase() {
  return (
    <section id="work" className="border-t border-ink px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">Product / system showcase</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-none md:text-6xl">Complete demo systems, not loose mockups.</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-muted">Each preview shows the manager side and the customer side so a business owner can understand the full operating surface.</p>
        </div>

        <div className="mt-10 grid gap-8">
          {PROJECTS.map((project) => (
            <article key={project.slug} className="grid gap-5 border border-ink bg-paper-alt p-4 md:p-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">{project.label}</p>
                <h3 className="mt-3 text-4xl font-black uppercase leading-none md:text-6xl">{project.name}</h3>
                <p className="mt-4 text-lg leading-relaxed text-ink-muted">{project.shortPromise}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.managerModules.slice(0, 6).map((module) => (
                    <span key={module} className="border border-line bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em]">{module}</span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-ink-muted">{project.outcomes[0]}</p>
                <Link href={`/work/${project.slug}`} className="mt-6 inline-flex min-h-11 items-center justify-center bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-paper">
                  See how it works &rarr;
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="overflow-hidden border border-ink bg-white">
                  <Image src={project.managerAssets[0].src} alt={project.managerAssets[0].alt} width={project.managerAssets[0].width} height={project.managerAssets[0].height} sizes="(min-width: 1024px) 42vw, 100vw" className="aspect-[16/10] w-full object-cover" loading="lazy" />
                </div>
                <div className="overflow-hidden border border-line bg-white">
                  <Image src={project.clientAssets[0].src} alt={project.clientAssets[0].alt} width={project.clientAssets[0].width} height={project.clientAssets[0].height} sizes="(min-width: 1024px) 25vw, 100vw" className="aspect-[9/12] w-full object-cover object-top" loading="lazy" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
