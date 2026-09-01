const rows = [
  ['Gym', 'Notebook attendance, WhatsApp renewals, manual payment tracking.', 'QR check-in, expiry reminders, payment history, live dashboard.'],
  ['Salon', 'Bookings in WhatsApp, double booking risk, no customer history.', 'Online booking, calendar, client profile, reminders.'],
  ['Restaurant', 'Printed menu, repeated orders, disconnected kitchen.', 'QR menu, digital order, kitchen queue, order status.'],
  ['Real estate', 'Properties in folders, leads in personal phones, forgotten follow-ups.', 'Property database, lead pipeline, scheduled visits, reminders.'],
];

export function BeforeAfter() {
  return (
    <section className="border-t border-line px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-5xl text-4xl font-black uppercase leading-none md:text-6xl">From a business that depends on people to a business that has a system.</h2>
        <div className="mt-9 grid gap-3">
          {rows.map(([business, before, after]) => (
            <div key={business} className="grid gap-3 border border-line bg-paper-alt p-4 md:grid-cols-[0.35fr_1fr_1fr]">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em]">{business}</h3>
              <p className="text-sm leading-relaxed text-grey-600"><span className="font-bold text-ink">Before: </span>{before}</p>
              <p className="text-sm leading-relaxed text-ink-muted"><span className="font-bold text-ink">After: </span>{after}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
