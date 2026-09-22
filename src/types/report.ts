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
  status: ReportStatus;
  severity?: 'Low' | 'Medium' | 'High';
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
}
