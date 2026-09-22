import React, { useState } from 'react';
import { User, UserCheck, Shield, LogOut, ArrowLeft, Layers, CheckCircle2, Phone, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';

export const CitizenShell: React.FC = () => {
  const { session, logout, updateUserName } = useAuth();
  const { navigate } = useRouter();

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(session?.displayName || 'Aarav Sharma');

  const formattedDate = session?.authenticatedAt
    ? new Date(session.authenticatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Active';

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateUserName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Navigation Breadcrumb / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            id="citizen-back-to-home-btn"
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
                Route: /citizen
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Citizen Session Authenticated
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Login
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Welcome, <span className="font-semibold text-slate-900">{session?.displayName || 'Aarav Sharma'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="citizen-switch-to-officer-btn"
            type="button"
            onClick={() => navigate('/officer')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            <span>Switch to /officer</span>
          </button>

          <button
            id="citizen-logout-btn"
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Session Metadata Card */}
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Verified Resident Session Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* User Name Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-slate-500">User Name</span>
              <button
                type="button"
                onClick={() => {
                  if (!isEditingName) {
                    setNameInput(session?.displayName || 'Aarav Sharma');
                  }
                  setIsEditingName(!isEditingName);
                }}
                className="text-[10px] text-[#4D602B] hover:underline font-semibold"
              >
                {isEditingName ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {isEditingName ? (
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full text-xs px-2 py-1 bg-white border border-slate-300 rounded font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4D602B]"
                  placeholder="Enter name"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="px-2 py-1 text-[10px] bg-[#435322] hover:bg-[#36441B] text-white rounded font-medium"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-medium text-slate-900 text-sm">
                <User className="w-4 h-4 text-[#4D602B]" />
                <span className="truncate">{session?.displayName || 'Aarav Sharma'}</span>
              </div>
            )}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block mb-1">Access Role</span>
            <div className="flex items-center gap-2 font-medium text-slate-900 text-sm">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Citizen Resident</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block mb-1">Mobile Contact</span>
            <div className="flex items-center gap-2 font-mono text-slate-900 text-sm">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>{session?.phone || 'Guest Test Phone'}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block mb-1">Session Initialized</span>
            <div className="flex items-center gap-2 text-slate-900 text-sm">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>{formattedDate}</span>
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
              This is the citizen landing shell for <strong>CivicFlow AI</strong>. The foundation establishes clean routing, role authentication, and mock verification.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-500 space-y-1.5">
              <div className="font-medium text-slate-700">Upcoming Planned Milestones:</div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>SQLite + Prisma database initialization for issue storage</li>
                <li>Citizen multimodal reporting module (potholes, streetlights, sanitation)</li>
                <li>Agentic coordination pipeline & resolution status tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
