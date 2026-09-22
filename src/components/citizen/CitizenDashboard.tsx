import React from 'react';
import { Camera, Activity, FileText, ArrowRight, MapPin, Calendar, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { getReports } from '../../services/reportsService';
import { CitizenStatusBadge } from './CitizenStatusBadge';

export const CitizenDashboard: React.FC = () => {
  const { session } = useAuth();
  const { navigate } = useRouter();
  const reports = getReports();

  const citizenName = session?.displayName || 'Ashar';
  const recentReports = reports.slice(0, 3);

  const activeReportsCount = reports.filter((r) => r.status !== 'Resolved').length;
  const resolvedReportsCount = reports.filter((r) => r.status === 'Resolved').length;
  const totalReportsCount = reports.length;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Welcome Section */}
        <div className="pb-8 border-b border-[#E4ECD8]">
          <span className="text-xs font-bold tracking-[0.2em] text-[#697962] uppercase block mb-2">
            CITIZEN DASHBOARD
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#182315] tracking-tight">
                Welcome, {citizenName}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#55644F]">
                Report civic problems, track your complaints, and stay updated.
              </p>
            </div>
            <button
              id="dashboard-quick-report-btn"
              type="button"
              onClick={() => navigate('/citizen/report')}
              className="inline-flex items-center gap-2 self-start sm:self-center px-5 py-2.5 bg-[#435322] hover:bg-[#35431A] text-white font-medium text-sm rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Report</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <span className="text-xs font-bold tracking-[0.18em] text-[#697962] uppercase block mb-4">
            QUICK ACTIONS
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div
              id="action-card-report"
              onClick={() => navigate('/citizen/report')}
              className="group cursor-pointer bg-white rounded-2xl p-6 border border-[#E4ECD8] hover:border-[#CAD8BC] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F2F6ED] text-[#4D602B] group-hover:bg-[#4D602B] group-hover:text-white flex items-center justify-center transition-colors mb-4">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#182315]">Report Issue</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#55644F] leading-relaxed">
                  Report a civic problem with details, location, and evidence.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs sm:text-sm font-semibold text-[#4D602B] group-hover:text-[#38491E]">
                <span>Report Issue</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 2 */}
            <div
              id="action-card-track"
              onClick={() => navigate('/citizen/reports')}
              className="group cursor-pointer bg-white rounded-2xl p-6 border border-[#E4ECD8] hover:border-[#CAD8BC] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F2F6ED] text-[#4D602B] group-hover:bg-[#4D602B] group-hover:text-white flex items-center justify-center transition-colors mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#182315]">Track Status</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#55644F] leading-relaxed">
                  Follow the progress of your submitted reports in real-time.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs sm:text-sm font-semibold text-[#4D602B] group-hover:text-[#38491E]">
                <span>Track Reports</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 3 */}
            <div
              id="action-card-history"
              onClick={() => navigate('/citizen/reports')}
              className="group cursor-pointer bg-white rounded-2xl p-6 border border-[#E4ECD8] hover:border-[#CAD8BC] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F2F6ED] text-[#4D602B] group-hover:bg-[#4D602B] group-hover:text-white flex items-center justify-center transition-colors mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#182315]">My Reports</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#55644F] leading-relaxed">
                  View your submitted complaints and their resolution history.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs sm:text-sm font-semibold text-[#4D602B] group-hover:text-[#38491E]">
                <span>View Reports</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold tracking-[0.18em] text-[#697962] uppercase block">
                RECENT REPORTS
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#182315] mt-1">
                Your Recent Reports
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/citizen/reports')}
              className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#4D602B] hover:text-[#35431A] transition-colors"
            >
              <span>View All Reports</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {recentReports.length === 0 ? (
              <div className="bg-white border border-[#E4ECD8] rounded-2xl p-8 text-center text-[#697962]">
                <p className="text-sm">No reports submitted yet.</p>
                <button
                  type="button"
                  onClick={() => navigate('/citizen/report')}
                  className="mt-3 text-xs text-[#4D602B] font-semibold underline"
                >
                  Create your first report
                </button>
              </div>
            ) : (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  id={`recent-report-${report.id}`}
                  onClick={() => navigate(`/citizen/reports/${report.id}`)}
                  className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-[#E4ECD8] hover:border-[#CAD8BC] shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F2F5ED] text-[#4A5B3E]">
                        {report.category}
                      </span>
                      <span className="text-xs font-mono text-[#768470]">
                        {report.id}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#182315] group-hover:text-[#4D602B] transition-colors">
                      {report.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#697A62]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#889880]" />
                        <span>{report.location.address}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#889880]" />
                        <span>{formatDate(report.createdAt)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0F4EC]">
                    <CitizenStatusBadge status={report.status} />
                    <ArrowRight className="w-4 h-4 text-[#8C9C84] group-hover:text-[#4D602B] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Report Summary (Compact Stats, strictly no heavy charts) */}
        <div className="mt-12 pt-8 border-t border-[#E4ECD8]">
          <span className="text-xs font-bold tracking-[0.18em] text-[#697962] uppercase block mb-4">
            REPORT SUMMARY
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#E4ECD8]">
              <div className="text-2xl sm:text-3xl font-bold text-[#182315]">
                {activeReportsCount}
              </div>
              <div className="text-xs text-[#697962] mt-1 font-medium">
                Active Reports
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E4ECD8]">
              <div className="text-2xl sm:text-3xl font-bold text-[#4D602B]">
                {resolvedReportsCount}
              </div>
              <div className="text-xs text-[#697962] mt-1 font-medium">
                Resolved
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E4ECD8]">
              <div className="text-2xl sm:text-3xl font-bold text-[#182315]">
                {totalReportsCount}
              </div>
              <div className="text-xs text-[#697962] mt-1 font-medium">
                Total Reports
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
