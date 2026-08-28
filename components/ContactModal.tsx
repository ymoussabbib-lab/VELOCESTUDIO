"use client";

import React, { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';

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
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-surfaceHover bg-surface p-6 sm:p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-mutedText hover:text-brightText">
          <X className="h-5 w-5"/>
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-statusEmerald mb-4"/>
            <h3 className="text-2xl font-bold text-brightText">Audit Request Received</h3>
            <p className="mt-2 text-sm text-mutedText">We will evaluate your requirements and contact you within 24 hours.</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-brightText">Schedule Architecture Audit</h3>
            <p className="mt-1 text-xs text-mutedText">Describe your business model and manual operational bottlenecks.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brightText mb-1">Full Name</label>
                <input required type="text" placeholder="Alex Morgan" className="w-full rounded-xl border border-surfaceHover bg-obsidian px-4 py-2.5 text-sm text-brightText focus:border-accentCyan focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brightText mb-1">Business Email</label>
                <input required type="email" placeholder="alex@company.com" className="w-full rounded-xl border border-surfaceHover bg-obsidian px-4 py-2.5 text-sm text-brightText focus:border-accentCyan focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brightText mb-1">Industry Vertical</label>
                <select className="w-full rounded-xl border border-surfaceHover bg-obsidian px-4 py-2.5 text-sm text-brightText focus:border-accentCyan focus:outline-none">
                  <option>Fitness & Gym Operations</option>
                  <option>Real Estate & Marketplace</option>
                  <option>Salon & Spa Booking</option>
                  <option>Restaurant & QR Ordering Ecosystem</option>
                  <option>Custom Enterprise Automation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brightText mb-1">Bottlenecks & Goals</label>
                <textarea rows={3} placeholder="Describe processes you want automated..." className="w-full rounded-xl border border-surfaceHover bg-obsidian px-4 py-2.5 text-sm text-brightText focus:border-accentCyan focus:outline-none" />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accentCyan to-accentTeal py-3 text-sm font-semibold text-obsidian shadow-lg shadow-accentCyan/20 hover:opacity-95 transition-opacity"
              >
                <span>Submit Audit Request</span>
                <Send className="h-4 w-4"/>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
