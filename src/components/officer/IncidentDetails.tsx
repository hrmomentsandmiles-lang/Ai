import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  AlertTriangle,
  ArrowRight,
  Activity,
  Image as ImageIcon,
} from 'lucide-react';
import { useReports } from '../../context/ReportsContext';
import { useRouter } from '../../context/RouterContext';

interface IncidentDetailsProps {
  incidentId: string;
}

export const IncidentDetails: React.FC<IncidentDetailsProps> = ({ incidentId }) => {
  const { getReport, approveIncident, rejectIncident } = useReports();
  const { navigate } = useRouter();

  const incident = getReport(incidentId);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  if (!incident) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl p-10 border border-[#E4ECD8] shadow-xs">
          <AlertTriangle className="w-10 h-10 text-[#7D8E74] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#182315]">Incident Not Found</h2>
          <p className="text-sm text-[#5C6E54] mt-1 mb-6">
            The requested incident tracking record could not be located.
          </p>
          <button
            type="button"
            onClick={() => navigate('/officer/dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4D602B] hover:bg-[#3C4D20] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const isApproved =
    incident.incidentState === 'APPROVED' || incident.status === 'Approved';
  const isRejected =
    incident.incidentState === 'REJECTED' || incident.status === 'Rejected';
  const isTeamAssigned =
    incident.incidentState === 'TEAM_ASSIGNED' ||
    incident.incidentState === 'TEAM_REACHED' ||
    incident.incidentState === 'WORK_STARTED' ||
    incident.incidentState === 'COMPLETED';

  const handleApprove = async () => {
    await approveIncident(incident.id);
    setActionSuccessMessage('Incident approved. Ready for response team assignment.');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleRejectConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    await rejectIncident(incident.id, rejectReason.trim());
    setRejectModalOpen(false);
    setActionSuccessMessage('Incident rejected.');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  // Severity styling in CivicFlow theme
  const getSeverityBadgeClass = (severity?: string) => {
    const s = severity?.toLowerCase();
    if (s === 'high' || s === 'critical') {
      return 'bg-[#F4F1E9] text-[#4A3D1C] border-[#D9CEB2]';
    }
    if (s === 'medium') {
      return 'bg-[#F1F6EC] text-[#34461B] border-[#CFDEBE]';
    }
    return 'bg-[#F2F6ED] text-[#47573B] border-[#D6E2CB]';
  };

  const affectedServicesList =
    incident.affectedServices && incident.affectedServices.length > 0
      ? incident.affectedServices
      : ['Road Department', 'Traffic', 'Drainage', 'MoveSmart'];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Breadcrumb / Back */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/officer/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#4D602B] hover:text-[#324218] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#4D602B] bg-[#F1F6EB] px-2.5 py-1 rounded-lg border border-[#D5E1CA]">
            {incident.id}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isRejected
                ? 'bg-[#F7F3EB] text-[#59461E] border-[#E3D7BD]'
                : isApproved || isTeamAssigned
                ? 'bg-[#EEF5E9] text-[#2C4118] border-[#CFDEBD]'
                : 'bg-[#FAF6EB] text-[#695521] border-[#E8DCC0]'
            }`}
          >
            {incident.status}
          </span>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 bg-[#EEF5E9] border border-[#CFDEBD] rounded-2xl flex items-center gap-3 text-xs font-semibold text-[#2C4118] animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#4D602B] shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* 10. Main Incident Information Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E4ECD8] shadow-xs space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6E8067] block mb-1">
            INCIDENT DETAILS
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#182315]">
            {incident.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#54654D] mt-2 leading-relaxed">
            {incident.description}
          </p>
        </div>

        {/* Key Information Grid */}
        <div className="pt-4 border-t border-[#EDF3E6] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7EFE0]">
            <span className="text-[10px] font-bold uppercase text-[#73846D] block mb-0.5">
              Category
            </span>
            <span className="text-xs font-bold text-[#182315]">{incident.category}</span>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7EFE0]">
            <span className="text-[10px] font-bold uppercase text-[#73846D] block mb-0.5">
              Severity
            </span>
            <span
              className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border ${getSeverityBadgeClass(
                incident.severity
              )}`}
            >
              {incident.severity || 'Medium'}
            </span>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7EFE0]">
            <span className="text-[10px] font-bold uppercase text-[#73846D] block mb-0.5">
              Reported Time
            </span>
            <span className="text-xs font-bold text-[#182315] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#798C72]" />
              <span>{new Date(incident.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            </span>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7EFE0]">
            <span className="text-[10px] font-bold uppercase text-[#73846D] block mb-0.5">
              Location
            </span>
            <span className="text-xs font-bold text-[#182315] truncate block" title={incident.location?.address}>
              {incident.location?.address || 'Municipal Zone'}
            </span>
          </div>
        </div>

        {/* 11. Evidence Section */}
        <div className="pt-6 border-t border-[#EDF3E6] space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#697B62]">
            Evidence
          </h2>

          {incident.media && incident.media.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {incident.media.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden border border-[#DDE7D3] bg-[#F7FAF4] aspect-video"
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[11px] text-white truncate">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#D6E1CD] text-center">
              <ImageIcon className="w-6 h-6 text-[#8B9D84] mx-auto mb-1.5" />
              <p className="text-xs text-[#6F8068] font-medium">No evidence uploaded</p>
            </div>
          )}
        </div>

        {/* 12. AI Classification Section */}
        <div className="pt-6 border-t border-[#EDF3E6] space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4D602B]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#182315]">
              AI Classification
            </h2>
          </div>

          <div className="bg-[#FAF8F3] rounded-2xl p-4 sm:p-5 border border-[#E3EDD6] space-y-3">
            <div className="grid grid-cols-3 gap-3 pb-3 border-b border-[#E3EDD6]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#687B61] block mb-0.5">
                  Issue Type
                </span>
                <span className="text-xs font-bold text-[#182315]">
                  {incident.category}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#687B61] block mb-0.5">
                  Severity
                </span>
                <span className="text-xs font-bold text-[#182315]">
                  {incident.severity || 'Medium'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#687B61] block mb-0.5">
                  Confidence
                </span>
                <span className="text-xs font-bold text-[#4D602B]">
                  {incident.confidence || 92}%
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#687B61] block mb-1">
                Summary
              </span>
              <p className="text-xs text-[#35452D] leading-relaxed">
                {incident.aiSummary || 'Automated municipal assessment identified structural disruption.'}
              </p>
            </div>
          </div>
        </div>

        {/* 14. Affected Services Section */}
        <div className="pt-6 border-t border-[#EDF3E6] space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#697B62]">
            Affected Services
          </h2>

          <div className="flex flex-wrap gap-2">
            {affectedServicesList.map((svc) => (
              <span
                key={svc}
                className="px-3 py-1.5 bg-[#FAF8F5] text-xs font-semibold text-[#182315] rounded-xl border border-[#DCE4D2] hover:border-[#CCDABF] transition-colors"
              >
                {svc}
              </span>
            ))}
          </div>
        </div>

        {/* 15 & 16. Officer Actions & Human Approval */}
        <div className="pt-6 border-t border-[#EDF3E6] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#182315] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4D602B]" />
              Officer Actions
            </h2>
            <span className="text-[11px] text-[#6E8067]">
              Human authorization required
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* If Already Assigned -> Provide Link to Monitoring */}
            {isTeamAssigned ? (
              <button
                type="button"
                onClick={() => navigate(`/officer/incidents/${incident.id}/monitor`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4D602B] hover:bg-[#3C4D20] text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
              >
                <Activity className="w-4 h-4" />
                <span>View Monitoring →</span>
              </button>
            ) : isApproved ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/officer/incidents/${incident.id}/assign`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4D602B] hover:bg-[#3C4D20] text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
                >
                  <Users className="w-4 h-4" />
                  <span>Assign Team →</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#F2EFE8] text-[#544626] text-xs font-semibold rounded-xl border border-[#DDD4BD] transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </>
            ) : isRejected ? (
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E5DBBF] text-xs text-[#524422]">
                <strong>Incident Rejected:</strong> {incident.rejectionReason || 'Declined by municipal officer review.'}
              </div>
            ) : (
              /* Pending state */
              <>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4D602B] hover:bg-[#3C4D20] text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/officer/incidents/${incident.id}/assign`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#F8FAF5] text-[#182315] text-xs font-bold rounded-xl border border-[#CAD8BE] transition-colors"
                >
                  <Users className="w-4 h-4 text-[#4D602B]" />
                  <span>Assign Team →</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRejectModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#F2EFE8] text-[#544626] text-xs font-semibold rounded-xl border border-[#DDD4BD] transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#DCE4D2] shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#182315]">
              Reject Incident {incident.id}
            </h3>
            <p className="text-xs text-[#5C6E54]">
              Provide a clear administrative reason for rejecting this report.
            </p>

            <form onSubmit={handleRejectConfirm} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#182315] block mb-1">
                  Rejection Reason
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Duplicate report, private property jurisdiction, or insufficient evidence."
                  required
                  className="w-full p-3 text-xs text-[#182315] bg-[#FAF8F5] border border-[#DCE4D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4D602B] focus:bg-white placeholder:text-[#9AA695]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#66785F] hover:text-[#182315] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#5C4D26] hover:bg-[#463B1C] rounded-xl transition-colors shadow-2xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
