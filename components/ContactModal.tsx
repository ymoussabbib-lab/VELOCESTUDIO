"use client";

import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-[6px]">
      <div className="relative w-full max-w-lg bg-paper border border-ink p-8 shadow-2xl text-ink">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-grey-400 hover:text-ink transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-accent mb-4" />
            <h3 className="text-2xl font-extrabold text-ink">Audit Request Received</h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              We have received your details. We will map your operational bottlenecks and respond within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-accent mb-2">
              Architecture & Workflow Audit
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-ink">
              Schedule a Workflow Audit
            </h3>
            <p className="mt-1 text-xs text-grey-600">
              One session to map your day and identify where manual friction costs you money.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 font-sans text-sm">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.05em] text-ink mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Younes M."
                  className="w-full border border-line bg-paper-alt px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.05em] text-ink mb-1">
                  Business Email
                </label>
                <input
                  required
                  type="email"
                  placeholder="contact@business.ma"
                  className="w-full border border-line bg-paper-alt px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.05em] text-ink mb-1">
                  Industry Vertical
                </label>
                <select className="w-full border border-line bg-paper-alt px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none">
                  <option>Fitness & Gym Operations</option>
                  <option>Real Estate & Agency CRM</option>
                  <option>Salon, Spa & Appointment Operations</option>
                  <option>Restaurant & QR Ordering Ecosystem</option>
                  <option>Custom Enterprise Automation</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.05em] text-ink mb-1">
                  What part of the day goes wrong?
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your current manual steps, spreadsheets or bottlenecks..."
                  className="w-full border border-line bg-paper-alt px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent text-on-dark py-3.5 font-mono text-[12px] uppercase tracking-[0.08em] hover:bg-ink transition-colors cursor-pointer mt-2"
              >
                Submit Audit Request →
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
