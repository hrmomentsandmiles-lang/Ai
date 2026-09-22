import React from 'react';
import { ReportStatus } from '../../types/report';

interface StatusBadgeProps {
  status: ReportStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const getStyles = () => {
    switch (status) {
      case 'Resolved':
        return 'bg-[#E3EDD5] text-[#2D3E15] border-[#BDCEAA]';
      case 'In Progress':
        return 'bg-[#EBF2E2] text-[#36491E] border-[#CFDEBE]';
      case 'Team Assigned':
        return 'bg-[#EEF4E5] text-[#3E5222] border-[#D3DEC5]';
      case 'Officer Review':
        return 'bg-[#F2F6EC] text-[#4A5D2E] border-[#D8E3CC]';
      case 'AI Analysis':
        return 'bg-[#F6F8F2] text-[#4D602B] border-[#DEE6D5]';
      case 'Reported':
      default:
        return 'bg-white text-[#55644F] border-[#E1E8D9]';
    }
  };

  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border ${getStyles()} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{status}</span>
    </span>
  );
};
