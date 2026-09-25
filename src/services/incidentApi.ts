import {
  CivicReport,
  IncidentState,
  IssueCategory,
  ResponseTeamId,
} from '../types/report';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

type ApiIncident = {
  id: string;
  citizenId: string;
  title: string;
  description: string;
  category: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  status: string;
  incidentState: string;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  analysis?: {
    severity?: string | null;
    confidence?: number | null;
    aiSummary?: string | null;
  } | null;
  impacts?: { service?: { name?: string } | null }[];
  evidence?: { id: string; name: string; url: string; type: string; size?: string | null }[];
  assignments?: {
    team?: { id: string; name: string; availability: string } | null;
    assignedAt: string;
    availability?: string | null;
    leadOfficer?: string | null;
  }[];
  monitoringEvents?: {
    stage: string;
    label: string;
    timestamp: string;
    note?: string | null;
    completed: boolean;
  }[];
};

type ApiResponse<T> = { success?: boolean; error?: string } & T;

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const headers = new Headers(options?.headers);
  const savedSession =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('civicflow_mock_session')
      : null;
  if (savedSession) {
    try {
      const session = JSON.parse(savedSession) as { sessionToken?: string };
      if (session.sessionToken) {
        headers.set('Authorization', `Bearer ${session.sessionToken}`);
      }
    } catch {
      // The API will return 401 for an invalid or missing session.
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('Unable to connect to CivicFlow API.');
  }

  let result: ApiResponse<T>;
  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`CivicFlow API returned an invalid response (${response.status}).`);
  }

  if (!response.ok || result.success === false) {
    throw new Error(result.error || `CivicFlow API request failed (${response.status}).`);
  }

  return result;
};

const displayStatus = (status: string, incidentState: string): string => {
  switch (incidentState) {
    case 'APPROVED':
      return 'Officer Review';
    case 'TEAM_ASSIGNED':
      return 'Team Assigned';
    case 'TEAM_REACHED':
    case 'WORK_STARTED':
      return 'In Progress';
    case 'COMPLETED':
      return 'Resolved';
    case 'REJECTED':
      return 'Rejected';
    case 'PENDING':
      return status === 'REPORTED' || status === 'PENDING' ? 'Reported' : status;
    default:
      return status;
  }
};

const mapIncident = (incident: ApiIncident): CivicReport => {
  const assignment = incident.assignments?.find((item) => item.team) || null;

  return {
    id: incident.id,
    citizenId: incident.citizenId,
    title: incident.title,
    description: incident.description,
    category: incident.category as IssueCategory,
    location: {
      address: incident.address,
      latitude: incident.latitude ?? undefined,
      longitude: incident.longitude ?? undefined,
    },
    media: (incident.evidence || []).map((item) => ({
      id: item.id,
      name: item.name,
      url: item.url,
      type: item.type === 'video' ? 'video' : 'image',
      size: item.size ?? undefined,
    })),
    status: displayStatus(incident.status, incident.incidentState),
    incidentState: incident.incidentState as IncidentState,
    severity: incident.analysis?.severity as CivicReport['severity'],
    confidence: incident.analysis?.confidence ?? undefined,
    aiSummary: incident.analysis?.aiSummary ?? undefined,
    affectedServices: (incident.impacts || [])
      .map((impact) => impact.service?.name)
      .filter((name): name is string => Boolean(name)),
    assignedTeam: assignment?.team
      ? {
          id: assignment.team.id,
          name: assignment.team.name,
          assignedAt: assignment.assignedAt,
          availability: assignment.availability || assignment.team.availability,
          leadOfficer: assignment.leadOfficer ?? undefined,
        }
      : null,
    rejectionReason: incident.rejectionReason ?? undefined,
    monitoringTimeline: incident.monitoringEvents?.map((event) => ({
      stage: event.stage as IncidentState,
      label: event.label,
      timestamp: event.timestamp,
      note: event.note ?? undefined,
      completed: event.completed,
    })),
    createdAt: incident.createdAt,
    updatedAt: incident.updatedAt,
  };
};

const incidentResult = async (path: string, options?: RequestInit): Promise<CivicReport> => {
  const result = await request<{ incident: ApiIncident }>(path, options);
  if (!result.incident?.id) throw new Error('CivicFlow API returned an incomplete incident.');
  return mapIncident(result.incident);
};

export const getIncidents = async (): Promise<CivicReport[]> => {
  const result = await request<{ incidents: ApiIncident[] }>('/api/incidents');
  if (!Array.isArray(result.incidents)) throw new Error('CivicFlow API returned an invalid incident list.');
  return result.incidents.map(mapIncident);
};

export const getCitizenIncidents = async (citizenId: string): Promise<CivicReport[]> => {
  const result = await request<{ incidents: ApiIncident[] }>(`/api/citizens/${encodeURIComponent(citizenId)}/incidents`);
  if (!Array.isArray(result.incidents)) throw new Error('CivicFlow API returned an invalid incident list.');
  return result.incidents.map(mapIncident);
};

export const getIncident = (id: string): Promise<CivicReport> =>
  incidentResult(`/api/incidents/${encodeURIComponent(id)}`);

export const createIncident = (data: {
  citizenId: string;
  title: string;
  description: string;
  category: string;
  address: string;
  latitude?: number;
  longitude?: number;
  media?: { id: string; name: string; url: string; type: string; size?: string }[];
}): Promise<CivicReport> =>
  incidentResult('/api/incidents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

const updateStatus = (id: string, data: Record<string, string>): Promise<CivicReport> =>
  incidentResult(`/api/incidents/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const approveIncident = (id: string): Promise<CivicReport> =>
  updateStatus(id, { status: 'Officer Review', incidentState: 'APPROVED' });

export const rejectIncident = (id: string, reason: string): Promise<CivicReport> =>
  updateStatus(id, { status: 'Rejected', incidentState: 'REJECTED', rejectionReason: reason });

export const assignTeam = (id: string, teamId: ResponseTeamId | string): Promise<CivicReport> =>
  incidentResult(`/api/incidents/${encodeURIComponent(id)}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId }),
  });

export const advanceMonitoring = (id: string): Promise<CivicReport> =>
  incidentResult(`/api/incidents/${encodeURIComponent(id)}/monitor`, {
    method: 'POST',
  });
