"use client";

import React from 'react';
import { Calendar, Users, QrCode, CreditCard, LayoutDashboard, Zap } from 'lucide-react';

const CAPABILITIES = [
  { icon: Calendar, title: "24/7 Booking & Scheduling", desc: "Real-time calendar locking, specialist allocation, and slot guard algorithms." },
  { icon: Users, title: "Customer & Member CRMs", desc: "Unified profile portals, client visit tracking, and retention automation." },
  { icon: QrCode, title: "QR Pass Access & Menus", desc: "Mobile digital check-in terminals and contactless menu ordering workflows." },
  { icon: CreditCard, title: "POS & Billing Engines", desc: "Integrated card collection, recurring membership subscriptions, and invoicing." },
  { icon: LayoutDashboard, title: "Operational KDS & Dashboards", desc: "Real-time kitchen display screens, line dispatch timers, and sales analytics." },
  { icon: Zap, title: "Notification Automations", desc: "Automated WhatsApp notifications, pass expiry alerts, and pipeline webhooks." }
];

export const CapabilityMatrix: React.FC = () => {
  return (
    <section id="capabilities" className="py-20 bg-obsidian border-y border-surfaceHover">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-semibold tracking-widest text-accentCyan uppercase">Capabilities Matrix</h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-brightText sm:text-4xl">Core Business Automation Pillars</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAPABILITIES.map((cap, i) => (
            <div key={i} className="rounded-2xl border border-surfaceHover bg-surface/40 p-8 hover:border-accentCyan/50 transition-colors group">
              <div className="h-12 w-12 rounded-xl bg-accentCyan/10 text-accentCyan flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <cap.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-brightText mb-3">{cap.title}</h3>
              <p className="text-sm text-mutedText leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
