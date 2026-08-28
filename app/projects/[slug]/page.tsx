import React from 'react';
import { PROJECTS } from '@/data/portfolioData';
import { ProjectDetailClient } from '@/components/ProjectDetailClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  PROJECTS.forEach((p) => {
    slugs.push({ slug: p.slug });
  });
  // Include aliases
  slugs.push({ slug: 'fitpulse-pro' });
  slugs.push({ slug: 'restaurant-ecosystem' });
  return slugs;
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  let normalizedSlug = params.slug;
  if (normalizedSlug === 'fitpulse-pro') normalizedSlug = 'fitpulse';
  if (normalizedSlug === 'restaurant-ecosystem') normalizedSlug = 'restaurant';

  const projectExists = PROJECTS.some((p) => p.slug === normalizedSlug);
  if (!projectExists) {
    notFound();
  }

  return <ProjectDetailClient initialSlug={params.slug} />;
}
