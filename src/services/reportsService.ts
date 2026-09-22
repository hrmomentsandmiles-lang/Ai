import { CitizenReport, AISuggestionResult, IssueCategory } from '../types/citizen';

const STORAGE_KEY = 'civicflow_citizen_reports_v1';

const INITIAL_MOCK_REPORTS: CitizenReport[] = [
  {
    id: 'CF-2026-0001',
    citizenId: 'citizen_ashar',
    title: 'Waterlogging near Main Road',
    description: 'Severe waterlogging after monsoon rain blocking traffic flow outside the metro station entrance. Pedestrians unable to cross safely.',
    category: 'Waterlogging',
    location: {
      address: 'Main Road, Near Metro Pillar 142, Hyderabad',
      latitude: 17.4435,
      longitude: 78.3821,
    },
    media: [
      {
        id: 'med-1',
        name: 'waterlogging_junction.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
        size: '1.4 MB',
      },
    ],
    status: 'AI Analysis',
    severity: 'High',
    aiSummary: 'Road affected by accumulated water, disrupting vehicular flow and pedestrian transit.',
    createdAt: '2026-09-22T08:30:00.000Z',
    updatedAt: '2026-09-22T08:35:00.000Z',
  },
  {
    id: 'CF-2026-0002',
    citizenId: 'citizen_ashar',
    title: 'Garbage accumulation near bus stop',
    description: 'Overflowing community bins creating unsanitary smell and blocking the walkway adjacent to the state transit depot.',
    category: 'Garbage',
    location: {
      address: 'City Bus Stop, Sector 4, Hyderabad',
      latitude: 17.4328,
      longitude: 78.4012,
    },
    media: [
      {
        id: 'med-2',
        name: 'waste_accumulation.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
        size: '2.1 MB',
      },
    ],
    status: 'In Progress',
    severity: 'Medium',
    aiSummary: 'Solid waste overflow near public transit shelter requiring sanitary team dispatch.',
    createdAt: '2026-09-20T11:15:00.000Z',
    updatedAt: '2026-09-21T09:20:00.000Z',
  },
  {
    id: 'CF-2026-0003',
    citizenId: 'citizen_ashar',
    title: 'Pothole near College Road',
    description: 'Deep pothole roughly 2 feet in diameter located right in the bike lane causing two-wheeler skids.',
    category: 'Pothole',
    location: {
      address: 'College Road, Opp. Engineering Block, Hyderabad',
      latitude: 17.4192,
      longitude: 78.4481,
    },
    media: [
      {
        id: 'med-3',
        name: 'road_pothole_asphalt.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        size: '1.8 MB',
      },
    ],
    status: 'Resolved',
    severity: 'High',
    aiSummary: 'Asphalt surface damage repaired with hot-mix patch and inspected by ward engineer.',
    createdAt: '2026-09-18T14:45:00.000Z',
    updatedAt: '2026-09-19T16:00:00.000Z',
  },
];

export const getReports = (): CitizenReport[] => {
  if (typeof window === 'undefined') return INITIAL_MOCK_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REPORTS));
      return INITIAL_MOCK_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REPORTS));
    return INITIAL_MOCK_REPORTS;
  } catch {
    return INITIAL_MOCK_REPORTS;
  }
};

export const getReportById = (id: string): CitizenReport | undefined => {
  const reports = getReports();
  return reports.find((r) => r.id === id || r.id.toLowerCase() === id.toLowerCase());
};

export const createReport = (
  newReportData: Omit<CitizenReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): CitizenReport => {
  const currentReports = getReports();

  // Generate clean sequential ID CF-2026-000X
  const count = currentReports.length + 1;
  const idNumber = String(count).padStart(4, '0');
  const id = `CF-2026-${idNumber}`;

  const now = new Date().toISOString();
  const created: CitizenReport = {
    ...newReportData,
    id,
    status: 'Reported',
    createdAt: now,
    updatedAt: now,
  };

  const updated = [created, ...currentReports];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  }

  return created;
};

/**
 * Intelligent client-side AI Suggestion analyzer based on civic keywords
 * Formulates Category, Short Summary, and Possible Severity without external server delays.
 */
export const getAISuggestions = (title: string, description: string): AISuggestionResult => {
  const combined = `${title} ${description}`.toLowerCase();

  let category: IssueCategory = 'Other';
  let severity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
  let shortSummary = 'Civic issue described by citizen requiring municipal attention.';

  if (
    combined.includes('pothole') ||
    combined.includes('road') ||
    combined.includes('crack') ||
    combined.includes('asphalt') ||
    combined.includes('tarmac') ||
    combined.includes('crater')
  ) {
    category = 'Pothole';
    shortSummary = 'Roadway surface damage affecting transit safety and vehicle passage.';
    severity = combined.includes('deep') || combined.includes('accident') || combined.includes('bike') ? 'High' : 'Medium';
  } else if (
    combined.includes('water') ||
    combined.includes('flood') ||
    combined.includes('drain') ||
    combined.includes('clog') ||
    combined.includes('waterlog') ||
    combined.includes('pipe') ||
    combined.includes('leak')
  ) {
    category = 'Waterlogging';
    shortSummary = 'Accumulated drainage overflow creating pedestrian obstruction and waterlogging.';
    severity = combined.includes('metro') || combined.includes('main road') || combined.includes('severe') ? 'High' : 'Medium';
  } else if (
    combined.includes('garbage') ||
    combined.includes('waste') ||
    combined.includes('trash') ||
    combined.includes('bin') ||
    combined.includes('dump') ||
    combined.includes('rubbish') ||
    combined.includes('smell')
  ) {
    category = 'Garbage';
    shortSummary = 'Solid municipal waste accumulation requiring sanitation clearance.';
    severity = combined.includes('overflow') || combined.includes('hospital') || combined.includes('school') ? 'High' : 'Medium';
  } else if (
    combined.includes('light') ||
    combined.includes('lamp') ||
    combined.includes('dark') ||
    combined.includes('bulb') ||
    combined.includes('pole') ||
    combined.includes('streetlight')
  ) {
    category = 'Streetlight';
    shortSummary = 'Public illumination failure causing nighttime visibility hazards.';
    severity = combined.includes('junction') || combined.includes('blind') ? 'High' : 'Low';
  } else if (
    combined.includes('traffic') ||
    combined.includes('signal') ||
    combined.includes('jam') ||
    combined.includes('congestion') ||
    combined.includes('parking') ||
    combined.includes('crosswalk')
  ) {
    category = 'Traffic';
    shortSummary = 'Traffic disruption or signal dysfunction hindering intersection flow.';
    severity = combined.includes('junction') || combined.includes('signal off') ? 'Critical' : 'Medium';
  }

  return {
    category,
    shortSummary,
    severity,
    confidence: 0.94,
  };
};
