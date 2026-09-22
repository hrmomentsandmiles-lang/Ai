import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CivicReport, ResponseTeamId } from '../types/report';
import {
  getStoredReports,
  createNewReport as createReportInStorage,
  getReportById as findReportById,
  approveIncidentInStorage,
  rejectIncidentInStorage,
  assignTeamInStorage,
  advanceMonitoringInStorage,
} from '../services/reportService';

interface ReportsContextType {
  reports: CivicReport[];
  refreshReports: () => void;
  getReport: (id: string) => CivicReport | undefined;
  addReport: (
    data: Omit<CivicReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => CivicReport;
  approveIncident: (id: string) => CivicReport | undefined;
  rejectIncident: (id: string, reason: string) => CivicReport | undefined;
  assignTeam: (
    id: string,
    teamId: ResponseTeamId | string,
    teamName: string
  ) => CivicReport | undefined;
  advanceMonitoring: (id: string) => CivicReport | undefined;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<CivicReport[]>([]);

  const refreshReports = useCallback(() => {
    setReports(getStoredReports());
  }, []);

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  const getReport = useCallback((id: string): CivicReport | undefined => {
    return findReportById(id);
  }, []);

  const addReport = useCallback(
    (
      data: Omit<CivicReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
    ): CivicReport => {
      const created = createReportInStorage(data);
      refreshReports();
      return created;
    },
    [refreshReports]
  );

  const approveIncident = useCallback(
    (id: string): CivicReport | undefined => {
      const updated = approveIncidentInStorage(id);
      refreshReports();
      return updated;
    },
    [refreshReports]
  );

  const rejectIncident = useCallback(
    (id: string, reason: string): CivicReport | undefined => {
      const updated = rejectIncidentInStorage(id, reason);
      refreshReports();
      return updated;
    },
    [refreshReports]
  );

  const assignTeam = useCallback(
    (
      id: string,
      teamId: ResponseTeamId | string,
      teamName: string
    ): CivicReport | undefined => {
      const updated = assignTeamInStorage(id, teamId, teamName);
      refreshReports();
      return updated;
    },
    [refreshReports]
  );

  const advanceMonitoring = useCallback(
    (id: string): CivicReport | undefined => {
      const updated = advanceMonitoringInStorage(id);
      refreshReports();
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
