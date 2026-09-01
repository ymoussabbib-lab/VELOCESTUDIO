import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectDetailTemplate } from '@/components/work/ProjectDetailTemplate';
import { PROJECTS, getProject } from '@/data/projects';

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) {
    return {};
  }

  return {
    title: `${project.name} - Demo Business System by Veloce Studio`,
    description: project.shortPromise,
  };
}

export default function WorkPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <ProjectDetailTemplate project={project} />
      <Footer />
    </div>
  );
}
