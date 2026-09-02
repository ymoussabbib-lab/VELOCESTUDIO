export type SourceId =
  | 'openstreetmap' | 'telecontact' | 'pj'
  | 'glovo' | 'kaalix' | 'instagram' | 'facebook';

export type SourceRole = 'citable' | 'signal';

export interface SourceEntry {
  id: SourceId;
  label: string;
  role: SourceRole;
  terms: string;
}

export interface ExtractedFields {
  name: string;
  phones: string[];
  emails: string[];
  website?: string;
  address?: string;
  locality?: string;
  lat?: number;
  lon?: number;
  category?: string;
}

export interface Sighting {
  id: string;
  source: SourceId;
  sourceId: string;
  fetchedAt: string;
  sourceUrl?: string;
  raw: unknown;
  extracted: ExtractedFields;
}

export interface SourceAdapter {
  id: SourceId;
  parse(contents: string, fetchedAt: string): Sighting[];
}

export type Vertical = 'gym' | 'salon' | 'restaurant' | 'agency';

export interface FieldValue<T> {
  value: T;
  source: SourceId;
  sightingId: string;
  firstSeen: string;
  lastSeen: string;
}

export interface Business {
  id: string;
  name: FieldValue<string>;
  phones: FieldValue<string>[];
  emails: FieldValue<string>[];
  website?: FieldValue<string>;
  address?: FieldValue<string>;
  location?: FieldValue<{ lat: number; lon: number }>;
  verticalMatch: Vertical | null;
  sightingIds: string[];
}
