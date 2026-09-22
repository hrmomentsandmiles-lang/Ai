import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { CivicFlowLogo } from './CivicFlowLogo';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="border-t border-[#E5EBDD] bg-[#FAF8F5] py-10 text-xs text-[#5C6C55] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <CivicFlowLogo size="sm" onClick={() => navigate('/')} />
            <p className="text-xs text-[#6B7C64] leading-relaxed">
              Agentic Urban Problem Resolution & Coordination Platform for smarter, cleaner, and safer cities.
            </p>
            <p className="text-[11px] font-script text-xl text-[#4D602B]">
              People · Cities · Better Tomorrow
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#182315]">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="hover:text-[#182315] hover:underline"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="hover:text-[#182315] hover:underline"
                >
                  About CivicFlow
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/support')}
                  className="hover:text-[#182315] hover:underline"
                >
                  Support & FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="hover:text-[#182315] hover:underline"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="hover:text-[#182315] hover:underline text-[#4D602B] font-medium"
                >
                  Citizen & Officer Login
                </button>
              </li>
            </ul>
          </div>

          {/* Civic Services */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#182315]">
              Civic Services
            </h4>
            <ul className="space-y-2 text-xs text-[#5C6C55]">
              <li>Roads & Pavements</li>
              <li>Sanitation & Waste Management</li>
              <li>Street Lighting & Electricity</li>
              <li>Water Supply & Drainage</li>
              <li>Urban Parks & Green Spaces</li>
            </ul>
          </div>

          {/* Citizen Support */}
          <div className="rounded-2xl bg-[#F3F7EE] border border-[#DEE7D4] p-5 space-y-2">
            <h4 className="text-xs font-bold text-[#3C4D22] uppercase tracking-wider">
              Citizen Helpline
            </h4>
            <p className="text-sm font-bold text-[#182315]">
              1800 123 4567
            </p>
            <p className="text-[11px] text-[#63745C] leading-relaxed">
              Toll-free municipal assistance available Monday to Saturday, 9:00 AM – 6:00 PM.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#E5EBDD] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#71826A]">
          <div className="flex items-center gap-2">
            <span>People · Cities · Better Tomorrow</span>
          </div>
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} CivicFlow AI. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
