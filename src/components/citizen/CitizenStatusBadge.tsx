import React from 'react';
import { ReportStatus } from '../../types/citizen';

interface CitizenStatusBadgeProps {
  status: ReportStatus | string;
  size?: 'sm' | 'md';
}

export const CitizenStatusBadge: React.FC<CitizenStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStyles = () => {
    switch (status) {
      case 'Reported':
        return {
          container: 'bg-[#F2F5ED] text-[#55644F] border-[#DCE4D1]',
          dot: 'bg-[#7B8B74]',
        };
      case 'AI Analysis':
        return {
          container: 'bg-[#EAF0E2] text-[#425427] border-[#CFDCBF]',
          dot: 'bg-[#5F753C]',
        };
      case 'Officer Review':
        return {
          container: 'bg-[#FAF4E8] text-[#7A5B27] border-[#EAE1CF]',
          dot: 'bg-[#B0863C]',
        };
      case 'Team Assigned':
        return {
          container: 'bg-[#E7EEDB] text-[#3B4D20] border-[#CAD8B9]',
          dot: 'bg-[#4D602B]',
        };
      case 'In Progress':
        return {
          container: 'bg-[#DEE7D0] text-[#304018] border-[#BDCCAA]',
          dot: 'bg-[#3E5221]',
        };
      case 'Resolved':
        return {
          container: 'bg-[#E5EFE2] text-[#28582C] border-[#C6DEBE]',
          dot: 'bg-[#3D7C43]',
        };
      default:
        return {
          container: 'bg-[#F2F5ED] text-[#55644F] border-[#DCE4D1]',
          dot: 'bg-[#7B8B74]',
        };
    }
  };

  const { container, dot } = getStyles();
  const paddingClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${container} ${paddingClass} tracking-wide whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{status}</span>
    </span>
  );
};
