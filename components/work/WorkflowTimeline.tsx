export function WorkflowTimeline({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-5">
      {items.map((item, index) => (
        <li key={item} className="border border-line bg-paper-alt p-4">
          <p className="font-mono text-xs text-accent">{String(index + 1).padStart(2, '0')}</p>
          <p className="mt-4 text-lg font-bold uppercase leading-tight">{item}</p>
        </li>
      ))}
    </ol>
  );
}
