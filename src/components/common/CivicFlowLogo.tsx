import React from 'react';

interface CivicFlowLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CivicFlowLogo: React.FC<CivicFlowLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const taglineSizes = {
    sm: 'text-[9px] tracking-[0.16em]',
    md: 'text-[10px] tracking-[0.18em]',
    lg: 'text-[11px] tracking-[0.2em]',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Leaves Emblem */}
      <svg
        className={`${iconSizes[size]} shrink-0`}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left leaf */}
        <path
          d="M8.5 24.5C6.5 19 9.5 13 15 11C15 16.5 12.5 22.5 8.5 24.5Z"
          fill="#4D602B"
        />
        {/* Top-right leaf */}
        <path
          d="M17 10C22.5 7.5 28 10 30 15C25 15.5 19 13.5 17 10Z"
          fill="#5D7533"
        />
        {/* Main center leaf */}
        <path
          d="M14 27C14 19 21 13 28 12C28 20 22 26 14 27Z"
          fill="#435322"
        />
        {/* Small bottom stem/accent */}
        <path
          d="M14 27C12 28.5 9 29.5 7 29.5"
          stroke="#435322"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex flex-col leading-none">
        <div className={`font-bold tracking-tight text-[#182315] flex items-center ${textSizes[size]}`}>
          <span>CivicFlow</span>
          <span className="text-[#4D602B] ml-1 relative">
            AI
            {/* Small leaf on AI */}
            <svg
              className="absolute -top-1.5 -right-2.5 w-3 h-3 text-[#556D2F]"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M4 14C4 9.5 8.5 5 13 4C13 8.5 8.5 13 4 14Z" />
            </svg>
          </span>
        </div>

        {showTagline && (
          <span className={`text-[#6A7863] font-semibold uppercase mt-1 ${taglineSizes[size]}`}>
            PEOPLE · CITIES · BETTER TOMORROW
          </span>
        )}
      </div>
    </div>
  );
};
