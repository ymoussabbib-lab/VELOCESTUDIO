import type { SourceEntry, SourceId } from './types';

export const SOURCE_REGISTRY: Record<SourceId, SourceEntry> = {
  openstreetmap: { id: 'openstreetmap', label: 'OpenStreetMap', role: 'citable',
    terms: 'ODbL. Commercial use permitted with attribution; bulk extracts published for reuse.' },
  telecontact: { id: 'telecontact', label: 'Telecontact', role: 'citable',
    terms: 'Business directory. Bulk extraction is against site terms — pending commercial risk review.' },
  pj: { id: 'pj', label: 'Pages Jaunes Maroc', role: 'citable',
    terms: 'Business directory. Bulk extraction is against site terms — pending commercial risk review.' },
  glovo: { id: 'glovo', label: 'Glovo', role: 'signal',
    terms: 'Platform listings. Liveness evidence only; never cited as the origin of contact details.' },
  kaalix: { id: 'kaalix', label: 'Kaalix', role: 'signal',
    terms: 'Platform listings. Liveness evidence only; never cited as the origin of contact details.' },
  instagram: { id: 'instagram', label: 'Instagram', role: 'signal',
    terms: 'Automated collection is against platform terms. Signal only; never cited.' },
  facebook: { id: 'facebook', label: 'Facebook', role: 'signal',
    terms: 'Automated collection is against platform terms. Signal only; never cited.' },
};

export function isCitable(id: SourceId): boolean {
  return SOURCE_REGISTRY[id]?.role === 'citable';
}

export function assertCitable(id: SourceId): void {
  if (!isCitable(id)) {
    throw new Error(`${id} is signal-only and may not be cited at first contact.`);
  }
}
