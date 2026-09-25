import React from 'react';
import { Camera, GitFork, Users } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const { session } = useAuth();

  return (
    <div className="w-full relative overflow-hidden bg-[#FAF8F5] min-h-[calc(100vh-80px)] flex flex-col justify-between">
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-[center_left_20%] lg:bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/hero-background.jpg')" }}
      />

      {/* Scrim: Gentle gradient on the left side to maximize text legibility while preserving the bright daylight atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/80 via-[#FAF8F5]/35 to-transparent pointer-events-none w-full lg:w-[62%]" />

      {/* Right Side: Handwritten message & Curved Arrow pointing toward municipal workers */}
      <div className="hidden lg:flex flex-col items-start absolute top-10 right-12 xl:right-24 z-10 pointer-events-none select-none">
        <div className="font-script text-3xl xl:text-4xl font-bold text-[#182315] leading-[1.12] rotate-[-2deg] drop-shadow-xs">
          <div>Cleaner</div>
          <div>Safer</div>
          <div>Greener</div>
          <div>Tomorrow</div>
        </div>
        {/* Curved Arrow pointing down-left toward the workers */}
        <div className="relative mt-2 -ml-8">
          <svg
            viewBox="0 0 140 85"
            className="w-28 xl:w-32 h-auto text-[#182315] overflow-visible"
            fill="none"
            stroke="currentColor"
          >
            {/* Curved stem */}
            <path
              d="M 115 10 C 110 50, 60 58, 22 68"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Arrowhead */}
            <path
              d="M 34 58 L 20 69 L 32 79"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Hero Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] font-bold text-[#182315] tracking-tight leading-[1.08]">
            See a problem. <br />
            Report it. <br />
            <span className="text-[#4D602B]">Let AI coordinate</span> <br />
            <span className="text-[#4D602B]">the response.</span>
          </h1>

          {/* Subtle Olive Horizontal Divider */}
          <div className="w-12 h-[2px] bg-[#4D602B]/40 my-5 sm:my-6 rounded-full" />

          {/* Supporting Subtitle */}
          <p className="text-base sm:text-lg text-[#202C1B] font-medium leading-snug">
            Smarter cities. Safer communities. <br />
            Together.
          </p>

          {/* Three Feature Cards: Report, Track, Impact */}
          <div className="mt-8 sm:mt-10 pt-4 flex flex-wrap sm:flex-nowrap items-center gap-6 sm:gap-8 lg:gap-10">
            {/* Feature 1: Report */}
            <div
              onClick={() =>
                navigate(
                  session
                    ? session.role === 'citizen'
                      ? '/citizen/report'
                      : '/officer/dashboard'
                    : '/login'
                )
              }
              className="flex items-center gap-3.5 group cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div className="w-12 h-12 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#2F3E27] group-hover:scale-105 transition-all">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#182315] leading-tight group-hover:text-[#4D602B] transition-colors">
                  Report
                </h4>
                <p className="text-xs text-[#52634B] leading-tight mt-1 font-medium">
                  Upload photo <br />
                  and location
                </p>
              </div>
            </div>

            {/* Feature 2: Track */}
            <div
              onClick={() =>
                navigate(
                  session
                    ? session.role === 'citizen'
                      ? '/citizen/dashboard'
                      : '/officer/dashboard'
                    : '/login'
                )
              }
              className="flex items-center gap-3.5 group cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div className="w-12 h-12 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#2F3E27] group-hover:scale-105 transition-all">
                <GitFork className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#182315] leading-tight group-hover:text-[#4D602B] transition-colors">
                  Track
                </h4>
                <p className="text-xs text-[#52634B] leading-tight mt-1 font-medium">
                  See real-time <br />
                  updates
                </p>
              </div>
            </div>

            {/* Feature 3: Impact */}
            <div
              onClick={() => navigate('/about')}
              className="flex items-center gap-3.5 group cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div className="w-12 h-12 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#2F3E27] group-hover:scale-105 transition-all">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#182315] leading-tight group-hover:text-[#4D602B] transition-colors">
                  Impact
                </h4>
                <p className="text-xs text-[#52634B] leading-tight mt-1 font-medium">
                  Cleaner, safer <br />
                  cities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Badge: Powered by AI. Driven by people. */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 w-full flex justify-end">
        <div className="inline-flex items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#142011]/85 backdrop-blur-md text-white border border-white/15 shadow-xl select-none">
          {/* Illuminated Leaf Emblem */}
          <div className="w-8 h-8 rounded-xl bg-[#4D602B]/60 flex items-center justify-center shrink-0 border border-[#86AB4B]/40">
            <svg className="w-5 h-5" viewBox="0 0 36 36" fill="none">
              <path
                d="M8.5 24.5C6.5 19 9.5 13 15 11C15 16.5 12.5 22.5 8.5 24.5Z"
                fill="#A9D868"
              />
              <path
                d="M17 10C22.5 7.5 28 10 30 15C25 15.5 19 13.5 17 10Z"
                fill="#88B84B"
              />
              <path
                d="M14 27C14 19 21 13 28 12C28 20 22 26 14 27Z"
                fill="#6EA036"
              />
            </svg>
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Powered by AI.
            </span>
            <span className="text-[11px] sm:text-xs text-[#D0DFCA] font-medium mt-0.5">
              Driven by people.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
