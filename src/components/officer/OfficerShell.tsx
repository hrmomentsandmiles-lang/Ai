import React from 'react';
import { ShieldCheck, User, LogOut, ArrowLeft, Layers, CheckCircle2, Phone, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';

export const OfficerShell: React.FC = () => {
  const { session, logout } = useAuth();
  const { navigate } = useRouter();

  const formattedDate = session?.authenticatedAt
    ? new Date(session.authenticatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Active';

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Navigation Breadcrumb / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            id="officer-back-to-home-btn"
            type="button"
            onClick={() => navigate('/')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Return to Welcome / Auth Screen"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Route: /officer
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                Municipal Officer Session Active
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Officer Operations Shell
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="officer-switch-to-citizen-btn"
            type="button"
            onClick={() => navigate('/citizen')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <User className="w-3.5 h-3.5 text-slate-600" />
            <span>Switch to /citizen</span>
          </button>

          <button
            id="officer-logout-btn"
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Session Details Card */}
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Officer Credential & Assignment Metadata
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block mb-1">Operational Role</span>
            <div className="flex items-center gap-2 font-medium text-slate-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Municipal Officer</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block mb-1">Department Assigned</span>
            <div className="flex items-center gap-2 font-medium text-slate-900 text-sm">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>{session?.department || 'Urban Works & Public Safety'}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block mb-1">Contact / Dispatch Line</span>
            <div className="flex items-center gap-2 font-mono text-slate-900 text-sm">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>{session?.phone || '+1 (555) 876-5432'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Foundation Information Box */}
      <div className="mt-6 border border-slate-200 bg-slate-50/70 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Initial Project Foundation Ready
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              This is the officer operations shell for <strong>CivicFlow AI</strong>. The foundation establishes clean role separation, simulated authentication, and ready-to-wire routing.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-500 space-y-1.5">
              <div className="font-medium text-slate-700">Upcoming Planned Milestones:</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Departmental issue triage queue with SQLite + Prisma backend</li>
                <li>Agentic auto-triage, priority categorization & field team dispatch</li>
                <li>Municipal resolution audit & verification workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
