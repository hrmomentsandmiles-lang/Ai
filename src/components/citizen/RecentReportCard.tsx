import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { CivicReport } from '../../types/report';
import { StatusBadge } from './StatusBadge';
import { useRouter } from '../../context/RouterContext';

interface RecentReportCardProps {
  report: CivicReport;
}

export const RecentReportCard: React.FC<RecentReportCardProps> = ({ report }) => {
  const { navigate } = useRouter();

  const formattedDate = new Date(report.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      onClick={() => navigate(`/citizen/reports/${report.id}`)}
      className="bg-white rounded-2xl p-5 border border-[#E4ECD8] shadow-xs hover:border-[#CAD8BC] hover:shadow-sm transition-all duration-200 cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] font-semibold text-[#66775E] bg-[#F2F6ED] px-2 py-0.5 rounded-md border border-[#E1E9DA]">
            {report.id}
          </span>
          <span className="text-[11px] font-medium text-[#4D602B] bg-[#F0F5E9] px-2 py-0.5 rounded-md">
            {report.category}
          </span>
          <StatusBadge status={report.status} size="sm" />
        </div>

        <h4 className="text-sm sm:text-base font-bold text-[#182315] group-hover:text-[#435322] transition-colors truncate">
          {report.title}
        </h4>

        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#63745C]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#86967F]" />
            <span className="truncate max-w-[220px] sm:max-w-xs">{report.location.address}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#86967F]" />
            <span>{formattedDate}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs font-semibold text-[#435322] group-hover:translate-x-0.5 transition-transform self-end sm:self-center shrink-0">
        <span>Details</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
