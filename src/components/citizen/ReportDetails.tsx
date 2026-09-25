import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Film } from 'lucide-react';
import { useReports } from '../../context/ReportsContext';
import { useRouter } from '../../context/RouterContext';
import { StatusBadge } from './StatusBadge';
import { ReportTimeline } from './ReportTimeline';
import { getIncident } from '../../services/incidentApi';

interface ReportDetailsProps {
  reportId: string;
}

export const ReportDetails: React.FC<ReportDetailsProps> = ({ reportId }) => {
  const { navigate } = useRouter();
  const [report, setReport] = useState<ReturnType<typeof getIncident> extends Promise<infer T> ? T | null : null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setReport(null);
    setLoadError(null);
    void getIncident(reportId)
      .then((incident) => {
        if (active) setReport(incident);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Unable to load this report.');
      });
    return () => {
      active = false;
    };
  }, [reportId]);

  if (!report && !loadError) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-sm text-[#63745C]">Loading report...</div>;
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-3xl p-10 border border-[#E4ECD8]">
          <h2 className="text-xl font-bold text-[#182315]">Report Not Found</h2>
          <p className="text-xs text-[#63745C] mt-2">
            {loadError || `We couldn't locate any record matching ID: ${reportId}`}
          </p>
          <button
            type="button"
            onClick={() => navigate('/citizen/reports')}
            className="mt-4 px-4 py-2 bg-[#435322] text-white text-xs font-semibold rounded-xl"
          >
            Back to My Reports
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(report.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Back button & ID */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/citizen/reports')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#55644F] hover:text-[#182315] p-1.5 rounded-lg hover:bg-[#F2F5ED] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-[#576850] bg-[#F1F5EB] px-2.5 py-1 rounded-md border border-[#DEE6D5]">
            {report.id}
          </span>
          <StatusBadge status={report.status} />
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Report Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4ECD8] shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#697962] block mb-2">
                REPORT DETAILS
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#182315] tracking-tight">
                {report.title}
              </h1>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#EEF2E6]">
              <span className="text-xs font-semibold text-[#435322] bg-[#F0F5E9] px-2.5 py-1 rounded-lg border border-[#D8E4CB]">
                {report.category}
              </span>
              {report.severity && (
                <span className="text-xs font-medium text-[#4F6030] bg-[#F4F7EE] px-2.5 py-1 rounded-lg border border-[#DEE6D5]">
                  Severity: {report.severity}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#71826B] mb-1.5">
                Description
              </h4>
              <p className="text-sm text-[#3E4D38] leading-relaxed whitespace-pre-line bg-[#FAFBF8] p-4 rounded-xl border border-[#E5EBDD]">
                {report.description}
              </p>
            </div>

            {/* AI Summary note if available */}
            {report.aiSummary && (
              <div className="p-3.5 rounded-xl bg-[#F4F8EE] border border-[#D5E2C7] text-xs">
                <span className="font-bold text-[#435322] block mb-0.5">
                  AI Assessment Summary:
                </span>
                <span className="text-[#55664F]">{report.aiSummary}</span>
              </div>
            )}

            {/* Location & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EEF2E6]">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#71826B] block">
                  Location
                </span>
                <div className="flex items-start gap-1.5 text-xs text-[#2E3C27]">
                  <MapPin className="w-3.5 h-3.5 text-[#6D7E65] mt-0.5 shrink-0" />
                  <span className="leading-snug">{report.location.address}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#71826B] block">
                  Submitted Date
                </span>
                <div className="flex items-center gap-1.5 text-xs text-[#2E3C27]">
                  <Calendar className="w-3.5 h-3.5 text-[#6D7E65] shrink-0" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Evidence Section */}
            <div className="pt-2 border-t border-[#EEF2E6]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#71826B] mb-3">
                Evidence ({report.media?.length || 0})
              </h4>

              {report.media && report.media.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {report.media.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[#DCE5D1] overflow-hidden bg-[#FAFBF8] group"
                    >
                      <div className="h-28 bg-[#F0F4EC] flex items-center justify-center overflow-hidden">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-[#4A5D2E]">
                            <Film className="w-8 h-8" />
                            <span className="text-[10px] font-medium mt-1">Video</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-[11px] text-[#55654E] truncate" title={item.name}>
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#7B8B75] italic">
                  No photographic or video evidence was attached to this report.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Status Timeline */}
        <div className="lg:col-span-5">
          <ReportTimeline currentStatus={report.status} />
        </div>
      </div>
    </div>
  );
};
