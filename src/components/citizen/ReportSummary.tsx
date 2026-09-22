import React from 'react';
import { CivicReport } from '../../types/report';

interface ReportSummaryProps {
  reports: CivicReport[];
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({ reports }) => {
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;
  const activeCount = reports.filter((r) => r.status !== 'Resolved').length;
  const totalCount = reports.length;

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-6">
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E4ECD8] shadow-xs">
        <span className="text-2xl sm:text-3xl font-bold text-[#182315] block">
          {activeCount}
        </span>
        <span className="text-xs sm:text-sm font-medium text-[#55654E] mt-1 block">
          Active Reports
        </span>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E4ECD8] shadow-xs">
        <span className="text-2xl sm:text-3xl font-bold text-[#3B4D22] block">
          {resolvedCount}
        </span>
        <span className="text-xs sm:text-sm font-medium text-[#55654E] mt-1 block">
          Resolved
        </span>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E4ECD8] shadow-xs">
        <span className="text-2xl sm:text-3xl font-bold text-[#182315] block">
          {totalCount}
        </span>
        <span className="text-xs sm:text-sm font-medium text-[#55654E] mt-1 block">
          Total Reports
        </span>
      </div>
    </div>
  );
};
