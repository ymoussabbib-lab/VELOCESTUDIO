import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS } from '@/data/projects';
import { CONTACT_MESSAGES, createWhatsAppHref } from '@/lib/contact';

export function Hero() {
  const [fitpulse, estatepulse, salonflow] = PROJECTS;

  return (
    <section className="px-4 pb-10 pt-24 md:px-8 lg:px-12 lg:pt-16" aria-labelledby="home-title">
      <div className="mx-auto grid max-w-7xl gap-9 lg:min-h-[calc(100vh-64px)] lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">Software systems / Automation / Business operations</p>
          <h1 id="home-title" className="mt-5 text-balance text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase leading-[0.84] tracking-[-0.03em]">
            Your business runs on software.
            <span className="block">We build the parts you&apos;re still running by hand.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted md:text-xl">
            Memberships. Bookings. Orders. Customers. Payments. Operations. We turn repetitive work into software your team can actually use every day.
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-grey-600">Built locally for businesses in Sale, Rabat, Casablanca and beyond.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#systems" className="inline-flex min-h-11 items-center justify-center bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-paper">
              See what we build &rarr;
            </Link>
            <a href={createWhatsAppHref(CONTACT_MESSAGES.general)} className="inline-flex min-h-11 items-center justify-center border border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.14em]">
              Book a workflow audit
            </a>
          </div>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-accent">No generic packages. No bloated systems. Built around your operation.</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden border border-ink bg-white shadow-[10px_10px_0_#17150F]">
            <div className="border-b border-line bg-paper-alt px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em]">FitPulse PRO / manager dashboard</div>
            <Image src={fitpulse.managerAssets[0].src} alt={fitpulse.managerAssets[0].alt} width={fitpulse.managerAssets[0].width} height={fitpulse.managerAssets[0].height} priority sizes="(min-width: 1024px) 52vw, 100vw" className="h-auto w-full" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:absolute lg:-bottom-8 lg:left-8 lg:right-8 lg:mt-0">
            {[salonflow, estatepulse].map((project) => (
              <div key={project.slug} className="border border-line bg-paper p-3 shadow-[5px_5px_0_#D6D1C5]">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-grey-600">{project.name}</p>
                <Image src={project.managerAssets[0].src} alt={project.managerAssets[0].alt} width={project.managerAssets[0].width} height={project.managerAssets[0].height} sizes="(min-width: 1024px) 23vw, 46vw" className="aspect-[16/9] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
