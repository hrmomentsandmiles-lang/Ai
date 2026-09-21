import React from 'react';
import { ShieldCheck, UserCheck, LogOut, ArrowLeft, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';

export const Header: React.FC = () => {
  const { session, logout } = useAuth();
  const { pathname, navigate } = useRouter();

  const isAuthPage = pathname === '/' || pathname === '/login';

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="brand-home-link"
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:bg-slate-800 transition-colors">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-base leading-tight tracking-tight">
                  CivicFlow AI
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
                  Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Team MoveSmart
              </p>
            </div>
          </button>
        </div>

        {/* Center / Theme pill on desktop */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
          <Cpu className="w-3.5 h-3.5 text-slate-500" />
          <span>Theme: Smart Cities & Public Services</span>
        </div>

        {/* Right Nav State */}
        <div className="flex items-center gap-2">
          {!isAuthPage && (
            <button
              id="header-nav-login"
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portal</span>
            </button>
          )}

          {session ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-medium text-slate-900">
                  {session.role === 'citizen' ? 'Citizen' : 'Officer'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {session.phone}
                </span>
              </div>

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  session.role === 'citizen'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}
                title={session.displayName}
              >
                {session.role === 'citizen' ? (
                  <UserCheck className="w-3.5 h-3.5" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
              </div>

              <button
                id="header-logout-btn"
                type="button"
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="End mock session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
              Mock Auth Ready
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
