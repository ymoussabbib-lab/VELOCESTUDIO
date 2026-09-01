const steps = [
  ['01', 'Workflow audit', 'We map what happens today, where information gets lost and what should be automated.'],
  ['02', 'Interface blueprint', 'We design the screens and flows before building the system.'],
  ['03', 'Full-stack build', 'We build the product, connect the data and implement the business rules.'],
  ['04', 'Launch & run', 'We deploy it, train the team and stay available for support and iteration.'],
];

export function ProcessSection() {
  return (
    <section id="process" className="border-t border-ink px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">How we build</p>
        <h2 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-none md:text-6xl">We don&apos;t start with code. We start with the workflow.</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-4">
          {steps.map(([no, title, body]) => (
            <article key={no} className="border border-line bg-paper-alt p-5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{no}</p>
              <h3 className="mt-8 text-2xl font-black uppercase leading-none">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
