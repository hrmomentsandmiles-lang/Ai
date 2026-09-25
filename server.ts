import "dotenv/config";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import express from "express";
import cors from "cors";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 4000;
const SESSION_SECRET =
  process.env.CIVICFLOW_SESSION_SECRET || randomBytes(32).toString("hex");

type AuthenticatedUser = {
  id: string;
  phone: string;
  role: string;
  displayName: string;
  badgeId: string | null;
  department: string | null;
};

type AuthenticatedRequest = Request & {
  authenticatedUser?: AuthenticatedUser;
};

type UserRole = "citizen" | "officer";

type OtpChallenge = {
  phone: string;
  role: UserRole;
  displayName: string;
  code: string;
  expiresAt: number;
};

const otpChallenges = new Map<string, OtpChallenge>();

const signSessionToken = (userId: string): string => {
  const payload = Buffer.from(userId, "utf8").toString("base64url");
  const signature = createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
};

const getUserIdFromSessionToken = (token: string): string | null => {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const userId = Buffer.from(payload, "base64url").toString("utf8");
    return userId || null;
  } catch {
    return null;
  }
};

const getAuthenticatedUser = (req: Request): AuthenticatedUser => {
  const user = (req as AuthenticatedRequest).authenticatedUser;
  if (!user) throw new Error("Authenticated user is missing");
  return user;
};

const requireAuth: RequestHandler = async (req, res, next: NextFunction) => {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const userId = token ? getUserIdFromSessionToken(token) : null;

  if (!userId) {
    res.status(401).json({ success: false, error: "Authentication is required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(401).json({ success: false, error: "Invalid authentication session" });
      return;
    }

    (req as AuthenticatedRequest).authenticatedUser = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ success: false, error: "Unable to validate authentication" });
  }
};

const requireRole = (role: "citizen" | "officer"): RequestHandler => {
  return (req, res, next) => {
    const user = (req as AuthenticatedRequest).authenticatedUser;
    if (!user) {
      res.status(401).json({ success: false, error: "Authentication is required" });
      return;
    }
    if (user.role !== role) {
      res.status(403).json({ success: false, error: "Insufficient permissions" });
      return;
    }
    next();
  };
};

const officerOnly = [requireAuth, requireRole("officer")];
const citizenOnly = [requireAuth, requireRole("citizen")];

const normalizePhone = (phone: unknown): string | null => {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `+91 ${digits.slice(-10)}`;
};

const getRequestedRole = (role: unknown): UserRole | null => {
  return role === "citizen" || role === "officer" ? role : null;
};

const roleConflictMessage = (existingRole: string, requestedRole: UserRole): string => {
  if (existingRole === "citizen" && requestedRole === "officer") {
    return "This phone number is already registered as a citizen.";
  }
  if (existingRole === "officer" && requestedRole === "citizen") {
    return "This phone number is already registered as an officer.";
  }
  return "This phone number is already registered with another role.";
};

const resolveOrCreateUser = async (
  phone: string,
  role: UserRole,
  displayName: string,
) => {
  const existingUser = await prisma.user.findUnique({ where: { phone } });

  if (existingUser && existingUser.role !== role) {
    throw Object.assign(new Error(roleConflictMessage(existingUser.role, role)), {
      statusCode: 403,
    });
  }

  if (existingUser) {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: { displayName: displayName || existingUser.displayName },
    });
  }

  return prisma.user.create({
    data: {
      phone,
      role,
      displayName,
      badgeId: role === "officer" ? "MUNI-FLD-882" : null,
      department: role === "officer" ? "Urban Works & Public Safety" : null,
    },
  });
};

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    service: "CivicFlow API",
    database: "SQLite",
  });
});

app.get("/api/teams", officerOnly, async (_req: Request, res: Response) => {
  try {
    const teams = await prisma.responseTeam.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      success: true,
      teams,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to load response teams",
    });
  }
});

app.get("/api/incidents", officerOnly, async (_req: Request, res: Response) => {
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        analysis: true,
        impacts: {
          include: {
            service: true,
          },
        },
        evidence: true,
        assignments: {
          include: {
            team: true,
          },
        },
        monitoringEvents: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      incidents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to load incidents",
    });
  }
});

