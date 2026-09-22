import React from 'react';
import { User, Phone, ShieldCheck, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';

export const CitizenProfilePage: React.FC = () => {
  const { session, logout } = useAuth();
  const { navigate } = useRouter();

  const citizenName = session?.displayName || 'Ashar';
  const mobile = session?.phone || '+91 98765 43210';
  const authDate = session?.authenticatedAt
    ? new Date(session.authenticatedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Active';

  return (
    <div className="w-full bg-[#FAF8F5] min-h-[calc(100vh-160px)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Header */}
        <div className="pb-6 border-b border-[#E4ECD8]">
          <span className="text-xs font-bold tracking-[0.2em] text-[#697962] uppercase block mb-2">
            ACCOUNT
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#182315] tracking-tight">
            Profile
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#55644F]">
            Your verified civic profile and account details.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-10 border border-[#E4ECD8] shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-[#F0F4EC]">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF4E8] text-[#4D602B] flex items-center justify-center font-bold text-xl border border-[#DCE4D1]">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#182315]">{citizenName}</h2>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF2E2] text-[#36491E] mt-1 border border-[#CFDEBE]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4D602B]" />
                <span>Verified Resident</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-[#FAFBF8] border border-[#EAEFE2]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#697A62] block mb-1">
                Name
              </span>
              <p className="text-base font-semibold text-[#182315]">{citizenName}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBF8] border border-[#EAEFE2]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#697A62] block mb-1">
                Mobile
              </span>
              <div className="flex items-center gap-2 text-base font-mono font-semibold text-[#182315]">
                <Phone className="w-4 h-4 text-[#4D602B]" />
                <span>{mobile}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBF8] border border-[#EAEFE2]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#697A62] block mb-1">
                Account Type
              </span>
              <p className="text-base font-semibold text-[#182315]">Citizen</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBF8] border border-[#EAEFE2]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#697A62] block mb-1">
                Session Active Since
              </span>
              <div className="flex items-center gap-2 text-base font-semibold text-[#182315]">
                <Calendar className="w-4 h-4 text-[#4D602B]" />
                <span>{authDate}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#F0F4EC]">
            <button
              type="button"
              onClick={() => navigate('/citizen/dashboard')}
              className="text-xs sm:text-sm font-semibold text-[#4D602B] hover:underline"
            >
              ← Return to Dashboard
            </button>

            <button
              id="profile-sign-out-btn"
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
