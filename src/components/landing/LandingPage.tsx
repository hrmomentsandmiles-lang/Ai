import React from 'react';
import { LoginForm } from '../auth/LoginForm';
import { Sparkles, MapPin, Network, Cpu } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Hero Branding Section */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        {/* Badges */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            CivicFlow AI
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Team MoveSmart
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Cpu className="w-3.5 h-3.5" />
            Agentic AI for Smart Cities
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          CivicFlow AI
        </h1>
        <p className="text-base sm:text-lg text-slate-700 font-medium mt-2">
          Agentic Urban Problem Resolution & Coordination Platform
        </p>

        {/* Tagline */}
        <div className="mt-3 inline-block px-4 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200/60">
          <p className="text-sm text-slate-700 font-medium italic">
            “See a problem. Report it. Let AI coordinate the response.”
          </p>
        </div>
      </div>

      {/* Login & Prototype OTP Verification Form */}
      <LoginForm />

      {/* Foundation Architecture Highlights */}
      <div className="mt-12 pt-8 border-t border-slate-200/90 max-w-2xl mx-auto">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-4">
          Prototype Foundation Architecture
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Dual-Role Route Segregation</span>
              <p className="text-slate-500 mt-0.5 leading-snug">
                Dedicated endpoints for <code className="font-mono text-slate-700">/citizen</code> and <code className="font-mono text-slate-700">/officer</code> with persistent session state.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-2.5">
            <Network className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">Agentic Pipeline Ready</span>
              <p className="text-slate-500 mt-0.5 leading-snug">
                Engineered for modular expansion with SQLite + Prisma for urban resolution coordination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
