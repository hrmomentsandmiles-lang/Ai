import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const prisma = new PrismaClient({ adapter });

const teams = [
  {
    id: "road-department",
    name: "Road Department",
    description: "Road repairs and infrastructure issues.",
    availability: "Available",
  },
  {
    id: "traffic",
    name: "Traffic",
    description:
      "Traffic management, road blockage and diversion coordination.",
    availability: "Available",
  },
  {
    id: "drainage",
    name: "Drainage",
    description: "Waterlogging, drainage and flood-related response.",
    availability: "Available",
  },
  {
    id: "movesmart",
    name: "MoveSmart",
    description:
      "Public transportation coordination, route impact and mobility response.",
    availability: "Available",
  },
];

const reports = [
  {
    id: "CF-2026-0001",
    citizenId: "CIT-8821",
    title: "Heavy waterlogging near Main Road",
    description:
      "Road section affected by accumulated monsoon water. Pedestrian crossings submerged and traffic movement constrained to a single lane near junction.",
    category: "Waterlogging",
    address: "Main Road, Banjara Hills, Hyderabad",
    latitude: 17.4156,
    longitude: 78.4357,
    status: "PENDING",
    incidentState: "PENDING",
    severity: "High",
    confidence: 92,
    aiSummary:
      "Road section affected by accumulated water and significant transit disruption. Drainage discharge obstruction identified.",
    affectedServices: [
      "Road Department",
      "Traffic",
      "Drainage",
      "MoveSmart",
    ],
    createdAt: "2026-09-22T08:30:00.000Z",
    updatedAt: "2026-09-22T08:45:00.000Z",
    evidence: [
      {
        id: "m-1",
        name: "waterlogging-junction.jpg",
        url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
        type: "image",
        size: "1.4 MB",
      },
    ],
  },

  {
    id: "CF-2026-0002",
    citizenId: "CIT-8822",
    title: "Large pothole near College Road",
    description:
      "Deep asphalt crater on the northbound carriageway causing hazard for two-wheelers and emergency braking hazards.",
    category: "Pothole",
    address: "College Road, Madhapur, Hyderabad",
    latitude: 17.4483,
    longitude: 78.3915,
    status: "In Progress",
    incidentState: "WORK_STARTED",
    severity: "Medium",
    confidence: 88,
    aiSummary:
      "Road surface damage affecting vehicular traffic and pedestrian crossing safety.",
    affectedServices: ["Road Department", "Traffic"],
    assignedTeamId: "road-department",
    assignedAt: "2026-09-20T10:30:00.000Z",
    assignmentAvailability: "Dispatched",
    createdAt: "2026-09-20T09:15:00.000Z",
    updatedAt: "2026-09-20T11:02:00.000Z",
    evidence: [
      {
        id: "m-2",
        name: "pothole-depth.jpg",
        url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
        type: "image",
        size: "1.8 MB",
      },
    ],
    monitoring: [
      {
        stage: "TEAM_ASSIGNED",
        label: "Assigned",
        timestamp: "2026-09-20T10:32:00.000Z",
        note: "Road Department dispatched from Central Depot.",
        completed: true,
      },
      {
        stage: "TEAM_REACHED",
        label: "Team Reached",
        timestamp: "2026-09-20T10:48:00.000Z",
        note: "Repair truck on site. Safety cones deployed.",
        completed: true,
      },
      {
        stage: "WORK_STARTED",
        label: "Work Started",
        timestamp: "2026-09-20T11:02:00.000Z",
        note: "Cold-mix asphalt leveling and compacting in progress.",
        completed: true,
      },
      {
        stage: "COMPLETED",
        label: "Completed",
        timestamp: "2026-09-20T11:02:00.000Z",
        note: "Final compaction and surface curing inspection.",
        completed: false,
      },
    ],
  },

  {
    id: "CF-2026-0003",
    citizenId: "CIT-8823",
    title: "Garbage accumulation near bus stop",
    description:
      "Commercial waste and municipal refuse containers overflowing onto sidewalk seating area.",
    category: "Garbage",
    address: "Bus Stop #14, Jubilee Hills, Hyderabad",
    latitude: 17.4319,
    longitude: 78.4073,
    status: "Resolved",
    incidentState: "COMPLETED",
    severity: "Low",
    confidence: 95,
    aiSummary:
      "Sanitary overflow requiring municipal secondary collection truck.",
    affectedServices: ["Drainage", "Road Department"],
    assignedTeamId: "drainage",
    assignedAt: "2026-09-18T14:00:00.000Z",
    assignmentAvailability: "Available",
    createdAt: "2026-09-18T13:30:00.000Z",
    updatedAt: "2026-09-18T15:15:00.000Z",
    evidence: [
      {
        id: "m-3",
        name: "waste-overflow.jpg",
        url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80",
        type: "image",
        size: "2.1 MB",
      },
    ],
    monitoring: [
      {
        stage: "TEAM_ASSIGNED",
        label: "Assigned",
        timestamp: "2026-09-18T14:00:00.000Z",
        note: "Sanitation team assigned.",
        completed: true,
      },
      {
        stage: "TEAM_REACHED",
        label: "Team Reached",
        timestamp: "2026-09-18T14:30:00.000Z",
        note: "Compactor vehicle reached bus stop.",
        completed: true,
      },
      {
        stage: "WORK_STARTED",
        label: "Work Started",
        timestamp: "2026-09-18T14:45:00.000Z",
        note: "Waste cleared and disinfected.",
        completed: true,
      },
      {
        stage: "COMPLETED",
        label: "Completed",
        timestamp: "2026-09-18T15:15:00.000Z",
        note: "Site cleared and verified with photographic audit.",
        completed: true,
      },
    ],
  },

  {
    id: "CF-2026-0004",
    citizenId: "CIT-8824",
    title: "Traffic blockage near junction",
    description:
      "Malfunctioning traffic light controller creating vehicle gridlock during peak transit hours.",
    category: "Traffic",
    address: "Cyber Towers Junction, Madhapur, Hyderabad",
    latitude: 17.4504,
    longitude: 78.3808,
    status: "PENDING",
    incidentState: "PENDING",
    severity: "High",
    confidence: 94,
    aiSummary:
      "Signal failure causing severe vehicular delay on arterial corridor.",
    affectedServices: ["Traffic", "MoveSmart"],
    createdAt: "2026-09-22T11:00:00.000Z",
    updatedAt: "2026-09-22T11:05:00.000Z",
    evidence: [
      {
        id: "m-4",
        name: "traffic-signal.jpg",
        url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
        type: "image",
        size: "1.2 MB",
      },
    ],
  },

  {
    id: "CF-2026-0005",
    citizenId: "CIT-8825",
    title: "Streetlight not working near park",
    description:
      "Three consecutive municipal high-mast street poles failed, leaving the park promenade pedestrian path dark.",
    category: "Streetlight",
    address: "Sanjeevaiah Park Road, Secunderabad, Hyderabad",
    latitude: 17.4332,
    longitude: 78.4795,
    status: "PENDING",
    incidentState: "PENDING",
    severity: "Low",
    confidence: 89,
    aiSummary:
      "Public lighting blackout requiring electrical lineman team inspection.",
    affectedServices: ["Road Department"],
    createdAt: "2026-09-22T07:15:00.000Z",
    updatedAt: "2026-09-22T07:20:00.000Z",
    evidence: [],
  },
];

