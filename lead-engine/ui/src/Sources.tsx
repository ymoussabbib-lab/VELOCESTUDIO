import { useEffect, useState } from 'react';

interface SourceRow {
  id: string;
  label: string;
  role: 'citable' | 'signal';
  terms: string;
  enabled: boolean;
  roleEditable: boolean;
  sightingCount?: number;
  lastIngestAt?: string | null;
}

interface TuningConfig {
  sources: Record<string, { enabled: boolean }>;
}

export function Sources() {
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    Promise.all([
      fetch('/api/sources').then((response) => response.json()),
      fetch('/api/config').then((response) => response.json()),
    ])
      .then(([sourceRows]) => setSources(sourceRows))
      .catch((err: Error) => setError(err.message));
  }

  useEffect(load, []);

  async function updateEnabled(source: SourceRow, enabled: boolean) {
    setSaving(source.id);
    setError(null);
    try {
      const config = await fetch('/api/config').then((response) => response.json()) as TuningConfig;
      const next = {
        ...config,
        sources: {
          ...config.sources,
          [source.id]: { enabled },
        },
      };
      const response = await fetch('/api/config/promote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ config: next }),
      });
      if (!response.ok) throw new Error((await response.json()).error ?? 'Unable to save source setting');
      setSources((current) => current.map((row) => (row.id === source.id ? { ...row, enabled } : row)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Sources</h2>
        <p>Roles are fixed in code. Enabled is the only source setting.</p>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <div className="source-table">
        {sources.map((source) => (
          <article className="source-row" key={source.id}>
            <div>
              <div className="row-title">
                <h3>{source.label}</h3>
                <span className={`badge ${source.role}`}>{source.role}</span>
              </div>
              <p>{source.terms}</p>
              <small>
                {source.sightingCount ?? 0} sightings
                {source.lastIngestAt ? ` · last ingest ${new Date(source.lastIngestAt).toLocaleString()}` : ''}
              </small>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={source.enabled}
                disabled={saving === source.id}
                onChange={(event) => updateEnabled(source, event.target.checked)}
              />
              <span>{source.enabled ? 'Enabled' : 'Disabled'}</span>
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}
