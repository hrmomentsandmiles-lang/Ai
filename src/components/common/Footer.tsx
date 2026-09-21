import React from 'react';
import { AlertCircle, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 text-xs text-slate-600 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">CivicFlow AI</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Agentic Urban Problem Resolution & Coordination Platform
            </p>
            <p className="text-slate-400 italic text-[11px] mt-1.5">
              “See a problem. Report it. Let AI coordinate the response.”
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-1">Hackathon Context</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Team: <span className="font-medium text-slate-800">MoveSmart</span>
            </p>
            <p className="text-slate-500 text-xs leading-relaxed mt-0.5">
              Theme: <span className="font-medium text-slate-800">Agentic AI for Smart Cities and Public Services</span>
            </p>
          </div>

          <div className="rounded-lg bg-amber-50/70 border border-amber-200/80 p-3">
            <div className="flex items-start gap-2 text-amber-900">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <div>
                <span className="font-semibold text-amber-900 block text-xs">
                  Prototype Disclaimer
                </span>
                <p className="text-amber-800 text-[11px] leading-tight mt-0.5">
                  Mock authentication only. No government identity verification or national registry lookup is performed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>Architecture: Next/React Foundation • SQLite + Prisma Ready • Modular Agents Pipeline</span>
          </div>
          <span>Team MoveSmart © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
};
