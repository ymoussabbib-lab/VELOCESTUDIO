import { useState } from 'react';
import { Calibration } from './Calibration';
import { Guarantees } from './Guarantees';
import { Sources } from './Sources';

type View = 'guarantees' | 'sources' | 'calibration';

const views: { id: View; label: string }[] = [
  { id: 'guarantees', label: 'Guarantees' },
  { id: 'sources', label: 'Sources' },
  { id: 'calibration', label: 'Calibration' },
];

export function App() {
  const [view, setView] = useState<View>('guarantees');

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>Lead Engine Control</h1>
          <p>Local resolver tuning against the encrypted snapshot.</p>
        </div>
        <nav className="tabs" aria-label="Control screens">
          {views.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? 'active' : ''}
              type="button"
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {view === 'guarantees' ? <Guarantees /> : null}
      {view === 'sources' ? <Sources /> : null}
      {view === 'calibration' ? <Calibration /> : null}
    </main>
  );
}
