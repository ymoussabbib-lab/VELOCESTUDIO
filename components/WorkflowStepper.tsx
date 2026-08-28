"use client";

import React, { useState } from 'react';
import { ProjectWorkflow } from '@/data/projects';
import { CheckCircle2 } from 'lucide-react';

interface WorkflowStepperProps {
  workflows: ProjectWorkflow[];
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ workflows }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!workflows || workflows.length === 0) return null;

  return (
    <div className="rounded-2xl border border-surfaceHover bg-surface/30 p-6 md:p-8">
      <div className="flex flex-wrap gap-2 mb-8 border-b border-surfaceHover pb-4">
        {workflows.map((w, idx) => (
          <button
            key={w.step}
            onClick={() => setActiveStep(idx)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeStep === idx 
                ? 'bg-accentCyan text-obsidian shadow-md shadow-accentCyan/20' 
                : 'bg-obsidian border border-surfaceHover text-mutedText hover:text-brightText'
            }`}
          >
            <span>Step {w.step}</span>
            {activeStep === idx && <CheckCircle2 className="h-3.5 w-3.5"/>}
          </button>
        ))}
      </div>

      <div className="min-h-[100px]">
        <h4 className="text-lg font-bold text-brightText mb-2">
          {workflows[activeStep].step}. {workflows[activeStep].title}
        </h4>
        <p className="text-sm text-mutedText leading-relaxed">
          {workflows[activeStep].description}
        </p>
      </div>
    </div>
  );
};
