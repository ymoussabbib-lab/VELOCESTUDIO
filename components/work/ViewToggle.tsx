'use client';

import type { ProjectAudience } from '@/data/projects';

interface ViewToggleProps {
  value: ProjectAudience;
  onChange: (value: ProjectAudience) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-grid min-h-11 grid-cols-2 border border-ink bg-paper font-mono text-[11px] uppercase tracking-[0.12em]">
      {(['manager', 'client'] as ProjectAudience[]).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={`min-h-11 px-4 transition-colors ${value === option ? 'bg-ink text-paper' : 'text-ink hover:bg-paper-alt'}`}
        >
          {option === 'manager' ? 'Manager view' : 'Client view'}
        </button>
      ))}
    </div>
  );
}
