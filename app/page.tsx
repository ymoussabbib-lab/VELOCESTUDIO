"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { MarqueeTicker } from '@/components/MarqueeTicker';
import { ProductionDial } from '@/components/ProductionDial';
import { ProductionIndex } from '@/components/ProductionIndex';
import { WhatWeRemove } from '@/components/WhatWeRemove';
import { HowABuildRuns } from '@/components/HowABuildRuns';
import { ContactBand } from '@/components/ContactBand';
import { ContactModal } from '@/components/ContactModal';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isConsultOpen, setIsConsultOpen] = useState<boolean>(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const revealTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll reveal setup
  const setupReveal = useCallback(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
    }

    const revealElement = (el: HTMLElement) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    };

    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal="1"]');

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting && e.boundingClientRect.top >= 0) return;
          revealElement(e.target as HTMLElement);
          observerRef.current?.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    nodes.forEach((n, i) => {
      const r = n.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 || r.top < 0) {
        revealElement(n);
        return;
      }
      n.style.opacity = '0';
      n.style.transform = 'translateY(24px)';
      n.style.transition = `opacity 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${(i % 4) * 70}ms, transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1) ${(i % 4) * 70}ms`;
      observerRef.current?.observe(n);
    });

    // Hard fallback after 9s so content is never stranded
    revealTimerRef.current = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal="1"]').forEach(revealElement);
    }, 9000);
  }, []);

  useEffect(() => {
    setupReveal();
    return () => {
      observerRef.current?.disconnect();
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, [setupReveal]);

  // In-page anchor scrolling (header nav, contact band "Read a build in full")
  const handleGoHome = (hash?: string) => {
    if (!hash || hash === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(hash);
      if (target) {
        const topOffset = target.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="bg-paper text-ink font-sans min-h-screen">
      <Header
        onGoHome={handleGoHome}
        onOpenConsult={() => setIsConsultOpen(true)}
      />

      <main>
        <Hero />
        <MarqueeTicker />
        <ProductionDial />
        <ProductionIndex
          activeIdx={activeIdx}
          onHoverProject={setActiveIdx}
        />
        <WhatWeRemove />
        <HowABuildRuns />
        <ContactBand
          onOpenConsult={() => setIsConsultOpen(true)}
          onGoIndex={() => handleGoHome('#index')}
        />
      </main>

      <Footer />

      <ContactModal
        isOpen={isConsultOpen}
        onClose={() => setIsConsultOpen(false)}
      />
    </div>
  );
}
