import React from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { getReportById } from '../../services/reportsService';
import { ReportStatus } from '../../types/citizen';
import { CitizenStatusBadge } from './CitizenStatusBadge';

interface ReportDetailsPageProps {
  reportId: string;
}

const TIMELINE_STAGES: {
  status: ReportStatus;
  label: string;
  description: string;
}[] = [
  {
    status: 'Reported',
    label: 'Reported',
    description: 'Report submitted successfully by citizen.',
  },
  {
    status: 'AI Analysis',
    label: 'AI Analysis',
    description: 'Issue classified, categorized, and severity determined.',
  },
  {
    status: 'Officer Review',
    label: 'Officer Review',
    description: 'Jurisdiction verified and awaiting ward officer dispatch.',
  },
  {
    status: 'Team Assigned',
    label: 'Team Assigned',
    description: 'Field response team and municipal resources allocated.',
  },
  {
    status: 'In Progress',
    label: 'In Progress',
    description: 'Field crew deployed on-site; work is underway.',
  },
  {
    status: 'Resolved',
    label: 'Resolved',
    description: 'Issue has been addressed and verified with closure notes.',
  },
];

export const ReportDetailsPage: React.FC<ReportDetailsPageProps> = ({ reportId }) => {
  const { navigate } = useRouter();
  const report = getReportById(reportId);

  if (!report) {
    return (
      <div className="w-full bg-[#FAF8F5] min-h-[calc(100vh-160px)] py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-[#182315]">Report Not Found</h2>
          <p className="text-sm text-[#697962] mt-2">
            Could not find report with ID <span className="font-mono">{reportId}</span>.
          </p>
          <button
            type="button"
            onClick={() => navigate('/citizen/reports')}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#435322] text-white text-xs font-semibold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Reports</span>
          </button>
        </div>
      </div>
    );
  }

  const currentStageIndex = TIMELINE_STAGES.findIndex((s) => s.status === report.status);
  const effectiveStageIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-[calc(100vh-160px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Back link */}
        <button
          id="report-details-back-btn"
          type="button"
          onClick={() => navigate('/citizen/reports')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#687862] hover:text-[#182315] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports</span>
        </button>

        {/* Page Header */}
        <div className="pb-6 border-b border-[#E4ECD8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-[#4D602B] bg-[#EBF2E2] px-2.5 py-0.5 rounded-md">
                {report.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F2F5ED] text-[#4A5B3E]">
                {report.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#182315] tracking-tight">
              {report.title}
            </h1>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <CitizenStatusBadge status={report.status} size="md" />
          </div>
        </div>

        {/* Timeline Section: REPORT STATUS */}
        <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 border border-[#E4ECD8] shadow-xs">
          <span className="text-xs font-bold tracking-[0.2em] text-[#697962] uppercase block mb-1">
            STATUS TRACKING
          </span>
          <h2 className="text-lg font-bold text-[#182315] mb-6">
            Report Resolution Progress
          </h2>

          <div className="relative pl-6 sm:pl-8 space-y-6">
            {/* Connecting Vertical Line */}
            <div className="absolute left-[15px] sm:left-[19px] top-3 bottom-3 w-[2px] bg-[#E2EADA]" />

            {TIMELINE_STAGES.map((stage, index) => {
              const isCompleted = index < effectiveStageIndex;
              const isCurrent = index === effectiveStageIndex;
              const isFuture = index > effectiveStageIndex;

              return (
                <div key={stage.status} className="relative flex items-start gap-4 group">
                  {/* Indicator Dot */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                      isCompleted
                        ? 'bg-[#4D602B] border-[#4D602B] text-white shadow-2xs'
                        : isCurrent
                        ? 'bg-[#435322] border-[#2A3715] text-white ring-4 ring-[#E4ECD8]'
                        : 'bg-white border-[#D6E0CD] text-[#A0B09A]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Stage Details */}
                  <div
                    className={`flex-1 p-3.5 rounded-xl transition-colors ${
                      isCurrent
                        ? 'bg-[#F4F7EE] border border-[#DCE5D2]'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          isCurrent
                            ? 'text-[#2D3C19]'
                            : isCompleted
                            ? 'text-[#182315]'
                            : 'text-[#879680]'
                        }`}
                      >
                        {stage.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold text-[#4D602B] tracking-wider bg-[#E5EDDA] px-2 py-0.5 rounded">
                          Current Stage
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        isCurrent
                          ? 'text-[#48593F]'
                          : isCompleted
                          ? 'text-[#5F7057]'
                          : 'text-[#9AA894]'
                      }`}
                    >
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complaint Details Container */}
        <div className="mt-6 bg-white rounded-2xl p-6 sm:p-8 border border-[#E4ECD8] shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#182315] pb-2 border-b border-[#F0F4EC]">
            Submitted Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#697A62] block mb-1">
                Location
              </span>
              <div className="flex items-start gap-2 text-sm text-[#182315]">
                <MapPin className="w-4 h-4 text-[#4D602B] shrink-0 mt-0.5" />
                <span>{report.location.address}</span>
              </div>
              {report.location.latitude && report.location.longitude && (
                <span className="text-[11px] font-mono text-[#788871] block mt-1 pl-6">
                  Coordinates: {report.location.latitude}° N, {report.location.longitude}° E
                </span>
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#697A62] block mb-1">
                Submission Date
              </span>
              <div className="flex items-center gap-2 text-sm text-[#182315]">
                <Calendar className="w-4 h-4 text-[#4D602B] shrink-0" />
                <span>{formatDate(report.createdAt)}</span>
              </div>
              <span className="text-[11px] text-[#788871] block mt-1 pl-6">
                Last status sync: {formatDate(report.updatedAt)}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#697A62] block mb-1.5">
              Description
            </span>
            <p className="text-sm text-[#3E4E37] leading-relaxed bg-[#FAFBF8] p-4 rounded-xl border border-[#EDF2E6]">
              {report.description}
            </p>
          </div>

          {/* AI classification analysis pill */}
          {report.aiSummary && (
            <div className="p-4 rounded-xl bg-[#F6F9F2] border border-[#D9E3CE] space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4D602B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                CivicFlow AI Triage Summary
              </span>
              <p className="text-xs text-[#4F5E48]">
                {report.aiSummary}
              </p>
              {report.severity && (
                <span className="inline-block text-[10px] font-semibold text-[#3D4E22] bg-white px-2 py-0.5 rounded border border-[#D9E3CE] mt-1">
                  Severity SLA: {report.severity}
                </span>
              )}
            </div>
          )}

          {/* Evidence Media */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#697A62] block mb-2">
              Attached Evidence ({report.media.length})
            </span>
            {report.media.length === 0 ? (
              <p className="text-xs text-[#82927C] italic">No photos or videos attached.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {report.media.map((item) => (
                  <div
                    key={item.id}
                    className="relative rounded-xl border border-[#DCE5D2] overflow-hidden bg-[#F8FAF4] aspect-square group"
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900/80 text-white">
                        <FileText className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs text-white p-1.5 text-[10px] truncate">
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
