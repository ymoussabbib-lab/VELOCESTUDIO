const deliverables = [
  'Custom interface',
  'Manager/admin dashboard',
  'Client/customer experience',
  'Database',
  'Workflows',
  'Notifications',
  'Authentication and permissions',
  'Deployment',
  'Responsive mobile experience',
  'Training and onboarding',
  'Maintenance and support options',
];

export function Deliverables() {
  return (
    <section className="border-t border-line px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey-600">What are you actually buying?</p>
          <h2 className="mt-4 text-4xl font-black uppercase leading-none md:text-6xl">Not a website. A system your team can use tomorrow.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {deliverables.map((item) => (
            <div key={item} className="min-h-11 border border-line bg-paper-alt px-4 py-3 font-mono text-xs uppercase tracking-[0.12em]">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
