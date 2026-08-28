"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CapabilityMatrix } from '@/components/CapabilityMatrix';
import { ProjectCard } from '@/components/ProjectCard';
import { ContactModal } from '@/components/ContactModal';
import { PROJECTS_DATA } from '@/data/projects';

export default function Home() {
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', 'Fitness & Wellness SaaS', 'Real Estate Technology', 'Beauty & Wellness Operations', 'Restaurant Operations & CX'];

  const filteredProjects = activeCategory === 'ALL'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-obsidian">
      <Navbar onOpenConsult={() => setIsConsultOpen(true)} />
      <Hero onOpenConsult={() => setIsConsultOpen(true)} />
      <CapabilityMatrix />

      <section id="showcase" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-semibold tracking-widest text-accentCyan uppercase">Production Solutions</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-brightText sm:text-4xl">Deployed B2B Platforms</p>
            </div>

            <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-accentCyan text-obsidian shadow-md shadow-accentCyan/20'
                      : 'bg-surface border border-surfaceHover text-mutedText hover:text-brightText'
                  }`}
                >
                  {cat === 'ALL' ? 'All Systems' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="py-20 border-t border-surfaceHover bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold tracking-widest text-accentCyan uppercase">Execution Strategy</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-brightText sm:text-4xl">How We Build Your Software</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Workflow Audit", desc: "We map your operational steps and identify manual friction points." },
              { step: "02", title: "UX Blueprint", desc: "Designing low-friction interfaces for internal team members and buyers." },
              { step: "03", title: "Full-Stack Dev", desc: "Engineered with Next.js 14, TypeScript, and database integrations." },
              { step: "04", title: "Launch & Support", desc: "Connect WhatsApp messaging, POS terminal gateways, and live cloud hosting." }
            ].map((p, i) => (
              <div key={i} className="rounded-2xl border border-surfaceHover bg-obsidian p-6">
                <span className="text-3xl font-black text-accentCyan/40 block mb-4">{p.step}</span>
                <h3 className="text-lg font-bold text-brightText mb-2">{p.title}</h3>
                <p className="text-xs text-mutedText leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-surfaceHover bg-obsidian py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-mutedText">© 2026 VELOCE STUDIO. Custom B2B Software Engineering.</p>
          <div className="flex items-center gap-6 text-xs text-mutedText">
            <a href="#capabilities" className="hover:text-brightText">Capabilities</a>
            <a href="#showcase" className="hover:text-brightText">Work Portfolio</a>
            <button onClick={() => setIsConsultOpen(true)} className="hover:text-accentCyan">Book Consult</button>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isConsultOpen} onClose={() => setIsConsultOpen(false)} />
    </main>
  );
}
