const pains = [
  ['The spreadsheet only one person understands', 'When that person is absent, the process stops.'],
  ['Information gets typed twice', 'One person writes it. Another re-enters it. Nobody trusts the final number.'],
  ['Customers wait for answers', 'Bookings, orders and confirmations should not depend on somebody noticing a WhatsApp message.'],
  ['Renewals are forgotten', 'A system should know when a membership or contract is about to expire.'],
];

export function ProblemSection() {
  return (
    <section className="px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">The work behind the work</p>
        <h2 className="mt-4 max-w-5xl text-4xl font-black uppercase leading-none md:text-6xl">Your team shouldn&apos;t have to remember the business. The system should.</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Workflow title="Before" items={['WhatsApp', 'Notebook', 'Excel', 'Forgotten follow-up', 'Missed revenue']} muted />
          <Workflow title="After" items={['System', 'Automatic workflow', 'Notification', 'Action', 'Traceable result']} />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {pains.map(([title, body]) => (
            <article key={title} className="border border-line bg-paper-alt p-5">
              <h3 className="text-lg font-bold uppercase leading-tight">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow({ title, items, muted = false }: { title: string; items: string[]; muted?: boolean }) {
  return (
    <div className={`border ${muted ? 'border-line bg-paper-alt' : 'border-ink bg-ink text-paper'} p-5`}>
      <p className="font-mono text-xs uppercase tracking-[0.18em]">{title}</p>
      <ol className="mt-5 grid gap-2">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-current">{index + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