app.post("/api/incidents", citizenOnly, async (req: Request, res: Response) => {
  try {
    const {
      citizenId,
      title,
      description,
      category,
      address,
      latitude,
      longitude,
      media,
    } = req.body;

    const authenticatedUser = getAuthenticatedUser(req);

    if (!citizenId || !title || !description || !category || !address) {
      return res.status(400).json({
        success: false,
        error: "citizenId, title, description, category and address are required",
      });
    }
    if (citizenId !== authenticatedUser.id) {
      return res.status(403).json({
        success: false,
        error: "citizenId must match the authenticated citizen",
      });
    }

    const incident = await prisma.incident.create({
      data: {
        id: `CF-${Date.now()}`,
        citizenId: authenticatedUser.id,
        title,
        description,
        category,
        address,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        status: "REPORTED",
        incidentState: "REPORTED",
        analysis: {
          create: {
            severity: category === "Waterlogging" || category === "Traffic" ? "High" : "Medium",
            confidence: 0.94,
            aiSummary: `Deterministic prototype analysis classified this report as ${category}.`,
          },
        },
        evidence: Array.isArray(media) ? {
          create: media
            .filter((item) => item && item.name && item.url && item.type)
            .map((item) => ({
              id: typeof item.id === "string" && item.id ? item.id : undefined,
              name: String(item.name),
              url: String(item.url),
              type: String(item.type),
              size: item.size ? String(item.size) : null,
            })),
        } : undefined,
      },
      include: {
        analysis: true,
        evidence: true,
      },
    });

    res.status(201).json({
      success: true,
      incident,
    });
  } catch (error) {
    console.error("Create incident error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to create incident",
    });
  }
});
// Get incidents for one citizen
app.get("/api/citizens/:citizenId/incidents", requireAuth, async (req, res) => {
  try {
    const { citizenId } = req.params;
    const authenticatedUser = getAuthenticatedUser(req);

    if (authenticatedUser.role === "citizen" && authenticatedUser.id !== citizenId) {
      return res.status(403).json({
        success: false,
        error: "Citizens can only access their own incidents",
      });
    }

    const incidents = await prisma.incident.findMany({
      where: { citizenId },
      include: {
        analysis: true,
        impacts: { include: { service: true } },
        evidence: true,
        responsePlans: true,
        monitoringEvents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      incidents,
    });
  } catch (error) {
    console.error("Citizen incidents error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to load citizen incidents",
    });
  }
});

