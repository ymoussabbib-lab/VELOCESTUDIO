"use client";

import React from 'react';

interface ProjectHeroImageProps {
  src: string;
  alt: string;
}

export const ProjectHeroImage: React.FC<ProjectHeroImageProps> = ({ src, alt }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full object-cover"
      onError={(e) => {
        e.currentTarget.src = 'https://placehold.co/1200x600/161E2E/F8FAFC?text=' + encodeURIComponent(alt);
      }}
    />
  );
};
