import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CivicReport } from '../types/report';
import {
  getStoredReports,
  createNewReport as createReportInStorage,
  getReportById as findReportById,
} from '../services/reportService';

interface ReportsContextType {
  reports: CivicReport[];
  refreshReports: () => void;
  getReport: (id: string) => CivicReport | undefined;
  addReport: (
    data: Omit<CivicReport, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => CivicReport;
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

  return (
    <ReportsContext.Provider
      value={{
        reports,
        refreshReports,
        getReport,
        addReport,
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
