import React, { useState } from 'react';
import { Menu, X, ShieldCheck, UserCheck, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { CivicFlowLogo } from './CivicFlowLogo';

export const Header: React.FC = () => {
  const { session, logout } = useAuth();
  const { pathname, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authenticated Area Checks
  const isCitizenArea = session?.role === 'citizen' && pathname.startsWith('/citizen');
  const isOfficerArea = session?.role === 'officer' && pathname.startsWith('/officer');

  // Navigation Links: Officer Area vs Citizen Area vs Public Website
  const navLinks = isOfficerArea
    ? [
        { label: 'Dashboard', path: '/officer/dashboard' },
        { label: 'Incidents', path: '/officer/dashboard' },
        { label: 'Profile', path: '/officer/profile' },
      ]
    : isCitizenArea
    ? [
        { label: 'Home', path: '/' },
        { label: 'Report Issue', path: '/citizen/report' },
        { label: 'Dashboard', path: '/citizen/dashboard' },
        { label: 'Profile', path: '/citizen/profile' },
      ]
    : [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Support', path: '/support' },
        { label: 'Contact', path: '/contact' },
      ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isCurrent = (path: string) => {
    if (path === '/') return pathname === '/' || pathname === '';
    if (path === '/citizen/dashboard') {
      return pathname === '/citizen/dashboard' || pathname === '/citizen';
    }
    if (path === '/officer/dashboard') {
      return pathname === '/officer/dashboard' || pathname === '/officer';
    }
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7ECE0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand */}
        <CivicFlowLogo
          onClick={() => handleNav(isOfficerArea ? '/officer/dashboard' : isCitizenArea ? '/citizen/dashboard' : '/')}
          size="md"
          className="py-1"
        />

        {/* Center/Right Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const active = isCurrent(link.path);
            return (
              <button
                key={link.label + link.path}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => handleNav(link.path)}
                className={`relative py-1 text-sm font-medium tracking-wide transition-colors ${
                  active
                    ? 'text-[#182315] font-semibold'
                    : 'text-[#5A6754] hover:text-[#182315]'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4D602B] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Far Right: Authenticated Officer / Citizen Controls OR Public Login CTA */}
        <div className="hidden md:flex items-center space-x-3">
          {isOfficerArea ? (
            /* 4. Authenticated Officer Header Right Side: Officer Name, Officer, Logout */
            <div className="flex items-center gap-3 pl-3 border-l border-[#E2E8DA]">
              <button
                id="header-officer-profile-btn"
                type="button"
                onClick={() => handleNav('/officer/profile')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EBF2E2] text-[#36491E] border border-[#CFDEBE] hover:bg-[#E2ECD4] transition-colors"
                title="Officer Profile"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#4D602B]" />
                <span className="max-w-[130px] truncate">
                  {session?.displayName || 'Municipal Officer'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D602B] bg-white/80 px-1.5 py-0.5 rounded border border-[#CFDEBE]/60">
                  Officer
                </span>
              </button>

              <button
                id="header-signout-btn"
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-[#73836D] hover:text-[#2A3723] hover:bg-[#EBF0E4] rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : isCitizenArea ? (
            /* Authenticated Citizen Header Right Side */
            <div className="flex items-center gap-3 pl-3 border-l border-[#E2E8DA]">
              <button
                id="header-citizen-profile-btn"
                type="button"
                onClick={() => handleNav('/citizen/profile')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EBF2E2] text-[#36491E] border border-[#CFDEBE] hover:bg-[#E2ECD4] transition-colors"
                title="Citizen Profile"
              >
                <User className="w-3.5 h-3.5 text-[#4D602B]" />
                <span className="max-w-[140px] truncate">
                  {session?.displayName || 'Aarav Sharma'}
                </span>
              </button>

              <button
                id="header-signout-btn"
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-[#73836D] hover:text-[#2A3723] hover:bg-[#EBF0E4] rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : session ? (
            /* User is logged in but browsing public pages */
            <div className="flex items-center gap-2 pl-3 border-l border-[#E2E8DA]">
              <button
                id="header-user-portal-btn"
                type="button"
                onClick={() =>
                  navigate(session.role === 'citizen' ? '/citizen/dashboard' : '/officer/dashboard')
                }
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EBF2E2] text-[#36491E] border border-[#CFDEBE] hover:bg-[#E2ECD4] transition-colors"
              >
                {session.role === 'citizen' ? (
                  <UserCheck className="w-3.5 h-3.5 text-[#4D602B]" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4D602B]" />
                )}
                <span>
                  {session.role === 'citizen' ? 'Citizen Portal' : 'Officer Portal'}
                </span>
              </button>

              <button
                id="header-signout-btn"
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-[#73836D] hover:text-[#2A3723] hover:bg-[#EBF0E4] rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Public visitor */
            <button
              id="header-login-btn"
              type="button"
              onClick={() => handleNav('/login')}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                pathname === '/login'
                  ? 'bg-[#3A491F] text-white ring-2 ring-[#4D602B]/40'
                  : 'bg-[#435322] hover:bg-[#36441B] text-white'
              }`}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          {session && (
            <button
              type="button"
              onClick={() =>
                navigate(session.role === 'citizen' ? '/citizen/dashboard' : '/officer/dashboard')
              }
              className="text-xs px-2.5 py-1 rounded-lg bg-[#EBF2E2] text-[#36491E] font-semibold border border-[#D5E1CA]"
            >
              {session.role === 'citizen' ? 'Citizen' : 'Officer'}
            </button>
          )}
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#435322] hover:bg-[#EBF0E4] rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E7ECE0] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const active = isCurrent(link.path);
            return (
              <button
                key={link.label + link.path}
                type="button"
                onClick={() => handleNav(link.path)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#EBF2E2] text-[#36491E] font-semibold'
                    : 'text-[#4F5D4A] hover:bg-[#F2F5ED]'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#E7ECE0]">
            {session ? (
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleNav(session.role === 'citizen' ? '/citizen/dashboard' : '/officer/dashboard')
                  }
                  className="text-xs font-semibold text-[#36491E]"
                >
                  {isOfficerArea
                    ? `Officer: ${session.displayName || 'Officer'}`
                    : isCitizenArea
                    ? `Citizen: ${session.displayName || 'Citizen'}`
                    : `Go to ${session.role === 'citizen' ? 'Citizen Portal' : 'Officer Portal'}`}
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs font-semibold text-[#574823] hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNav('/login')}
                className="w-full text-center py-2.5 bg-[#435322] hover:bg-[#36441B] text-white font-semibold text-sm rounded-xl"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
