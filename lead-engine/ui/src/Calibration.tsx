import { useEffect, useMemo, useState } from 'react';

interface ResolutionConfig {
  mergeThreshold: number;
  ambiguityFloor: number;
  proximityMetres: number;
  sharedContactThreshold: number;
  minDistinctiveTokens: number;
}

interface TuningConfig {
  schemaVersion: 1;
  resolution: ResolutionConfig;
  sources: Record<string, { enabled: boolean }>;
}

interface Pair {
  aSightingId: string;
  bSightingId: string;
}

interface CalibrationResult {
  metrics: {
    falseMerges: Pair[];
    missedMerges: Pair[];
    stillAmbiguous: Pair[];
    clusterCount: number;
    largestCluster: number;
    labelledPairs: number;
  };
  diff: {
    merged: { sightingIds: string[] }[];
    split: { sightingIds: string[] }[];
    unchanged: number;
  };
}

const controls: {
  key: keyof ResolutionConfig;
  label: string;
  min: number;
  max: number;
  step: number;
}[] = [
  { key: 'mergeThreshold', label: 'Merge threshold', min: 0, max: 1, step: 0.01 },
  { key: 'ambiguityFloor', label: 'Ambiguity floor', min: 0, max: 1, step: 0.01 },
  { key: 'proximityMetres', label: 'Proximity metres', min: 1, max: 2000, step: 1 },
  { key: 'sharedContactThreshold', label: 'Shared contact threshold', min: 1, max: 10, step: 1 },
  { key: 'minDistinctiveTokens', label: 'Minimum distinctive tokens', min: 1, max: 8, step: 1 },
];

export function Calibration() {
  const [liveConfig, setLiveConfig] = useState<TuningConfig | null>(null);
  const [candidate, setCandidate] = useState<TuningConfig | null>(null);
  const [result, setResult] = useState<CalibrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then((response) => response.json())
      .then((config: TuningConfig) => {
        setLiveConfig(config);
        setCandidate(config);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!candidate) return;
    const timer = window.setTimeout(() => {
      setBusy(true);
      setError(null);
      fetch('/api/calibrate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ config: candidate }),
      })
        .then(async (response) => {
          const body = await response.json();
          if (!response.ok) throw new Error(body.error ?? 'Calibration failed');
          setResult(body);
        })
        .catch((err: Error) => {
          setResult(null);
          setError(err.message);
        })
        .finally(() => setBusy(false));
    }, 180);
    return () => window.clearTimeout(timer);
  }, [candidate]);

  const promoteDisabledReason = useMemo(() => {
    if (!candidate || !result) return 'Run calibration before promotion.';
    if (result.metrics.falseMerges.length > 0) return 'Promotion disabled while false merges are listed.';
    return null;
  }, [candidate, result]);

  function updateResolution(key: keyof ResolutionConfig, value: number) {
    setCandidate((current) => current
      ? { ...current, resolution: { ...current.resolution, [key]: value } }
      : current);
  }

  async function promote() {
    if (!candidate || promoteDisabledReason) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/config/promote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ config: candidate }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? 'Promotion failed');
      setResult(body);
      setLiveConfig(candidate);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!candidate || !liveConfig) {
    return (
      <section className="panel">
        <h2>Calibration</h2>
        <p>Loading configuration...</p>
      </section>
    );
  }

  return (
    <section className="panel calibration">
      <div className="section-heading">
        <h2>Calibration</h2>
        <p>Resolve the local snapshot in memory before promoting a config diff.</p>
      </div>

      <div className="calibration-grid">
        <div className="controls">
          {controls.map((control) => (
            <label className="range-row" key={control.key}>
              <span>{control.label}</span>
              <output>{candidate.resolution[control.key]}</output>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={candidate.resolution[control.key]}
                onChange={(event) => updateResolution(control.key, Number(event.target.value))}
              />
            </label>
          ))}
        </div>

        <div className="metrics">
          {error ? <p className="error">{error}</p> : null}
          <div className="metric-row danger">
            <h3>False merges</h3>
            <strong>{result?.metrics.falseMerges.length ?? 0}</strong>
            <p>Pairs a human marked different.</p>
            <PairList pairs={result?.metrics.falseMerges ?? []} empty="No false merges listed." />
          </div>

          <details className="metric-row" open>
            <summary>
              <span>Missed merges</span>
              <strong>{result?.metrics.missedMerges.length ?? 0}</strong>
            </summary>
            <PairList pairs={result?.metrics.missedMerges ?? []} empty="No missed merges listed." />
          </details>

          <div className="stat-grid">
            <Stat label="Clusters" value={result?.metrics.clusterCount ?? 0} />
            <Stat label="Largest cluster" value={result?.metrics.largestCluster ?? 0} />
            <Stat label="Would merge" value={result?.diff.merged.length ?? 0} />
            <Stat label="Would split" value={result?.diff.split.length ?? 0} />
          </div>

          <div className="promote-row">
            <button type="button" disabled={Boolean(promoteDisabledReason) || busy} onClick={promote}>
              Promote
            </button>
            <span>{promoteDisabledReason ?? (busy ? 'Working...' : 'Ready to promote.')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PairList({ pairs, empty }: { pairs: Pair[]; empty: string }) {
  if (pairs.length === 0) return <p className="muted">{empty}</p>;
  return (
    <ul className="pair-list">
      {pairs.map((pair) => (
        <li key={`${pair.aSightingId}-${pair.bSightingId}`}>
          <code>{pair.aSightingId}</code>
          <span>with</span>
          <code>{pair.bSightingId}</code>
        </li>
      ))}
    </ul>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
