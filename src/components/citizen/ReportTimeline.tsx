import React from 'react';
import { Check, Clock, Circle } from 'lucide-react';
import { ReportStatus } from '../../types/report';
import { TIMELINE_STAGES } from '../../services/reportService';

interface ReportTimelineProps {
  currentStatus: ReportStatus;
}

export const ReportTimeline: React.FC<ReportTimelineProps> = ({
  currentStatus,
}) => {
  const currentIndex = TIMELINE_STAGES.indexOf(currentStatus);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E4ECD8] shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#687961] mb-6">
        REPORT STATUS
      </h3>

      <div className="relative">
        <div className="space-y-6 sm:space-y-8">
          {TIMELINE_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isFuture = idx > currentIndex;

            return (
              <div key={stage} className="relative flex items-start gap-4 sm:gap-6">
                {/* Vertical connecting line */}
                {idx < TIMELINE_STAGES.length - 1 && (
                  <div
                    className={`absolute left-[15px] top-[30px] bottom-[-24px] w-[2px] transition-colors ${
                      isCompleted ? 'bg-[#4D602B]' : 'bg-[#E2EAD8]'
                    }`}
                  />
                )}

                {/* Status indicator node */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                    isCompleted
                      ? 'bg-[#435322] text-white ring-4 ring-[#EFF4E7]'
                      : isCurrent
                      ? 'bg-[#435322] text-white ring-4 ring-[#D8E6C8]'
                      : 'bg-[#F2F5ED] text-[#94A3B8] border border-[#D5DFC9]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Circle className="w-2.5 h-2.5" />
                  )}
                </div>

                {/* Stage information */}
                <div
                  className={`flex-1 rounded-xl p-3 transition-all ${
                    isCurrent
                      ? 'bg-[#F3F7ED] border border-[#D5E2C7]'
                      : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-bold tracking-tight ${
                        isCompleted
                          ? 'text-[#2D3B17]'
                          : isCurrent
                          ? 'text-[#182315]'
                          : 'text-[#8A9B82]'
                      }`}
                    >
                      {stage}
                    </h4>

                    {isCurrent && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#3F5222] bg-[#E2ECCF] px-2 py-0.5 rounded">
                        Current Stage
                      </span>
                    )}

                    {isCompleted && (
                      <span className="text-[11px] font-medium text-[#50632E]">
                        Completed
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      isCurrent
                        ? 'text-[#4A5D33]'
                        : isCompleted
                        ? 'text-[#627359]'
                        : 'text-[#9AA894]'
                    }`}
                  >
                    {getStageDescription(stage)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function getStageDescription(stage: ReportStatus): string {
  switch (stage) {
    case 'Reported':
      return 'Report received and securely logged with unique tracking identifier.';
    case 'AI Analysis':
      return 'AI categorizes issue scope, checks duplicate reports, and estimates priority.';
    case 'Officer Review':
      return 'Field supervisor validates evidence and confirms jurisdiction.';
    case 'Team Assigned':
      return 'Specialized municipal crew dispatched to location with repair instructions.';
    case 'In Progress':
      return 'Field personnel actively working on resolving the irregularity on-site.';
    case 'Resolved':
      return 'Issue rectified with photographic verification and inspection sign-off.';
    default:
      return '';
  }
}
