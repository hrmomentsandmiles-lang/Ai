import React from 'react';
import { Target, Leaf } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-[#FAF8F5] min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Top Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7">
            <span className="text-xs font-bold tracking-[0.2em] text-[#697962] uppercase block mb-3">
              ABOUT US
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.3rem] font-bold text-[#182315] tracking-tight leading-[1.15]">
              Smarter Cities <br />
              for <span className="text-[#4D602B]">Brighter Tomorrows</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#55644F] font-normal leading-relaxed max-w-xl">
              CivicFlow AI uses the power of AI to help citizens, officers, and
              city services work together for cleaner, safer and more livable cities.
            </p>
          </div>

          {/* Right Skyline Illustration matching reference */}
          <div className="lg:col-span-5 relative">
            {/* Handwritten script text in reference image */}
            <div className="absolute -top-3 right-4 z-10 text-right select-none">
              <p className="font-script text-3xl sm:text-4xl text-[#3A4B1F] leading-[1.1] transform rotate-2">
                People <br />
                Cities <br />
                Better <br />
                Tomorrow
              </p>
            </div>

            {/* Stylized SVG City Skyline & Trees */}
            <div className="w-full h-64 sm:h-72 relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#F5F8EF] to-[#E5EDDA] border border-[#DCE5D1] flex items-end justify-center px-4 pb-0">
              {/* Sun Glow */}
              <div className="absolute top-6 right-16 w-32 h-32 rounded-full bg-amber-100/70 blur-xl pointer-events-none" />
              <div className="absolute top-10 right-20 w-16 h-16 rounded-full bg-[#FFFBEA] opacity-80" />

              {/* Skyline SVG Layers */}
              <svg
                viewBox="0 0 500 280"
                className="w-full h-full object-cover"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background buildings */}
                <g opacity="0.45">
                  <rect x="70" y="80" width="34" height="180" rx="3" fill="#A4B794" />
                  <rect x="110" y="55" width="44" height="205" rx="3" fill="#9FB48E" />
                  <rect x="160" y="95" width="30" height="165" rx="3" fill="#ABC09E" />
                  <rect x="230" y="70" width="42" height="190" rx="3" fill="#A4B794" />
                  <rect x="280" y="110" width="38" height="150" rx="3" fill="#ABC09E" />
                  <rect x="325" y="60" width="48" height="200" rx="3" fill="#9FB48E" />
                  <rect x="380" y="85" width="36" height="175" rx="3" fill="#A4B794" />
                </g>

                {/* Foreground modern architectural buildings */}
                <g opacity="0.8">
                  {/* Tower 1 */}
                  <rect x="130" y="100" width="42" height="160" rx="4" fill="#6A8058" />
                  {/* Windows */}
                  <rect x="136" y="110" width="8" height="6" rx="1" fill="#EBF2E2" />
                  <rect x="148" y="110" width="8" height="6" rx="1" fill="#EBF2E2" />
                  <rect x="160" y="110" width="6" height="6" rx="1" fill="#EBF2E2" />
                  <rect x="136" y="124" width="8" height="6" rx="1" fill="#EBF2E2" />
                  <rect x="148" y="124" width="8" height="6" rx="1" fill="#EBF2E2" />
                  <rect x="160" y="124" width="6" height="6" rx="1" fill="#EBF2E2" />
                  <rect x="136" y="138" width="8" height="6" rx="1" fill="#EBF2E2" />
                  <rect x="148" y="138" width="8" height="6" rx="1" fill="#EBF2E2" />
                  <rect x="160" y="138" width="6" height="6" rx="1" fill="#EBF2E2" />

                  {/* Main Spire Tower */}
                  <rect x="180" y="50" width="55" height="210" rx="5" fill="#4D602B" />
                  <polygon points="207,18 205,50 210,50" fill="#3D4D22" />
                  {/* Vertical window stripes */}
                  <rect x="190" y="70" width="5" height="170" fill="#D7E4CB" opacity="0.7" />
                  <rect x="200" y="70" width="5" height="170" fill="#D7E4CB" opacity="0.7" />
                  <rect x="210" y="70" width="5" height="170" fill="#D7E4CB" opacity="0.7" />
                  <rect x="220" y="70" width="5" height="170" fill="#D7E4CB" opacity="0.7" />

                  {/* Mid building */}
                  <rect x="242" y="115" width="46" height="145" rx="4" fill="#5F754E" />
                  <rect x="295" y="130" width="38" height="130" rx="3" fill="#758B64" />
                </g>

                {/* Green canopy trees layer matching reference */}
                <g>
                  {/* Tree cluster left */}
                  <ellipse cx="60" cy="235" rx="30" ry="24" fill="#445726" />
                  <ellipse cx="90" cy="225" rx="26" ry="22" fill="#5A7135" />
                  <ellipse cx="120" cy="238" rx="22" ry="18" fill="#3E4F23" />
                  {/* Tree trunks */}
                  <rect x="58" y="235" width="4" height="25" fill="#2E3919" />
                  <rect x="88" y="225" width="4" height="35" fill="#2E3919" />
                  <rect x="118" y="238" width="4" height="22" fill="#2E3919" />

                  {/* Tree cluster center */}
                  <ellipse cx="160" cy="245" rx="24" ry="20" fill="#50672E" />
                  <ellipse cx="230" cy="240" rx="28" ry="22" fill="#445726" />
                  <ellipse cx="270" cy="232" rx="32" ry="24" fill="#5A7135" />
                  <rect x="228" y="240" width="4" height="20" fill="#2E3919" />
                  <rect x="268" y="232" width="4" height="28" fill="#2E3919" />

                  {/* Tree cluster right */}
                  <ellipse cx="320" cy="238" rx="26" ry="20" fill="#3E4F23" />
                  <ellipse cx="360" cy="230" rx="30" ry="24" fill="#50672E" />
                  <ellipse cx="400" cy="242" rx="25" ry="18" fill="#5A7135" />
                  <ellipse cx="435" cy="248" rx="22" ry="16" fill="#445726" />
                  <rect x="358" y="230" width="4" height="30" fill="#2E3919" />
                  <rect x="398" y="242" width="4" height="18" fill="#2E3919" />
                </g>

                {/* Ground grass bank */}
                <rect x="0" y="258" width="500" height="22" fill="#3D4E22" />
              </svg>
            </div>
          </div>
        </div>

        {/* Below: Two Large Cards matching reference */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Our Mission */}
          <div className="bg-[#F8FAF4] border border-[#E0E9D5] rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-start gap-6 hover:border-[#CAD8BC] transition-all">
            <div className="w-16 h-16 rounded-full bg-[#E2EBD5] text-[#4D602B] flex items-center justify-center shrink-0 shadow-inner">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#182315] tracking-tight">
                Our Mission
              </h3>
              <p className="text-sm sm:text-base text-[#576650] mt-3 leading-relaxed">
                Enable faster and more effective civic response through AI and
                collaboration.
              </p>
            </div>
          </div>

          {/* Card 2: Our Vision */}
          <div className="bg-[#F8FAF4] border border-[#E0E9D5] rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-start gap-6 hover:border-[#CAD8BC] transition-all">
            <div className="w-16 h-16 rounded-full bg-[#E2EBD5] text-[#4D602B] flex items-center justify-center shrink-0 shadow-inner">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#182315] tracking-tight">
                Our Vision
              </h3>
              <p className="text-sm sm:text-base text-[#576650] mt-3 leading-relaxed">
                Cleaner, greener, and more livable cities for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
