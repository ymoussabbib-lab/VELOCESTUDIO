"use client";

import React, { useState } from 'react';
import { PROJECTS, ProjectData } from '@/data/portfolioData';
import { CaseStudyView } from '@/components/CaseStudyView';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactModal } from '@/components/ContactModal';
import { useRouter } from 'next/navigation';

interface ProjectDetailClientProps {
  initialSlug: string;
}

export const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({ initialSlug }) => {
  const router = useRouter();
  const [isConsultOpen, setIsConsultOpen] = useState<boolean>(false);

  let normalizedSlug = initialSlug;
  if (normalizedSlug === 'fitpulse-pro') normalizedSlug = 'fitpulse';
  if (normalizedSlug === 'restaurant-ecosystem') normalizedSlug = 'restaurant';

  const project: ProjectData | undefined = PROJECTS.find((p) => p.slug === normalizedSlug) || PROJECTS[0];

  const handleGoHome = (hash?: string) => {
    if (!hash || hash === '#top') {
      router.push('/');
    } else {
      router.push(`/${hash}`);
    }
  };

  const handleSelectProject = (nextSlug: string) => {
    router.push(`/projects/${nextSlug}`);
  };

  return (
    <div className="bg-paper text-ink font-sans min-h-screen">
      <Header
        onGoHome={handleGoHome}
        onOpenConsult={() => setIsConsultOpen(true)}
      />
      <main>
        <CaseStudyView
          slug={project.slug}
          onGoHome={handleGoHome}
          onSelectProject={handleSelectProject}
        />
      </main>
      <Footer />
      <ContactModal
        isOpen={isConsultOpen}
        onClose={() => setIsConsultOpen(false)}
      />
    </div>
  );
};
