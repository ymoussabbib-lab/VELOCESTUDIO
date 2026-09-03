import { notFound, redirect } from 'next/navigation';
import { LEGACY_PROJECT_SLUGS } from '@/data/projects';

// Rendered per request: a prerendered `redirect()` is emitted as a bare 307
// with no Location header once deployed, so the redirect never completes.
export const dynamic = 'force-dynamic';

export default function LegacyProjectPage({ params }: { params: { slug: string } }) {
  const canonical = LEGACY_PROJECT_SLUGS[params.slug];
  if (!canonical) {
    notFound();
  }

  redirect(`/work/${canonical}`);
}
