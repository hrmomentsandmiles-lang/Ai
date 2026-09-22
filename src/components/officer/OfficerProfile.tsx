import React from 'react';
import {
  ShieldCheck,
  Building2,
  Phone,
  Calendar,
  LogOut,
  User,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';

export const OfficerProfile: React.FC = () => {
  const { session, logout } = useAuth();
  const { navigate } = useRouter();

  const formattedDate = session?.authenticatedAt
    ? new Date(session.authenticatedAt).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Active Session';

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/officer/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#4D602B] hover:text-[#324218] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EEF5E9] text-[#2C4118] border border-[#CFDEBD]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#4D602B]" />
          Verified Officer
        </span>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4ECD8] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDF3E6]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF2E2] text-[#4D602B] flex items-center justify-center border border-[#D5E1CA]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#182315]">
                {session?.displayName || 'Municipal Officer'}
              </h1>
              <p className="text-xs text-[#5C6E54] mt-0.5">
                Officer Dispatch ID: {session?.badgeId || 'MUNI-FLD-882'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#554728] bg-[#FAF8F5] hover:bg-[#F2EFE8] border border-[#DDD4BD] rounded-xl transition-colors self-start sm:self-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Credentials & Assignment Metadata */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#697B62] mb-4">
            Credential & Dispatch Assignment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4ECD8]">
              <span className="text-[11px] font-bold uppercase text-[#73846D] block mb-1">
                Operational Role
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-[#182315]">
                <ShieldCheck className="w-4 h-4 text-[#4D602B]" />
                <span>Municipal Officer</span>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4ECD8]">
              <span className="text-[11px] font-bold uppercase text-[#73846D] block mb-1">
                Department
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-[#182315]">
                <Building2 className="w-4 h-4 text-[#4D602B]" />
                <span>{session?.department || 'Urban Works & Public Safety'}</span>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E4ECD8]">
              <span className="text-[11px] font-bold uppercase text-[#73846D] block mb-1">
                Dispatch Line
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-[#182315] font-mono">
                <Phone className="w-4 h-4 text-[#4D602B]" />
                <span>{session?.phone || '+91 98765 43211'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Metadata */}
        <div className="pt-4 border-t border-[#EDF3E6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6B7C64]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#889981]" />
            <span>Authenticated session active since: {formattedDate}</span>
          </div>

          <span className="font-mono text-[11px] text-[#86977F]">
            Node: HYD-SECTOR-04
          </span>
        </div>
      </div>
    </div>
  );
};
