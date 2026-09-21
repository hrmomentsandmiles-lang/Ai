import React from 'react';
import { User, Shield, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types/auth';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  disabled?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        Select Access Role
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Citizen Role Card */}
        <button
          id="role-citizen-select"
          type="button"
          disabled={disabled}
          onClick={() => onSelectRole('citizen')}
          className={`relative p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
            selectedRole === 'citizen'
              ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              selectedRole === 'citizen'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <User className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Citizen
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Report civic issues, potholes, waste, and monitor real-time AI resolution.
            </p>
          </div>

          {selectedRole === 'citizen' && (
            <div className="absolute top-3.5 right-3 text-slate-900">
              <CheckCircle2 className="w-4 h-4 fill-slate-900 text-white" />
            </div>
          )}
        </button>

        {/* Officer Role Card */}
        <button
          id="role-officer-select"
          type="button"
          disabled={disabled}
          onClick={() => onSelectRole('officer')}
          className={`relative p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
            selectedRole === 'officer'
              ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              selectedRole === 'officer'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Shield className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Officer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">
              Municipal agency triage, department dispatch, and resolution verification.
            </p>
          </div>

          {selectedRole === 'officer' && (
            <div className="absolute top-3.5 right-3 text-slate-900">
              <CheckCircle2 className="w-4 h-4 fill-slate-900 text-white" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
