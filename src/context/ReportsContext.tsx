import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CivicReport, ResponseTeamId } from '../types/report';
import { useAuth } from './AuthContext';
import {
  advanceMonitoring as advanceMonitoringInApi,
  approveIncident as approveIncidentInApi,
  assignTeam as assignTeamInApi,
  createIncident,
  getCitizenIncidents,
  getIncident,
  getIncidents,
  rejectIncident as rejectIncidentInApi,
} from '../services/incidentApi';

interface ReportsContextType {
  reports: CivicReport[];
  refreshReports: () => Promise<void>;
  getReport: (id: string) => CivicReport | undefined;
  addReport: (
    data: Omit<CivicReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => Promise<CivicReport>;
  approveIncident: (id: string) => Promise<CivicReport>;
  rejectIncident: (id: string, reason: string) => Promise<CivicReport>;
  assignTeam: (
    id: string,
    teamId: ResponseTeamId | string,
    teamName: string
  ) => Promise<CivicReport>;
  advanceMonitoring: (id: string) => Promise<CivicReport>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<CivicReport[]>([]);
  const { session } = useAuth();

  const refreshReports = useCallback(async () => {
    if (!session) {
      setReports([]);
      return;
    }
    const nextReports = session.role === 'citizen'
      ? await getCitizenIncidents(session.userId)
      : await getIncidents();
    setReports(nextReports);
  }, [session]);

  useEffect(() => {
    void refreshReports().catch((error: unknown) => {
      console.error('Failed to load incidents:', error);
      setReports([]);
    });
  }, [refreshReports]);

  const getReport = useCallback((id: string): CivicReport | undefined => {
    return reports.find((report) => report.id === id);
  }, [reports]);

  const addReport = useCallback(
    async (
      data: Omit<CivicReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
    ): Promise<CivicReport> => {
      const created = await createIncident({
        citizenId: data.citizenId,
        title: data.title,
        description: data.description,
        category: data.category,
        address: data.location.address,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        media: data.media,
      });
      await refreshReports();
      return created;
    },
    [refreshReports]
  );

  const approveIncident = useCallback(
    async (id: string): Promise<CivicReport> => {
      const updated = await approveIncidentInApi(id);
      await refreshReports();
      return updated;
    },
    [refreshReports]
  );

  const rejectIncident = useCallback(
    async (id: string, reason: string): Promise<CivicReport> => {
      const updated = await rejectIncidentInApi(id, reason);
      await refreshReports();
      return updated;
    },
    [refreshReports]
  );

  const assignTeam = useCallback(
    async (
      id: string,
      teamId: ResponseTeamId | string,
      teamName: string
    ): Promise<CivicReport> => {
      const updated = await assignTeamInApi(id, teamId);
      await refreshReports();
      return updated;
    },
    [refreshReports]
  );

  const advanceMonitoring = useCallback(
    async (id: string): Promise<CivicReport> => {
      const updated = await advanceMonitoringInApi(id);
      await refreshReports();
      return updated;
    },
    [refreshReports]
  );

  return (
    <ReportsContext.Provider
      value={{
        reports,
        refreshReports,
        getReport,
        addReport,
        approveIncident,
        rejectIncident,
        assignTeam,
        advanceMonitoring,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};
