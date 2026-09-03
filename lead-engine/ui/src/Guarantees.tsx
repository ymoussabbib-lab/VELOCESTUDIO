import { useEffect, useState } from 'react';

interface Guarantee {
  id: string;
  statement: string;
  enforcedBy: string;
  locked: boolean;
}

export function Guarantees() {
  const [items, setItems] = useState<Guarantee[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/guarantees')
      .then((response) => response.json())
      .then(setItems)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Guarantees</h2>
        <p>These are not settings. Each is enforced by a test that fails the build.</p>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <ul className="guarantee-list">
        {items.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.statement}</strong>
              <code>{item.enforcedBy}</code>
            </div>
            <span className="badge locked">{item.locked ? 'Locked' : 'Open'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
