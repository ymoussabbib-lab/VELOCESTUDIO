import { notFound, redirect } from 'next/navigation';
import { LEGACY_PROJECT_SLUGS } from '@/data/projects';

export function generateStaticParams() {
  return Object.keys(LEGACY_PROJECT_SLUGS).map((slug) => ({ slug }));
}

export default function LegacyProjectPage({ params }: { params: { slug: string } }) {
  const canonical = LEGACY_PROJECT_SLUGS[params.slug];
  if (!canonical) {
    notFound();
  }

  redirect(`/work/${canonical}`);
}
