import React from 'react';
import { FilePlus, Clock, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportsContext';
import { useRouter } from '../../context/RouterContext';
import { QuickActionCard } from './QuickActionCard';
import { ReportSummary } from './ReportSummary';
import { RecentReportCard } from './RecentReportCard';

export const CitizenDashboard: React.FC = () => {
  const { session } = useAuth();
  const { reports } = useReports();
  const { navigate } = useRouter();

  const citizenName = session?.displayName || 'Resident';
  const recentReports = reports.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Welcome Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#697962] block mb-2">
          CITIZEN DASHBOARD
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#182315] tracking-tight">
          Welcome, {citizenName}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#55644F] font-normal leading-relaxed max-w-xl">
          Report civic problems, track your complaints, and stay updated.
        </p>
      </div>

      {/* Report Summary */}
      <ReportSummary reports={reports} />

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#687860]">
            QUICK ACTIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <QuickActionCard
            icon={FilePlus}
            title="Report Issue"
            description="Report a civic problem with details, location, and evidence."
            actionText="Report Issue"
            route="/citizen/report"
          />

          <QuickActionCard
            icon={Clock}
            title="Track Status"
            description="Follow the progress of your submitted reports."
            actionText="Track Reports"
            route="/citizen/reports"
          />

          <QuickActionCard
            icon={FileText}
            title="My Reports"
            description="View your submitted complaints and their history."
            actionText="View Reports"
            route="/citizen/reports"
          />
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#687860] block">
              RECENT REPORTS
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#182315] tracking-tight mt-0.5">
              Your Recent Reports
            </h2>
          </div>

          {reports.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/citizen/reports')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#435322] hover:text-[#324016] transition-colors"
            >
              <span>View All ({reports.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentReports.length > 0 ? (
          <div className="space-y-3">
            {recentReports.map((report) => (
              <RecentReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-[#E4ECD8] text-center">
            <p className="text-sm text-[#63745C]">
              No reports submitted yet. Have you noticed a civic issue?
            </p>
            <button
              type="button"
              onClick={() => navigate('/citizen/report')}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#435322] text-white text-xs font-medium rounded-xl hover:bg-[#35431A] transition-colors"
            >
              <span>Report First Issue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
