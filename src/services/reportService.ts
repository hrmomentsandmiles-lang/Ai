import {
  CivicReport,
  IssueCategory,
  ReportStatus,
  IncidentState,
  ResponseTeamId,
  MonitoringUpdate,
} from '../types/report';

const STORAGE_KEY = 'civicflow_reports_v2';

const INITIAL_MOCK_REPORTS: CivicReport[] = [
  {
    id: 'CF-2026-0001',
    citizenId: 'CIT-8821',
    title: 'Heavy waterlogging near Main Road',
    description:
      'Road section affected by accumulated monsoon water. Pedestrian crossings submerged and traffic movement constrained to a single lane near junction.',
    category: 'Waterlogging',
    severity: 'High',
    confidence: 92,
    location: {
      address: 'Main Road, Banjara Hills, Hyderabad',
      latitude: 17.4156,
      longitude: 78.4357,
    },
    media: [
      {
        id: 'm-1',
        name: 'waterlogging-junction.jpg',
        url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
        type: 'image',
        size: '1.4 MB',
      },
    ],
    status: 'PENDING',
    incidentState: 'PENDING',
    aiSummary:
      'Road section affected by accumulated water and significant transit disruption. Drainage discharge obstruction identified.',
    affectedServices: ['Road Department', 'Traffic', 'Drainage', 'MoveSmart'],
    assignedTeam: null,
    createdAt: '2026-09-22T08:30:00.000Z',
    updatedAt: '2026-09-22T08:45:00.000Z',
  },
  {
    id: 'CF-2026-0002',
    citizenId: 'CIT-8822',
    title: 'Large pothole near College Road',
    description:
      'Deep asphalt crater on the northbound carriageway causing hazard for two-wheelers and emergency braking hazards.',
    category: 'Pothole',
    severity: 'Medium',
    confidence: 88,
    location: {
      address: 'College Road, Madhapur, Hyderabad',
      latitude: 17.4483,
      longitude: 78.3915,
    },
    media: [
      {
        id: 'm-2',
        name: 'pothole-depth.jpg',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        type: 'image',
        size: '1.8 MB',
      },
    ],
    status: 'In Progress',
    incidentState: 'WORK_STARTED',
    aiSummary: 'Road surface damage affecting vehicular traffic and pedestrian crossing safety.',
    affectedServices: ['Road Department', 'Traffic'],
    assignedTeam: {
      id: 'road-department',
      name: 'Road Department',
      assignedAt: '2026-09-20T10:30:00.000Z',
      availability: 'Dispatched',
    },
    monitoringTimeline: [
      {
        stage: 'TEAM_ASSIGNED',
        label: 'Assigned',
        timestamp: '10:32 AM',
        note: 'Road Department dispatched from Central Depot.',
        completed: true,
      },
      {
        stage: 'TEAM_REACHED',
        label: 'Team Reached',
        timestamp: '10:48 AM',
        note: 'Repair truck on site. Safety cones deployed.',
        completed: true,
      },
      {
        stage: 'WORK_STARTED',
        label: 'Work Started',
        timestamp: '11:02 AM',
        note: 'Cold-mix asphalt leveling and compacting in progress.',
        completed: true,
      },
      {
        stage: 'COMPLETED',
        label: 'Completed',
        timestamp: 'Pending',
        note: 'Final compaction and surface curing inspection.',
        completed: false,
      },
    ],
    createdAt: '2026-09-20T09:15:00.000Z',
    updatedAt: '2026-09-20T11:02:00.000Z',
  },
  {
    id: 'CF-2026-0003',
    citizenId: 'CIT-8823',
    title: 'Garbage accumulation near bus stop',
    description:
      'Commercial waste and municipal refuse containers overflowing onto sidewalk seating area.',
    category: 'Garbage',
    severity: 'Low',
    confidence: 95,
    location: {
      address: 'Bus Stop #14, Jubilee Hills, Hyderabad',
      latitude: 17.4319,
      longitude: 78.4073,
    },
    media: [
      {
        id: 'm-3',
        name: 'waste-overflow.jpg',
        url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80',
        type: 'image',
        size: '2.1 MB',
      },
    ],
    status: 'Resolved',
    incidentState: 'COMPLETED',
    aiSummary: 'Sanitary overflow requiring municipal secondary collection truck.',
    affectedServices: ['Drainage', 'Road Department'],
    assignedTeam: {
      id: 'drainage',
      name: 'Sanitation & Drainage',
      assignedAt: '2026-09-18T14:00:00.000Z',
      availability: 'Available',
    },
    monitoringTimeline: [
      {
        stage: 'TEAM_ASSIGNED',
        label: 'Assigned',
        timestamp: '02:00 PM',
        note: 'Sanitation team assigned.',
        completed: true,
      },
      {
        stage: 'TEAM_REACHED',
        label: 'Team Reached',
        timestamp: '02:30 PM',
        note: 'Compactor vehicle reached bus stop.',
        completed: true,
      },
      {
        stage: 'WORK_STARTED',
        label: 'Work Started',
        timestamp: '02:45 PM',
        note: 'Waste cleared and disinfected.',
        completed: true,
      },
      {
        stage: 'COMPLETED',
        label: 'Completed',
        timestamp: '03:15 PM',
        note: 'Site cleared and verified with photographic audit.',
        completed: true,
      },
    ],
    createdAt: '2026-09-18T13:30:00.000Z',
    updatedAt: '2026-09-18T15:15:00.000Z',
  },
  {
    id: 'CF-2026-0004',
    citizenId: 'CIT-8824',
    title: 'Traffic blockage near junction',
    description:
      'Malfunctioning traffic light controller creating vehicle gridlock during peak transit hours.',
    category: 'Traffic',
    severity: 'High',
    confidence: 94,
    location: {
      address: 'Cyber Towers Junction, Madhapur, Hyderabad',
      latitude: 17.4504,
      longitude: 78.3808,
    },
    media: [
      {
        id: 'm-4',
        name: 'traffic-signal.jpg',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        type: 'image',
        size: '1.2 MB',
      },
    ],
    status: 'PENDING',
    incidentState: 'PENDING',
    aiSummary: 'Signal failure causing severe vehicular delay on arterial corridor.',
    affectedServices: ['Traffic', 'MoveSmart'],
    assignedTeam: null,
    createdAt: '2026-09-22T11:00:00.000Z',
    updatedAt: '2026-09-22T11:05:00.000Z',
  },
  {
    id: 'CF-2026-0005',
    citizenId: 'CIT-8825',
    title: 'Streetlight not working near park',
    description:
      'Three consecutive municipal high-mast street poles failed, leaving the park promenade pedestrian path dark.',
    category: 'Streetlight',
    severity: 'Low',
    confidence: 89,
    location: {
      address: 'Sanjeevaiah Park Road, Secunderabad, Hyderabad',
      latitude: 17.4332,
      longitude: 78.4795,
    },
    media: [],
    status: 'PENDING',
    incidentState: 'PENDING',
    aiSummary: 'Public lighting blackout requiring electrical lineman team inspection.',
    affectedServices: ['Road Department'],
    assignedTeam: null,
    createdAt: '2026-09-22T07:15:00.000Z',
    updatedAt: '2026-09-22T07:20:00.000Z',
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
    status: 'PENDING',
    incidentState: 'PENDING',
    confidence: 90,
    affectedServices: data.affectedServices || ['Road Department', 'Traffic'],
    assignedTeam: null,
    createdAt: now,
    updatedAt: now,
  };

  const updatedList = [newReport, ...list];
  saveReports(updatedList);
  return newReport;
};

