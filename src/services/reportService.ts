import { CivicReport, IssueCategory, ReportStatus } from '../types/report';

const STORAGE_KEY = 'civicflow_reports';

const INITIAL_MOCK_REPORTS: CivicReport[] = [
  {
    id: 'CF-2026-0001',
    citizenId: 'CIT-8821',
    title: 'Waterlogging near Main Road',
    description:
      'Heavy monsoon runoff has accumulated creating standing water blocking pedestrian crossings and slowing vehicular lanes near the junction.',
    category: 'Waterlogging',
    location: {
      address: 'Main Road, Banjara Hills, Hyderabad',
      latitude: 17.4156,
      longitude: 78.4357,
    },
    media: [
      {
        id: 'm-1',
        name: 'waterlog-site.jpg',
        url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
        type: 'image',
        size: '1.4 MB',
      },
    ],
    status: 'AI Analysis',
    severity: 'High',
    aiSummary: 'Road affected by accumulated water.',
    createdAt: '2026-09-22T08:30:00.000Z',
    updatedAt: '2026-09-22T08:45:00.000Z',
  },
  {
    id: 'CF-2026-0002',
    citizenId: 'CIT-8821',
    title: 'Garbage accumulation near bus stop',
    description:
      'Commercial waste bins are overflowing with bags spilling over the footpath and shelter seating area.',
    category: 'Garbage',
    location: {
      address: 'Bus Stop #14, Jubilee Hills, Hyderabad',
      latitude: 17.4319,
      longitude: 78.4073,
    },
    media: [
      {
        id: 'm-2',
        name: 'waste-overflow.jpg',
        url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
        type: 'image',
        size: '2.1 MB',
      },
    ],
    status: 'In Progress',
    severity: 'Medium',
    aiSummary: 'Uncollected waste creating sanitary hazard.',
    createdAt: '2026-09-20T11:15:00.000Z',
    updatedAt: '2026-09-21T09:20:00.000Z',
  },
  {
    id: 'CF-2026-0003',
    citizenId: 'CIT-8821',
    title: 'Pothole near College Road',
    description:
      'Deep circular crater on the right carriageway causing hazard for two-wheelers and braking hazards.',
    category: 'Pothole',
    location: {
      address: 'College Road, Madhapur, Hyderabad',
      latitude: 17.4483,
      longitude: 78.3915,
    },
    media: [
      {
        id: 'm-3',
        name: 'pothole-depth.jpg',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        type: 'image',
        size: '1.8 MB',
      },
    ],
    status: 'Resolved',
    severity: 'Medium',
    aiSummary: 'Road surface damage affecting vehicular traffic.',
    createdAt: '2026-09-18T14:00:00.000Z',
    updatedAt: '2026-09-19T16:30:00.000Z',
  },
];

export const getStoredReports = (): CivicReport[] => {
  if (typeof window === 'undefined') return INITIAL_MOCK_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REPORTS));
      return INITIAL_MOCK_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REPORTS));
      return INITIAL_MOCK_REPORTS;
    }
    return parsed;
  } catch {
    return INITIAL_MOCK_REPORTS;
  }
};

export const saveReports = (reports: CivicReport[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Failed to save reports to localStorage:', err);
  }
};

export const getReportById = (id: string): CivicReport | undefined => {
  const list = getStoredReports();
  return list.find((r) => r.id === id);
};

export const createNewReport = (
  data: Omit<CivicReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): CivicReport => {
  const list = getStoredReports();
  const nextNum = list.length + 1;
  const idStr = String(nextNum).padStart(4, '0');
  const now = new Date().toISOString();

  const newReport: CivicReport = {
    ...data,
    id: `CF-2026-${idStr}`,
    status: 'Reported',
    createdAt: now,
    updatedAt: now,
  };

  const updatedList = [newReport, ...list];
  saveReports(updatedList);
  return newReport;
};

export interface AISuggestionResult {
  category: IssueCategory;
  summary: string;
  severity: 'Low' | 'Medium' | 'High';
}

export const analyzeReportWithAI = (
  title: string,
  description: string
): AISuggestionResult => {
  const combined = `${title} ${description}`.toLowerCase();

  if (
    combined.includes('water') ||
    combined.includes('flood') ||
    combined.includes('standing water') ||
    combined.includes('waterlog') ||
    combined.includes('drain')
  ) {
    return {
      category: 'Waterlogging',
      summary: 'Road affected by accumulated water.',
      severity: 'High',
    };
  }

  if (
    combined.includes('pothole') ||
    combined.includes('road damage') ||
    combined.includes('crater') ||
    combined.includes('asphalt') ||
    combined.includes('tarmac')
  ) {
    return {
      category: 'Pothole',
      summary: 'Road surface damage affecting vehicular traffic.',
      severity: 'Medium',
    };
  }

  if (
    combined.includes('garbage') ||
    combined.includes('waste') ||
    combined.includes('trash') ||
    combined.includes('dump') ||
    combined.includes('litter') ||
    combined.includes('bin')
  ) {
    return {
      category: 'Garbage',
      summary: 'Uncollected waste creating sanitary hazard.',
      severity: 'Medium',
    };
  }

  if (
    combined.includes('streetlight') ||
    combined.includes('street light') ||
    combined.includes('lamp') ||
    combined.includes('lighting') ||
    combined.includes('dark')
  ) {
    return {
      category: 'Streetlight',
      summary: 'Public lighting infrastructure malfunction.',
      severity: 'Medium',
    };
  }

  if (
    combined.includes('traffic') ||
    combined.includes('congestion') ||
    combined.includes('blocked road') ||
    combined.includes('signal') ||
    combined.includes('jam')
  ) {
    return {
      category: 'Traffic',
      summary: 'Transit disruption impacting traffic flow.',
      severity: 'High',
    };
  }

  return {
    category: 'Other',
    summary: 'Civic irregularity identified for municipal review.',
    severity: 'Low',
  };
};

export const TIMELINE_STAGES: ReportStatus[] = [
  'Reported',
  'AI Analysis',
  'Officer Review',
  'Team Assigned',
  'In Progress',
  'Resolved',
];
