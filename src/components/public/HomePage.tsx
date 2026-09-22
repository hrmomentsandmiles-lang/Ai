import React from 'react';
import { Camera, GitFork, Users, ArrowRight } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="w-full relative overflow-hidden bg-[#FAF8F5] min-h-[calc(100vh-80px)] flex flex-col justify-center">
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/hero-background.jpg')" }}
      />

      {/* Gradient Scrim for crisp legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/92 to-[#FAF8F5]/35" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 w-full">
        <div className="max-w-2xl">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#182315] tracking-tight leading-[1.12]">
            See a problem. <br />
            Report it. <br />
            <span className="text-[#4D602B]">Let AI coordinate</span> <br />
            <span className="text-[#4D602B]">the response.</span>
          </h1>

          {/* Supporting Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-[#55644F] font-normal leading-relaxed max-w-lg">
            Smarter cities. Safer communities. <br />
            Together.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              id="hero-get-started-btn"
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#435322] hover:bg-[#35431A] text-white font-medium text-sm rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4D602B]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-about-btn"
              type="button"
              onClick={() => navigate('/about')}
              className="inline-flex items-center px-6 py-3.5 bg-white/90 hover:bg-white text-[#182315] font-medium text-sm rounded-xl border border-[#DCE4D2] transition-all shadow-xs"
            >
              Learn More
            </button>
          </div>

          {/* Three Feature Cards: Report, Track, Impact */}
          <div className="mt-12 pt-8 border-t border-[#DDE6D3]/80 flex flex-wrap sm:flex-nowrap items-center gap-6 sm:gap-10">
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#182315] leading-tight">
                  Report
                </h4>
                <p className="text-xs text-[#697A62] leading-tight mt-1">
                  Upload photo <br className="hidden sm:block" />
                  and location
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-sm">
                <GitFork className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#182315] leading-tight">
                  Track
                </h4>
                <p className="text-xs text-[#697A62] leading-tight mt-1">
                  See real-time <br className="hidden sm:block" />
                  updates
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#182315] leading-tight">
                  Impact
                </h4>
                <p className="text-xs text-[#697A62] leading-tight mt-1">
                  Cleaner, safer <br className="hidden sm:block" />
                  cities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
