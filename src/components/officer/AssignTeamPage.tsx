import React, { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  ShieldAlert,
  Droplets,
  Bus,
  CheckCircle2,
  ArrowRight,
  Check,
  Building2,
} from 'lucide-react';
import { useReports } from '../../context/ReportsContext';
import { useRouter } from '../../context/RouterContext';
import { ResponseTeamId } from '../../types/report';

interface AssignTeamPageProps {
  incidentId: string;
}

interface TeamOption {
  id: ResponseTeamId;
  name: string;
  description: string;
  availability: string;
  icon: React.ElementType;
}

const TEAMS: TeamOption[] = [
  {
    id: 'road-department',
    name: 'Road Department',
    description: 'Road repairs and infrastructure issues.',
    availability: 'Available',
    icon: Truck,
  },
  {
    id: 'traffic',
    name: 'Traffic',
    description: 'Traffic management, road blockage and diversion coordination.',
    availability: 'Available',
    icon: ShieldAlert,
  },
  {
    id: 'drainage',
    name: 'Drainage',
    description: 'Waterlogging, drainage and flood-related response.',
    availability: 'Available',
    icon: Droplets,
  },
  {
    id: 'movesmart',
    name: 'MoveSmart',
    description: 'Public transportation coordination, route impact and mobility response.',
    availability: 'Available',
    icon: Bus,
  },
];

export const AssignTeamPage: React.FC<AssignTeamPageProps> = ({ incidentId }) => {
  const { getReport, assignTeam } = useReports();
  const { navigate } = useRouter();

  const incident = getReport(incidentId);

  const [selectedTeamId, setSelectedTeamId] = useState<ResponseTeamId | null>(
    (incident?.assignedTeam?.id as ResponseTeamId) || null
  );
  const [assignmentConfirmed, setAssignmentConfirmed] = useState<boolean>(
    Boolean(incident?.assignedTeam)
  );
  const [assignedTeamName, setAssignedTeamName] = useState<string>(
    incident?.assignedTeam?.name || ''
  );

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

  const handleConfirmAssignment = async () => {
    if (!selectedTeamId) return;
    const team = TEAMS.find((t) => t.id === selectedTeamId);
    if (!team) return;

    await assignTeam(incident.id, team.id, team.name);
    setAssignedTeamName(team.name);
    setAssignmentConfirmed(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Back Button & Incident Pill */}
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

      {/* 17. Heading & Supporting Text */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6E8067] block mb-1">
          OPERATIONAL DISPATCH
        </span>
        <h1 className="text-2xl font-extrabold text-[#182315]">
          Assign Response Team
        </h1>
        <p className="text-sm text-[#5C6E54] mt-1">
          Select the team responsible for this incident.
        </p>
      </div>

      {/* Incident Mini Context Strip */}
      <div className="p-4 bg-white rounded-2xl border border-[#E4ECD8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase text-[#71826B] block mb-0.5">
            Target Incident
          </span>
          <span className="font-bold text-[#182315]">{incident.title}</span>
          <span className="text-[#6D7E67] block mt-0.5">{incident.location?.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[#182315] font-semibold border border-[#DDE6D3]">
            {incident.category}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FAF6EB] text-[#635122] font-semibold border border-[#EAE0C6]">
            {incident.severity || 'Medium'}
          </span>
        </div>
      </div>

      {/* Confirmation Banner if Already Assigned */}
      {assignmentConfirmed && (
        <div className="p-5 bg-[#EEF5E9] border border-[#CFDEBD] rounded-3xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 text-sm font-bold text-[#2C4118]">
            <CheckCircle2 className="w-5 h-5 text-[#4D602B] shrink-0" />
            <span>{assignedTeamName} assigned to incident {incident.id}.</span>
          </div>
          <p className="text-xs text-[#445638] pl-8">
            Response crew has been dispatched. You can track live field status and milestone progressions in the monitoring suite.
          </p>
          <div className="pl-8 pt-1">
            <button
              type="button"
              onClick={() => navigate(`/officer/incidents/${incident.id}/monitor`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4D602B] hover:bg-[#3C4D20] text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
            >
              <span>View Monitoring →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 17 & 18. Four Team Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEAMS.map((team) => {
          const Icon = team.icon;
          const isSelected = selectedTeamId === team.id;

          return (
            <div
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#FAFBF7] border-[#4D602B] ring-2 ring-[#4D602B]/20 shadow-xs'
                  : 'bg-white border-[#E4ECD8] hover:border-[#CAD8BF] hover:shadow-2xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-[#EBF2E2] text-[#4D602B] border-[#D1DFBF]'
                        : 'bg-[#FAF8F5] text-[#55674F] border-[#E1EAD6]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFF5EA] text-[#374924] border border-[#D5E1CA]">
                    {team.availability}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#182315]">
                    {team.name}
                  </h3>
                  <p className="text-xs text-[#596B52] mt-1 leading-relaxed">
                    {team.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F0F4E8] flex items-center justify-between">
                <span className="text-[11px] text-[#71826B] font-medium">
                  {isSelected ? 'Ready to confirm' : 'Click to select'}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTeamId(team.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    isSelected
                      ? 'bg-[#4D602B] text-white shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#182315] border border-[#D8E2CE] hover:bg-[#F2F6ED]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Selected</span>
                    </>
                  ) : (
                    <span>Select Team</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Button Bar */}
      <div className="pt-4 border-t border-[#EDF3E6] flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate(`/officer/incidents/${incident.id}`)}
          className="px-5 py-2.5 text-xs font-semibold text-[#5B6C54] hover:text-[#182315] rounded-xl transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!selectedTeamId}
          onClick={handleConfirmAssignment}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4D602B] hover:bg-[#3C4D20] disabled:bg-[#D5E1CA] disabled:text-[#889880] disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
        >
          <Building2 className="w-4 h-4" />
          <span>Confirm Assignment</span>
        </button>
      </div>
    </div>
  );
};
