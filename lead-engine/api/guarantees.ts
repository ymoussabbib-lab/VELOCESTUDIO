export interface Guarantee {
  id: string;
  statement: string;
  enforcedBy: string;
  locked: true;
}

export const GUARANTEES: Guarantee[] = [
  { id: 'no-send', statement: 'No code can send a message to a prospect.',
    enforcedBy: 'lead-engine/src/invariants.test.ts', locked: true },
  { id: 'citable-only', statement: 'A signal-only source can never be cited at first contact.',
    enforcedBy: 'lead-engine/src/sources/registry.test.ts', locked: true },
  { id: 'optout-all-sources', statement: 'An opt-out blocks re-entry from every source.',
    enforcedBy: 'lead-engine/src/optout/optout.test.ts', locked: true },
  { id: 'no-repo-data', statement: 'Prospect data can never be written inside the repository.',
    enforcedBy: 'lead-engine/src/store/paths.test.ts', locked: true },
  { id: 'loopback-only', statement: 'The control API binds 127.0.0.1 and no other interface.',
    enforcedBy: 'lead-engine/api/server.test.ts', locked: true },
];
