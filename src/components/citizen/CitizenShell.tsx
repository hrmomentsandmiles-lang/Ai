import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { ReportsProvider } from '../../context/ReportsContext';
import { CitizenDashboard } from './CitizenDashboard';
import { ReportForm } from './ReportForm';
import { MyReports } from './MyReports';
import { ReportDetails } from './ReportDetails';
import { CitizenProfile } from './CitizenProfile';

export const CitizenShell: React.FC = () => {
  const { session } = useAuth();
  const { pathname, navigate } = useRouter();

  // Route protection: If not logged in as citizen, redirect to /login
  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }
    if (session.role === 'officer') {
      navigate('/officer');
      return;
    }
  }, [session, navigate]);

  if (!session || session.role !== 'citizen') {
    return null;
  }

  // Sub-route matching within /citizen
  const renderCitizenContent = () => {
    // Exact routes
    if (pathname === '/citizen/report') {
      return <ReportForm />;
    }

    if (pathname === '/citizen/reports') {
      return <MyReports />;
    }

    if (pathname.startsWith('/citizen/reports/')) {
      const reportId = pathname.replace('/citizen/reports/', '').trim();
      return <ReportDetails reportId={reportId} />;
    }

    if (pathname === '/citizen/profile') {
      return <CitizenProfile />;
    }

    // Default to /citizen/dashboard
    return <CitizenDashboard />;
  };

  return (
    <ReportsProvider>
      <div className="w-full flex-1 flex flex-col py-2 sm:py-4">
        {renderCitizenContent()}
      </div>
    </ReportsProvider>
  );
};