// Officer Workflow: Approve Incident
export const approveIncidentInStorage = (id: string): CivicReport | undefined => {
  const list = getStoredReports();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;

  const updated: CivicReport = {
    ...list[idx],
    status: 'Approved',
    incidentState: 'APPROVED',
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  saveReports(list);
  return updated;
};

// Officer Workflow: Reject Incident
export const rejectIncidentInStorage = (
  id: string,
  reason: string
): CivicReport | undefined => {
  const list = getStoredReports();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;

  const updated: CivicReport = {
    ...list[idx],
    status: 'Rejected',
    incidentState: 'REJECTED',
    rejectionReason: reason,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  saveReports(list);
  return updated;
};

// Officer Workflow: Assign Team
export const assignTeamInStorage = (
  id: string,
  teamId: ResponseTeamId | string,
  teamName: string
): CivicReport | undefined => {
  const list = getStoredReports();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const monitoringTimeline: MonitoringUpdate[] = [
    {
      stage: 'TEAM_ASSIGNED',
      label: 'Assigned',
      timestamp: timeStr,
      note: `${teamName} assigned to incident. Crew dispatched.`,
      completed: true,
    },
    {
      stage: 'TEAM_REACHED',
      label: 'Team Reached',
      timestamp: 'Pending',
      note: 'Transit to location in progress.',
      completed: false,
    },
    {
      stage: 'WORK_STARTED',
      label: 'Work Started',
      timestamp: 'Pending',
      note: 'Field action will initiate upon arrival.',
      completed: false,
    },
    {
      stage: 'COMPLETED',
      label: 'Completed',
      timestamp: 'Pending',
      note: 'Verification and resolution inspection.',
      completed: false,
    },
  ];

  const updated: CivicReport = {
    ...list[idx],
    status: 'Team Assigned',
    incidentState: 'TEAM_ASSIGNED',
    assignedTeam: {
      id: teamId,
      name: teamName,
      assignedAt: now.toISOString(),
      availability: 'Dispatched',
    },
    monitoringTimeline,
    updatedAt: now.toISOString(),
  };

  list[idx] = updated;
  saveReports(list);
  return updated;
};

// Officer Workflow: Simulate Next Update in Monitoring
export const advanceMonitoringInStorage = (id: string): CivicReport | undefined => {
  const list = getStoredReports();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;

  const report = list[idx];
  const currentState = report.incidentState || 'TEAM_ASSIGNED';
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let nextState: IncidentState = currentState;
  let nextStatus: string = report.status;
  const timeline = report.monitoringTimeline ? [...report.monitoringTimeline] : [];

  if (currentState === 'TEAM_ASSIGNED') {
    nextState = 'TEAM_REACHED';
    nextStatus = 'In Progress';
    if (timeline[1]) {
      timeline[1].timestamp = timeStr;
      timeline[1].note = 'Response unit on-site. Perimeter secured.';
      timeline[1].completed = true;
    }
  } else if (currentState === 'TEAM_REACHED') {
    nextState = 'WORK_STARTED';
    nextStatus = 'In Progress';
    if (timeline[2]) {
      timeline[2].timestamp = timeStr;
      timeline[2].note = 'Physical repair and mitigation work actively underway.';
      timeline[2].completed = true;
    }
  } else if (currentState === 'WORK_STARTED') {
    nextState = 'COMPLETED';
    nextStatus = 'Resolved';
    if (timeline[3]) {
      timeline[3].timestamp = timeStr;
      timeline[3].note = 'Field resolution completed. Quality audit verified.';
      timeline[3].completed = true;
    }
  }

  const updated: CivicReport = {
    ...report,
    status: nextStatus,
    incidentState: nextState,
    monitoringTimeline: timeline,
    updatedAt: now.toISOString(),
  };

  list[idx] = updated;
  saveReports(list);
  return updated;
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
