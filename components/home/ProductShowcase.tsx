import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { PROJECTS } from '@/data/projects';
import type { MarketingAsset } from '@/data/assetManifest';

const FRAME_RATIO = 16 / 10;
const MAX_GROWTH = 1.4;
const PREVIEW_SIZES = '(min-width: 1024px) 29vw, (min-width: 640px) 44vw, 100vw';

// Screenshots vary widely: manager shots are landscape (~1920x900) but client
// shots are full-page captures up to 1920x4618. Every preview is cropped into a
// shared 16:10 frame so the two previews match height and the row carries no
// dead space. Hovering lifts the frame and grows it downward over the page
// rather than in flow, so nothing below shifts. Growth is capped at what the
// crop actually hides: a full-page capture has frame-heights left to reveal,
// while a landscape dashboard has none and a taller frame would only zoom into
// an unreadable middle.
function Preview({ asset, href, className = '' }: { asset: MarketingAsset; href: string; className?: string }) {
  const growth = Math.min(MAX_GROWTH, Math.max(1, FRAME_RATIO / (asset.width / asset.height))).toFixed(3);

  return (
    <Link href={href} data-preview className="group/preview relative block aspect-[16/10]">
      <span
        style={{ '--grow': growth } as CSSProperties}
        className={`absolute inset-x-0 top-0 block h-full overflow-hidden border bg-paper transition-[height,box-shadow,border-color] duration-300 ease-out group-hover/preview:z-20 group-hover/preview:h-[calc(100%*var(--grow))] group-hover/preview:shadow-[8px_8px_0_#17150F] group-focus-visible/preview:z-20 group-focus-visible/preview:h-[calc(100%*var(--grow))] group-focus-visible/preview:shadow-[8px_8px_0_#17150F] motion-reduce:transition-none ${className}`}
      >
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={PREVIEW_SIZES}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-300 ease-out group-hover/preview:scale-[1.02] motion-reduce:transition-none"
        />
      </span>
    </Link>
  );
}

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
            <article key={project.slug} className="grid gap-5 border border-ink bg-paper-alt p-4 md:p-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
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
              <div className="grid content-start gap-4 sm:grid-cols-2">
                <Preview asset={project.managerAssets[0]} href={`/work/${project.slug}`} className="border-ink" />
                <Preview asset={project.clientAssets[0]} href={`/work/${project.slug}`} className="border-line group-hover/preview:border-ink" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
