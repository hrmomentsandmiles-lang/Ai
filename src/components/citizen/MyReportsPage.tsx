import React, { useState } from 'react';
import { Plus, MapPin, Calendar, ArrowRight, Search } from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { getReports } from '../../services/reportsService';
import { CitizenStatusBadge } from './CitizenStatusBadge';

type FilterType = 'All' | 'Active' | 'Resolved';

export const MyReportsPage: React.FC = () => {
  const { navigate } = useRouter();
  const reports = getReports();
  const [filter, setFilter] = useState<FilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter((r) => {
    // Filter status
    if (filter === 'Active' && r.status === 'Resolved') return false;
    if (filter === 'Resolved' && r.status !== 'Resolved') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.location.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
        {/* Header */}
        <div className="pb-8 border-b border-[#E4ECD8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#697962] uppercase block mb-2">
              TRACK & RESOLVE
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#182315] tracking-tight">
              My Reports
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#55644F]">
              Track the civic problems you have reported.
            </p>
          </div>

          <button
            id="my-reports-new-issue-btn"
            type="button"
            onClick={() => navigate('/citizen/report')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#435322] hover:bg-[#35431A] text-white font-medium text-sm rounded-xl transition-all shadow-xs self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Filter Pills */}
          <div className="inline-flex p-1 rounded-xl bg-white border border-[#E4ECD8] self-start">
            {(['All', 'Active', 'Resolved'] as FilterType[]).map((tab) => {
              const active = filter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#435322] text-white shadow-2xs'
                      : 'text-[#5E6D58] hover:text-[#182315]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7E8F77]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-white rounded-xl border border-[#E4ECD8] text-xs text-[#182315] placeholder:text-[#9AA695] focus:outline-none focus:ring-2 focus:ring-[#4D602B] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Reports List */}
        <div className="mt-6 space-y-3">
          {filteredReports.length === 0 ? (
            <div className="bg-white border border-[#E4ECD8] rounded-2xl p-12 text-center text-[#697962]">
              <p className="text-sm font-medium">No reports found matching your criteria.</p>
              {filter !== 'All' || searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setFilter('All');
                    setSearchQuery('');
                  }}
                  className="mt-3 text-xs text-[#4D602B] font-semibold underline"
                >
                  Clear filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/citizen/report')}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#4D602B] font-semibold underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Report an issue now</span>
                </button>
              )}
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                id={`report-item-${report.id}`}
                onClick={() => navigate(`/citizen/reports/${report.id}`)}
                className="group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-[#E4ECD8] hover:border-[#CAD8BC] shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#F2F5ED] text-[#4A5B3E]">
                      {report.category}
                    </span>
                    <span className="text-xs font-mono text-[#768470]">
                      {report.id}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#182315] group-hover:text-[#4D602B] transition-colors">
                    {report.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C6D56] line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#697A62] pt-1">
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

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F0F4EC]">
                  <CitizenStatusBadge status={report.status} />
                  <div className="w-8 h-8 rounded-full bg-[#F4F7EE] group-hover:bg-[#4D602B] text-[#4D602B] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
