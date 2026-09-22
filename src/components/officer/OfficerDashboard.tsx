import React, { useState, useMemo } from 'react';
import {
  Layers,
  Clock,
  Activity,
  CheckCircle2,
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  Filter,
  ShieldCheck,
} from 'lucide-react';
import { useReports } from '../../context/ReportsContext';
import { useRouter } from '../../context/RouterContext';
import { CivicReport } from '../../types/report';
import { IncidentMap } from './IncidentMap';

export const OfficerDashboard: React.FC = () => {
  const { reports } = useReports();
  const { navigate } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved'>('All');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Helper to categorize status into standard buckets
  const getStatusGroup = (report: CivicReport): 'Pending' | 'In Progress' | 'Resolved' => {
    const s = (report.incidentState || report.status || '').toUpperCase();
    if (s === 'COMPLETED' || s === 'RESOLVED') return 'Resolved';
    if (
      s === 'APPROVED' ||
      s === 'TEAM_ASSIGNED' ||
      s === 'TEAM_REACHED' ||
      s === 'WORK_STARTED' ||
      s === 'IN PROGRESS'
    ) {
      return 'In Progress';
    }
    return 'Pending';
  };

  // Metrics calculated directly from report data
  const metrics = useMemo(() => {
    let pending = 0;
    let inProgress = 0;
    let resolved = 0;

    reports.forEach((r) => {
      const group = getStatusGroup(r);
      if (group === 'Pending') pending++;
      else if (group === 'In Progress') inProgress++;
      else if (group === 'Resolved') resolved++;
    });

    return {
      total: reports.length,
      pending,
      inProgress,
      resolved,
    };
  }, [reports]);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.location?.address || '').toLowerCase().includes(searchQuery.toLowerCase());

      const group = getStatusGroup(report);
      const matchesFilter =
        statusFilter === 'All' || group === statusFilter;

      return matchesSearch && matchesFilter;
    });
  }, [reports, searchQuery, statusFilter]);

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* 5. Page Heading & Subtext */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.16em] uppercase text-[#4D602B] bg-[#EBF2E2] px-2.5 py-0.5 rounded-full border border-[#D5E1CA]">
              <ShieldCheck className="w-3.5 h-3.5" />
              MUNICIPAL FIELD DISPATCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182315] tracking-tight">
            Officer Dashboard
          </h1>
          <p className="text-sm text-[#5C6E54] mt-1">
            Monitor incidents, review reports, coordinate response teams, and track resolution.
          </p>
        </div>
      </div>

      {/* 6. Top Incident Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* CARD 1: Total Incidents */}
        <div className="bg-white rounded-2xl p-5 border border-[#E4ECD8] shadow-2xs hover:border-[#CCDABF] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#687961]">
              Total Incidents
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F4F7EF] text-[#4D602B] flex items-center justify-center border border-[#E0EAD4]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-[#182315] tracking-tight">
              {metrics.total}
            </span>
          </div>
        </div>

        {/* CARD 2: Pending */}
        <div className="bg-white rounded-2xl p-5 border border-[#E4ECD8] shadow-2xs hover:border-[#CCDABF] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#687961]">
              Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF6EB] text-[#7A6125] flex items-center justify-center border border-[#EFE5C9]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-[#182315] tracking-tight">
              {metrics.pending}
            </span>
          </div>
        </div>

        {/* CARD 3: In Progress */}
        <div className="bg-white rounded-2xl p-5 border border-[#E4ECD8] shadow-2xs hover:border-[#CCDABF] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#687961]">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#EDF4E7] text-[#435322] flex items-center justify-center border border-[#D5E2C8]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-[#182315] tracking-tight">
              {metrics.inProgress}
            </span>
          </div>
        </div>

        {/* CARD 4: Resolved */}
        <div className="bg-white rounded-2xl p-5 border border-[#E4ECD8] shadow-2xs hover:border-[#CCDABF] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#687961]">
              Resolved
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#EEF5E9] text-[#4D602B] flex items-center justify-center border border-[#D5E1CA]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-[#182315] tracking-tight">
              {metrics.resolved}
            </span>
          </div>
        </div>
      </div>

      {/* 7. Main Dashboard Layout (Desktop: List ~45%, Map ~55%; Mobile: List -> Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Incident List (approx 45% -> 5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#E4ECD8] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#182315]">
                Incidents
              </h2>
              <span className="text-xs text-[#6B7C64] font-semibold">
                Showing {filteredIncidents.length} of {reports.length}
              </span>
            </div>

            {/* 8. Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#7A8C73] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incidents..."
                className="w-full pl-10 pr-4 py-2 text-xs text-[#182315] bg-[#FAF8F5] border border-[#DCE4D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4D602B] focus:bg-white placeholder:text-[#97A592] transition-all"
              />
            </div>

            {/* 8. Filter Tabs: All, Pending, In Progress, Resolved */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#E4ECD8] overflow-x-auto">
              {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map((filter) => {
                const active = statusFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={`flex-1 min-w-[70px] py-1.5 px-2 text-xs font-semibold rounded-lg transition-all text-center whitespace-nowrap ${
                      active
                        ? 'bg-white text-[#182315] shadow-2xs border border-[#CCDABF]'
                        : 'text-[#64765D] hover:text-[#182315]'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            {/* Incident Cards Scrollable Queue */}
            <div className="space-y-3 pt-1 max-h-[640px] overflow-y-auto pr-1">
              {filteredIncidents.length === 0 ? (
                <div className="py-12 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-[#D6E0CE]">
                  <p className="text-xs text-[#6B7C64] font-medium">
                    No incidents match your search or filter.
                  </p>
                </div>
              ) : (
                filteredIncidents.map((incident) => {
                  const isSelected = incident.id === selectedIncidentId;
                  const group = getStatusGroup(incident);
                  const isCritical = incident.severity === 'High' || incident.severity === 'Critical';

                  return (
                    <div
                      key={incident.id}
                      onClick={() => setSelectedIncidentId(incident.id)}
                      onDoubleClick={() => navigate(`/officer/incidents/${incident.id}`)}
                      className={`group p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#F9FBF6] border-[#4D602B] ring-1 ring-[#4D602B]/30 shadow-xs'
                          : 'bg-white border-[#E4ECD8] hover:border-[#CAD8BF] hover:shadow-2xs'
                      }`}
                    >
                      {/* Top Bar: ID + Severity + Status */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-[#4D602B] bg-[#F1F6EB] px-2.5 py-0.5 rounded border border-[#D5E1CA]">
                          {incident.id}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Severity Badge */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isCritical
                                ? 'bg-[#F5F2EA] text-[#4D3F1B] border-[#D9CEB2]'
                                : 'bg-[#F2F6ED] text-[#34461B] border-[#CFDEBE]'
                            }`}
                          >
                            {incident.severity || 'Medium'}
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              group === 'Resolved'
                                ? 'bg-[#EEF5E9] text-[#2C4118] border-[#CFDEBD]'
                                : group === 'In Progress'
                                ? 'bg-[#F3F7ED] text-[#435322] border-[#D8E4CC]'
                                : 'bg-[#FAF6EB] text-[#695521] border-[#E8DCC0]'
                            }`}
                          >
                            {incident.status}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-[#182315] group-hover:text-[#3B4D1F] transition-colors line-clamp-1">
                        {incident.title}
                      </h3>

                      {/* Category & Location */}
                      <div className="mt-2 text-xs text-[#5E7057] space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#182315] bg-[#F2F6ED] px-1.5 py-0.5 rounded text-[11px]">
                            {incident.category}
                          </span>
                          <span className="text-[#8B9D85]">•</span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#798C72] shrink-0" />
                            <span className="truncate">{incident.location?.address}</span>
                          </span>
                        </div>
                      </div>

                      {/* Footer: Reported Time + Action Button */}
                      <div className="mt-3 pt-2.5 border-t border-[#F0F4E8] flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#788970] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#95A78E]" />
                          {formatRelativeTime(incident.createdAt)}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/officer/incidents/${incident.id}`);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#4D602B] hover:text-[#314118] transition-colors"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Incident Map (approx 55% -> 7 cols on lg) */}
        <div className="lg:col-span-7">
          <IncidentMap
            incidents={reports}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={(incident) => setSelectedIncidentId(incident.id)}
          />
        </div>
      </div>
    </div>
  );
};
