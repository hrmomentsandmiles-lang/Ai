export type IssueCategory =
  | 'Pothole'
  | 'Waterlogging'
  | 'Garbage'
  | 'Streetlight'
  | 'Traffic'
  | 'Other';

export type ReportStatus =
  | 'Reported'
  | 'AI Analysis'
  | 'Officer Review'
  | 'Team Assigned'
  | 'In Progress'
  | 'Resolved';

export type IncidentState =
  | 'PENDING'
  | 'APPROVED'
  | 'TEAM_ASSIGNED'
  | 'TEAM_REACHED'
  | 'WORK_STARTED'
  | 'COMPLETED'
  | 'REJECTED';

export type ResponseTeamId =
  | 'road-department'
  | 'traffic'
  | 'drainage'
  | 'movesmart';

export interface AssignedTeamInfo {
  id: ResponseTeamId | string;
  name: string;
  assignedAt: string;
  availability?: string;
  leadOfficer?: string;
}

export interface MonitoringUpdate {
  stage: IncidentState;
  label: string;
  timestamp: string;
  note?: string;
  completed?: boolean;
}

export interface ReportMedia {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size?: string;
}

export interface ReportLocation {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface CivicReport {
  id: string;
  citizenId: string;
  title: string;
  description: string;
  category: IssueCategory | string;
  location: ReportLocation;
  media: ReportMedia[];
  status: ReportStatus | IncidentState | string;
  incidentState?: IncidentState;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence?: number;
  aiSummary?: string;
  affectedServices?: string[];
  assignedTeam?: AssignedTeamInfo | null;
  rejectionReason?: string;
  monitoringTimeline?: MonitoringUpdate[];
  createdAt: string;
  updatedAt: string;
}
