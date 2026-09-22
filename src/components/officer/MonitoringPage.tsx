import React from 'react';
import {
  ArrowLeft,
  Activity,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  ShieldCheck,
  Truck,
  MapPin,
  Check,
} from 'lucide-react';
import { useReports } from '../../context/ReportsContext';
import { useRouter } from '../../context/RouterContext';

interface MonitoringPageProps {
  incidentId: string;
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({ incidentId }) => {
  const { getReport, advanceMonitoring } = useReports();
  const { navigate } = useRouter();

  const incident = getReport(incidentId);

  if (!incident) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-sm text-[#5C6E54]">Incident not found.</p>
        <button
          type="button"
          onClick={() => navigate('/officer/dashboard')}
          className="mt-4 px-4 py-2 bg-[#4D602B] text-white text-xs font-bold rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const assignedTeam = incident.assignedTeam || {
    name: 'Road Department',
    availability: 'Dispatched',
    assignedAt: incident.createdAt,
  };

  const currentState = incident.incidentState || 'TEAM_ASSIGNED';

  // Determine stage progression index (0: Assigned, 1: Team Reached, 2: Work Started, 3: Completed)
  const getStageIndex = (state: string) => {
    switch (state) {
      case 'COMPLETED':
      case 'Resolved':
        return 3;
      case 'WORK_STARTED':
        return 2;
      case 'TEAM_REACHED':
        return 1;
      case 'TEAM_ASSIGNED':
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(currentState);

  const timelineStages = incident.monitoringTimeline && incident.monitoringTimeline.length === 4
    ? incident.monitoringTimeline
    : [
        {
          stage: 'TEAM_ASSIGNED',
          label: 'Assigned',
          timestamp: '10:32 AM',
          note: `${assignedTeam.name} allocated to incident. Crew mobilized.`,
          completed: currentStageIndex >= 0,
        },
        {
          stage: 'TEAM_REACHED',
          label: 'Team Reached',
          timestamp: currentStageIndex >= 1 ? '10:48 AM' : 'Pending',
          note: 'Unit arrived on site. Safety perimeter established.',
          completed: currentStageIndex >= 1,
        },
        {
          stage: 'WORK_STARTED',
          label: 'Work Started',
          timestamp: currentStageIndex >= 2 ? '11:02 AM' : 'Pending',
          note: 'Field action and physical repairs initiated.',
          completed: currentStageIndex >= 2,
        },
        {
          stage: 'COMPLETED',
          label: 'Completed',
          timestamp: currentStageIndex >= 3 ? '11:45 AM' : 'Pending',
          note: 'Resolution verified through municipal audit check.',
          completed: currentStageIndex >= 3,
        },
      ];

  const handleSimulateNext = () => {
    advanceMonitoring(incident.id);
  };

  // Team coordinates for simulation map based on stage
  // Incident target is roughly at center: (500, 350)
  const getTeamCoordinates = (stageIdx: number) => {
    switch (stageIdx) {
      case 0:
        // Far away from incident
        return { x: 260, y: 520, label: 'En Route (Depot)' };
      case 1:
        // Close to incident
        return { x: 440, y: 390, label: 'Arrived Perimeter' };
      case 2:
      case 3:
      default:
        // Directly at incident
        return { x: 500, y: 350, label: 'On Site' };
    }
  };

  const teamCoord = getTeamCoordinates(currentStageIndex);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(`/officer/incidents/${incident.id}`)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#4D602B] hover:text-[#324218] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Incident Details</span>
        </button>

        <span className="font-mono text-xs font-bold text-[#4D602B] bg-[#F1F6EB] px-2.5 py-1 rounded-lg border border-[#D5E1CA]">
          {incident.id}
        </span>
      </div>

      {/* 20. Heading & Metadata */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6E8067]">
            DISPATCH OPERATIONS
          </span>
          <span className="text-[10px] font-semibold text-[#6C7E66] bg-[#F2F6EC] px-2 py-0.5 rounded border border-[#DAE5D0]">
            Prototype simulation
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#182315]">
          Incident Monitoring
        </h1>
      </div>

      {/* Incident & Dispatch Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-3xl border border-[#E4ECD8] shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase text-[#73846D] block mb-0.5">
            Incident ID
          </span>
          <span className="font-mono text-xs font-bold text-[#182315]">{incident.id}</span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-[#73846D] block mb-0.5">
            Issue
          </span>
          <span className="text-xs font-bold text-[#182315] truncate block" title={incident.title}>
            {incident.title}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-[#73846D] block mb-0.5">
            Location
          </span>
          <span className="text-xs font-bold text-[#182315] truncate block" title={incident.location?.address}>
            {incident.location?.address}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase text-[#73846D] block mb-0.5">
            Assigned Team
          </span>
          <span className="text-xs font-bold text-[#4D602B] flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span>{assignedTeam.name}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 21. Monitoring Status Timeline (Left Column: 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E4ECD8] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#182315] uppercase tracking-wider">
              Resolution Progress
            </h2>
            <span className="text-xs font-semibold text-[#4D602B] bg-[#F2F6ED] px-2.5 py-0.5 rounded-full border border-[#D5E1CA]">
              {incident.status}
            </span>
          </div>

          <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E2EAD8]">
            {timelineStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isFuture = idx > currentStageIndex;

              return (
                <div key={stage.stage} className="relative flex items-start gap-4 pl-1">
                  {/* Indicator Dot */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors border ${
                      isPast
                        ? 'bg-[#4D602B] border-[#4D602B] text-white'
                        : isCurrent
                        ? 'bg-[#EBF2E2] border-[#4D602B] text-[#4D602B] ring-4 ring-[#EBF2E2]'
                        : 'bg-[#FAF8F5] border-[#DCE4D2] text-[#9EAFA0]'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : isCurrent ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4D602B]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#CCD8C4]" />
                    )}
                  </div>

                  {/* Stage Text */}
                  <div
                    className={`flex-1 p-3 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-[#FAFBF7] border-[#4D602B]/30 shadow-2xs'
                        : 'bg-white border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-xs font-bold ${
                          isPast || isCurrent ? 'text-[#182315]' : 'text-[#879982]'
                        }`}
                      >
                        {stage.label}
                      </h3>
                      <span
                        className={`text-[11px] font-mono font-medium ${
                          isCurrent
                            ? 'text-[#4D602B] font-bold'
                            : isPast
                            ? 'text-[#62735C]'
                            : 'text-[#9AA995]'
                        }`}
                      >
                        {stage.timestamp}
                      </span>
                    </div>

                    {stage.note && (
                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          isCurrent ? 'text-[#485942]' : 'text-[#7B8C75]'
                        }`}
                      >
                        {stage.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 22. Prototype Simulation Button */}
          <div className="pt-4 border-t border-[#EDF3E6] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#6E8067]">
              <span>Simulation Controls</span>
              <span>Prototype Mode</span>
            </div>

            <button
              type="button"
              disabled={currentStageIndex >= 3}
              onClick={handleSimulateNext}
              className="w-full py-2.5 px-4 bg-[#4D602B] hover:bg-[#3C4D20] disabled:bg-[#EEF2E8] disabled:text-[#97A691] disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2"
            >
              {currentStageIndex >= 3 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#4D602B]" />
                  <span>Resolution Completed</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Simulate Next Update</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 23. Monitoring Map (Right Column: 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E4ECD8] shadow-xs overflow-hidden flex flex-col min-h-[480px]">
          {/* Map Header */}
          <div className="px-6 py-4 border-b border-[#EEF2E6] flex items-center justify-between bg-[#FCFDFB]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#697A62] block">
                FIELD TELEMETRY
              </span>
              <h3 className="text-base font-bold text-[#182315]">
                Monitoring Map
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#4D602B] bg-[#EFF4E7] px-2.5 py-1 rounded-lg border border-[#D5E1CA]">
                Live Sector View
              </span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative flex-1 bg-[#FAF8F3] overflow-hidden select-none">
            <svg
              viewBox="0 0 1000 700"
              className="w-full h-full object-cover"
              style={{ minHeight: '400px' }}
            >
              <defs>
                <pattern id="monitor-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="#EAE6DC"
                    strokeWidth="0.75"
                  />
                </pattern>
              </defs>
              <rect width="1000" height="700" fill="#FAF8F3" />
              <rect width="1000" height="700" fill="url(#monitor-grid)" opacity="0.7" />

              {/* Transit corridor */}
              <path
                d="M 120 540 Q 300 480 500 350"
                fill="none"
                stroke="#D6E2CB"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d="M 120 540 Q 300 480 500 350"
                fill="none"
                stroke="#4D602B"
                strokeWidth="2.5"
                strokeDasharray="8,6"
                opacity="0.5"
              />

              {/* Cross streets */}
              <path
                d="M 200 200 Q 500 350 820 420"
                fill="none"
                stroke="#E2EAD8"
                strokeWidth="16"
                strokeLinecap="round"
                opacity="0.7"
              />

              {/* Incident Marker (Center at 500, 350) */}
              <g>
                <circle cx="500" cy="350" r="28" fill="#4D602B" opacity="0.12" />
                <circle cx="500" cy="350" r="16" fill="#435322" stroke="#FFFFFF" strokeWidth="3" />
                <circle cx="500" cy="350" r="5" fill="#FFFFFF" />
                <text
                  x="500"
                  y="322"
                  textAnchor="middle"
                  fill="#182315"
                  fontSize="12"
                  fontWeight="700"
                >
                  Incident Site ({incident.id})
                </text>
              </g>

              {/* Response Team Marker */}
              <g className="transition-all duration-700 ease-out">
                {currentStageIndex < 2 && (
                  <circle
                    cx={teamCoord.x}
                    cy={teamCoord.y}
                    r="22"
                    fill="#394B20"
                    opacity="0.2"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={teamCoord.x}
                  cy={teamCoord.y}
                  r="14"
                  fill="#2C3B18"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <circle cx={teamCoord.x} cy={teamCoord.y} r="4" fill="#FFFFFF" />
                <text
                  x={teamCoord.x}
                  y={teamCoord.y + 28}
                  textAnchor="middle"
                  fill="#2C3B18"
                  fontSize="11"
                  fontWeight="700"
                >
                  {assignedTeam.name} ({teamCoord.label})
                </text>
              </g>
            </svg>

            {/* Map Overlay Badge */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#CAD9BD] shadow-md text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4D602B] animate-pulse" />
                <span className="font-bold text-[#182315]">
                  Status: {incident.status}
                </span>
              </div>
              <p className="text-[11px] text-[#63755C]">
                Team coordinates: {teamCoord.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