app.post("/api/users/request-otp", async (req: Request, res: Response) => {
  try {
    const formattedPhone = normalizePhone(req.body.phone);
    const requestedRole = getRequestedRole(req.body.role);
    const displayName = String(req.body.displayName || "").trim();

    if (!formattedPhone || !requestedRole) {
      return res.status(400).json({
        success: false,
        error: "A valid phone and role (citizen or officer) are required",
      });
    }
    if (!displayName) {
      return res.status(400).json({ success: false, error: "displayName is required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { phone: formattedPhone } });
    if (existingUser && existingUser.role !== requestedRole) {
      return res.status(403).json({
        success: false,
        error: roleConflictMessage(existingUser.role, requestedRole),
      });
    }

    const challengeId = randomBytes(18).toString("hex");
    const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    otpChallenges.set(challengeId, {
      phone: formattedPhone,
      role: requestedRole,
      displayName,
      code: mockOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    res.json({
      success: true,
      challengeId,
      mockOtp,
      expiresInSeconds: 300,
    });
  } catch (error) {
    console.error("Request OTP error:", error);
    res.status(500).json({ success: false, error: "Failed to request OTP" });
  }
});

app.post("/api/users/verify-otp", async (req: Request, res: Response) => {
  try {
    const challengeId = String(req.body.challengeId || "");
    const code = String(req.body.otp || "");
    const challenge = otpChallenges.get(challengeId);

    if (!challenge || challenge.expiresAt < Date.now()) {
      otpChallenges.delete(challengeId);
      return res.status(401).json({ success: false, error: "OTP challenge is invalid or expired" });
    }
    if (code !== challenge.code) {
      return res.status(401).json({ success: false, error: "Invalid verification code" });
    }

    const user = await resolveOrCreateUser(
      challenge.phone,
      challenge.role,
      challenge.displayName,
    );
    otpChallenges.delete(challengeId);

    res.json({ success: true, user, sessionToken: signSessionToken(user.id) });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? Number(error.statusCode)
        : 500;
    const message = error instanceof Error ? error.message : "Failed to verify OTP";
    if (statusCode !== 500) {
      res.status(statusCode).json({ success: false, error: message });
      return;
    }
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, error: "Failed to verify OTP" });
  }
});

app.post("/api/users/resolve", async (req: Request, res: Response) => {
  try {
    const formattedPhone = normalizePhone(req.body.phone);
    const requestedRole = getRequestedRole(req.body.role);
    const displayName = String(req.body.displayName || "").trim();

    if (!formattedPhone || !requestedRole) {
      return res.status(400).json({
        success: false,
        error: "A valid phone and role (citizen or officer) are required",
      });
    }
    if (!displayName) {
      return res.status(400).json({ success: false, error: "displayName is required" });
    }

    const user = await resolveOrCreateUser(formattedPhone, requestedRole, displayName);
    res.json({ success: true, user, sessionToken: signSessionToken(user.id) });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? Number(error.statusCode)
        : 500;
    const message = error instanceof Error ? error.message : "Failed to resolve user";
    if (statusCode !== 500) {
      res.status(statusCode).json({ success: false, error: message });
      return;
    }
    console.error("Resolve user error:", error);
    res.status(500).json({ success: false, error: "Failed to resolve user" });
  }
});

// Get one incident
app.get("/api/incidents/:id", requireAuth, async (req, res) => {
  try {
    const authenticatedUser = getAuthenticatedUser(req);
    const incident = await prisma.incident.findUnique({
      where: { id: req.params.id },
      include: {
        citizen: true,
        analysis: true,
        impacts: { include: { service: true } },
        evidence: true,
        responsePlans: true,
        assignments: {
          include: {
            team: true,
          },
        },
        monitoringEvents: true,
        auditEvents: true,
      },
    });

    if (!incident) {
      return res.status(404).json({
        success: false,
        error: "Incident not found",
      });
    }

    if (
      authenticatedUser.role === "citizen" &&
      incident.citizenId !== authenticatedUser.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Citizens can only access their own incidents",
      });
    }

    res.json({
      success: true,
      incident,
    });
  } catch (error) {
    console.error("Incident details error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to load incident",
    });
  }
});


// Update incident state/status
app.patch("/api/incidents/:id/status", officerOnly, async (req: Request, res: Response) => {
  try {
    const authenticatedUser = getAuthenticatedUser(req);
    const { status, incidentState, rejectionReason } = req.body;

    const existing = await prisma.incident.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Incident not found" });
    }

    const isPending = existing.incidentState === "PENDING" || existing.incidentState === "REPORTED";
    const reason = typeof rejectionReason === "string" ? rejectionReason.trim() : "";
    let targetStatus: string;
    let targetState: string;
    let auditAction: string;

    if (incidentState === "APPROVED" && status === "Officer Review" && isPending) {
      targetStatus = "Officer Review";
      targetState = "APPROVED";
      auditAction = "INCIDENT_APPROVED";
    } else if (incidentState === "REJECTED" && status === "Rejected" && isPending && reason) {
      targetStatus = "Rejected";
      targetState = "REJECTED";
      auditAction = "INCIDENT_REJECTED";
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid incident status transition",
      });
    }

    const incident = await prisma.$transaction(async (transaction) => {
      const updated = await transaction.incident.update({
        where: { id: req.params.id },
        data: {
          status: targetStatus,
          incidentState: targetState,
          rejectionReason: targetState === "REJECTED" ? reason : null,
        },
      });
      await transaction.auditEvent.create({
        data: {
          incidentId: req.params.id,
          actorId: authenticatedUser.id,
          action: auditAction,
          details: JSON.stringify({ status: targetStatus, incidentState: targetState }),
        },
      });
      return updated;
    });

    res.json({
      success: true,
      incident,
    });
  } catch (error) {
    console.error("Update incident error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update incident",
    });
  }
});

