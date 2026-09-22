import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useReports } from '../../context/ReportsContext';
import { useRouter } from '../../context/RouterContext';
import { RecentReportCard } from './RecentReportCard';

type FilterTab = 'All' | 'Active' | 'Resolved';

export const MyReports: React.FC = () => {
  const { reports } = useReports();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter((r) => {
    // Status filter
    if (activeTab === 'Active' && r.status === 'Resolved') return false;
    if (activeTab === 'Resolved' && r.status !== 'Resolved') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.location.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = reports.filter((r) => r.status !== 'Resolved').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEF2E6] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#697962] block mb-1">
            CIVIC TRACKING
          </span>
          <h1 className="text-3xl font-bold text-[#182315] tracking-tight">
            My Reports
          </h1>
          <p className="mt-1.5 text-sm text-[#55644F]">
            Track the civic problems you have reported.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/citizen/report')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#435322] hover:bg-[#35431A] text-white font-medium text-xs sm:text-sm rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Report</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5EB] rounded-xl border border-[#DCE5D1] self-start">
          <button
            type="button"
            onClick={() => setActiveTab('All')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'All'
                ? 'bg-white text-[#182315] shadow-2xs'
                : 'text-[#586A51] hover:text-[#182315]'
            }`}
          >
            All ({reports.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'Active'
                ? 'bg-white text-[#182315] shadow-2xs'
                : 'text-[#586A51] hover:text-[#182315]'
            }`}
          >
            Active ({activeCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('Resolved')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'Resolved'
                ? 'bg-white text-[#182315] shadow-2xs'
                : 'text-[#586A51] hover:text-[#182315]'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#83947D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports or ID..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white border border-[#DCE4D3] text-[#182315] placeholder-[#90A288] focus:outline-none focus:ring-1 focus:ring-[#4D602B]"
          />
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <RecentReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 border border-[#E4ECD8] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F0F5E9] text-[#435322] flex items-center justify-center mx-auto">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#182315]">
            No reports found
          </h3>
          <p className="text-xs text-[#63745C] max-w-sm mx-auto">
            {searchQuery
              ? `No matching records found for "${searchQuery}". Try clearing search keywords.`
              : `There are no ${activeTab.toLowerCase()} reports at this time.`}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-[#435322] hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};
