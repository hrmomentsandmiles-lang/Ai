import React, { useState } from 'react';
import { User, Phone, ShieldCheck, Calendar, LogOut, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';

export const CitizenProfile: React.FC = () => {
  const { session, logout, updateUserName } = useAuth();
  const { navigate } = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(session?.displayName || 'Aarav Sharma');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateUserName(nameInput.trim());
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const formattedDate = session?.authenticatedAt
    ? new Date(session.authenticatedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Active';

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-[#EEF2E6] pb-6">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#697962] block mb-1">
          CITIZEN ACCOUNT
        </span>
        <h1 className="text-3xl font-bold text-[#182315] tracking-tight">
          Profile
        </h1>
        <p className="mt-1.5 text-sm text-[#55644F]">
          Manage your verified citizen profile and registration details.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile name updated successfully.</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E4ECD8] shadow-xs space-y-7">
        {/* User Identity Banner */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#EEF2E6]">
          <div className="w-16 h-16 rounded-2xl bg-[#EEF4E5] text-[#435322] flex items-center justify-center font-bold text-2xl shrink-0 shadow-inner">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[#182315] truncate">
              {session?.displayName || 'Aarav Sharma'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF2E2] text-[#36491E] border border-[#D0DFBF]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4D602B]" />
                Verified Citizen
              </span>
              <span className="text-xs text-[#71826B]">
                Registered Resident
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="space-y-4">
          {/* Name Row */}
          <div className="p-4 bg-[#FAFBF9] rounded-2xl border border-[#E7EFE1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#73846C] block">
                Name
              </span>
              {!isEditing ? (
                <span className="text-sm sm:text-base font-bold text-[#182315] mt-0.5 block">
                  {session?.displayName || 'Aarav Sharma'}
                </span>
              ) : (
                <form onSubmit={handleSave} className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-[#CAD8BC] text-xs sm:text-sm text-[#182315] focus:outline-none focus:ring-1 focus:ring-[#4D602B]"
                    placeholder="Enter your name"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#435322] text-white text-xs font-medium rounded-lg hover:bg-[#35431A]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-2.5 py-1.5 text-xs text-[#63745C] hover:text-[#182315]"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setNameInput(session?.displayName || 'Aarav Sharma');
                  setIsEditing(true);
                }}
                className="text-xs font-semibold text-[#435322] hover:underline self-start sm:self-center"
              >
                Edit Name
              </button>
            )}
          </div>

          {/* Mobile Number Row */}
          <div className="p-4 bg-[#FAFBF9] rounded-2xl border border-[#E7EFE1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F5EB] text-[#55674D] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#73846C] block">
                  Mobile Number
                </span>
                <span className="font-mono text-sm font-semibold text-[#182315] mt-0.5 block">
                  {session?.phone || '+91 98765 43210'}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified OTP
            </span>
          </div>

          {/* Account Type Row */}
          <div className="p-4 bg-[#FAFBF9] rounded-2xl border border-[#E7EFE1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F5EB] text-[#55674D] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#73846C] block">
                  Account Type
                </span>
                <span className="text-sm font-semibold text-[#182315] mt-0.5 block">
                  Citizen
                </span>
              </div>
            </div>

            <span className="text-xs text-[#6A7B63]">
              Active Resident
            </span>
          </div>

          {/* Registration Date Row */}
          <div className="p-4 bg-[#FAFBF9] rounded-2xl border border-[#E7EFE1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F5EB] text-[#55674D] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#73846C] block">
                  Session Date
                </span>
                <span className="text-xs text-[#2A3723] mt-0.5 block">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sign out button */}
        <div className="pt-4 border-t border-[#EEF2E6] flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/citizen/dashboard')}
            className="text-xs font-semibold text-[#55644F] hover:text-[#182315]"
          >
            ← Back to Dashboard
          </button>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
