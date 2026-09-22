export type ReportStatus =
  | 'Reported'
  | 'AI Analysis'
  | 'Officer Review'
  | 'Team Assigned'
  | 'In Progress'
  | 'Resolved';

export type IssueCategory =
  | 'Pothole'
  | 'Waterlogging'
  | 'Garbage'
  | 'Streetlight'
  | 'Traffic'
  | 'Other';

export interface ReportLocation {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface ReportMediaItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size?: string;
}

export interface CitizenReport {
  id: string;
  citizenId: string;
  title: string;
  description: string;
  category: IssueCategory | string;
  location: ReportLocation;
  media: ReportMediaItem[];
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  aiSummary?: string;
}

export interface AISuggestionResult {
  category: IssueCategory;
  shortSummary: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
}