app.post("/api/incidents/:id/assign", officerOnly, async (req: Request, res: Response) => {
  try {
    const authenticatedUser = getAuthenticatedUser(req);
    const { teamId } = req.body;
    if (!teamId || typeof teamId !== "string") {
      return res.status(400).json({ success: false, error: "teamId is required" });
    }

    const [incident, team] = await Promise.all([
      prisma.incident.findUnique({ where: { id: req.params.id } }),
      prisma.responseTeam.findUnique({ where: { id: teamId } }),
    ]);
    if (!incident) return res.status(404).json({ success: false, error: "Incident not found" });
    if (!team) return res.status(400).json({ success: false, error: "Response team not found" });
    if (incident.incidentState !== "APPROVED") {
      return res.status(400).json({ success: false, error: "Incident must be approved before team assignment" });
    }

    const updated = await prisma.$transaction(async (transaction) => {
      await transaction.responseAssignment.updateMany({
        where: { incidentId: req.params.id, active: true },
        data: { active: false },
      });
      await transaction.responseAssignment.create({
        data: {
          incidentId: req.params.id,
          teamId,
          availability: "Dispatched",
          leadOfficer: team.leadOfficer,
        },
      });
      const result = await transaction.incident.update({
        where: { id: req.params.id },
        data: { status: "Team Assigned", incidentState: "TEAM_ASSIGNED" },
      });
      await transaction.monitoringEvent.create({
        data: {
          incidentId: req.params.id,
          stage: "TEAM_ASSIGNED",
          label: "Assigned",
          note: `${team.name} assigned to incident. Crew dispatched.`,
          completed: true,
        },
      });
      await transaction.auditEvent.create({
        data: { incidentId: req.params.id, actorId: authenticatedUser.id, action: "TEAM_ASSIGNED", details: team.name },
      });
      return result;
    });

    res.json({ success: true, incident: await prisma.incident.findUnique({
      where: { id: updated.id },
      include: { analysis: true, impacts: { include: { service: true } }, evidence: true, assignments: { include: { team: true } }, monitoringEvents: true },
    }) });
  } catch (error) {
    console.error("Assign team error:", error);
    res.status(500).json({ success: false, error: "Failed to assign response team" });
  }
});

app.post("/api/incidents/:id/monitor", officerOnly, async (req: Request, res: Response) => {
  try {
    const authenticatedUser = getAuthenticatedUser(req);
    const incident = await prisma.incident.findUnique({ where: { id: req.params.id } });
    if (!incident) return res.status(404).json({ success: false, error: "Incident not found" });

    const next = {
      TEAM_ASSIGNED: { state: "TEAM_REACHED", status: "In Progress", label: "Team Reached", note: "Response unit on-site. Perimeter secured." },
      TEAM_REACHED: { state: "WORK_STARTED", status: "In Progress", label: "Work Started", note: "Physical repair and mitigation work actively underway." },
      WORK_STARTED: { state: "COMPLETED", status: "Resolved", label: "Completed", note: "Field resolution completed. Quality audit verified." },
    }[incident.incidentState as "TEAM_ASSIGNED" | "TEAM_REACHED" | "WORK_STARTED"];
    if (!next) return res.status(400).json({ success: false, error: "Incident has no pending monitoring transition" });

    const updated = await prisma.$transaction(async (transaction) => {
      const result = await transaction.incident.update({
        where: { id: req.params.id },
        data: { status: next.status, incidentState: next.state },
      });
      await transaction.monitoringEvent.create({
        data: { incidentId: req.params.id, stage: next.state, label: next.label, note: next.note, completed: true },
      });
      await transaction.auditEvent.create({
        data: { incidentId: req.params.id, actorId: authenticatedUser.id, action: "MONITORING_ADVANCED", details: next.state },
      });
      return result;
    });

    res.json({ success: true, incident: await prisma.incident.findUnique({
      where: { id: updated.id },
      include: { analysis: true, impacts: { include: { service: true } }, evidence: true, assignments: { include: { team: true } }, monitoringEvents: true },
    }) });
  } catch (error) {
    console.error("Advance monitoring error:", error);
    res.status(500).json({ success: false, error: "Failed to advance incident monitoring" });
  }
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({ success: false, error: "Malformed JSON request" });
    return;
  }

  console.error("Unhandled API error:", error);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`CivicFlow API running at http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});