async function main() {
  console.log("Starting CivicFlow database seed...");

  // Clear prototype data so the seed is deterministic.
  await prisma.monitoringEvent.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.responseAction.deleteMany();
  await prisma.responseAssignment.deleteMany();
  await prisma.responsePlan.deleteMany();
  await prisma.incidentImpact.deleteMany();
  await prisma.incidentAnalysis.deleteMany();
  await prisma.incidentEvidence.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.responseTeam.deleteMany();
  await prisma.user.deleteMany();

  // Response teams used by the existing website.
  for (const team of teams) {
    await prisma.responseTeam.create({
      data: team,
    });
  }

  // Create citizen records and incidents.
  for (const report of reports) {
    await prisma.user.create({
      data: {
        id: report.citizenId,
        phone: `+910000${report.citizenId.slice(-4)}`,
        role: "citizen",
        displayName: report.citizenId,
      },
    });

    await prisma.incident.create({
      data: {
        id: report.id,
        citizenId: report.citizenId,
        title: report.title,
        description: report.description,
        category: report.category,
        address: report.address,
        latitude: report.latitude,
        longitude: report.longitude,
        status: report.status,
        incidentState: report.incidentState,
        createdAt: new Date(report.createdAt),
        updatedAt: new Date(report.updatedAt),

        analysis: {
          create: {
            severity: report.severity,
            confidence: report.confidence,
            aiSummary: report.aiSummary,
          },
        },

        evidence: {
          create: report.evidence.map((item) => ({
            id: item.id,
            name: item.name,
            url: item.url,
            type: item.type,
            size: item.size,
          })),
        },

        impacts: {
          create: report.affectedServices.map((serviceName) => {
            const team = teams.find((t) => t.name === serviceName);

            if (!team) {
              throw new Error(
                `Response team not found for affected service: ${serviceName}`,
              );
            }

            return {
              serviceId: team.id,
            };
          }),
        },
      },
    });

    if (report.assignedTeamId) {
      await prisma.responseAssignment.create({
        data: {
          incidentId: report.id,
          teamId: report.assignedTeamId,
          assignedAt: new Date(report.assignedAt!),
          availability: report.assignmentAvailability,
          active: true,
        },
      });
    }

    if (report.monitoring) {
      await prisma.monitoringEvent.createMany({
        data: report.monitoring.map((event) => ({
          incidentId: report.id,
          stage: event.stage,
          label: event.label,
          timestamp: new Date(event.timestamp),
          note: event.note,
          completed: event.completed,
        })),
      });
    }
  }

  console.log(`Seeded ${teams.length} response teams.`);
  console.log(`Seeded ${reports.length} incidents.`);
  console.log("CivicFlow database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });