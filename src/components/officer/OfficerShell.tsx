import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { ReportsProvider } from '../../context/ReportsContext';
import { OfficerDashboard } from './OfficerDashboard';
import { IncidentDetails } from './IncidentDetails';
import { AssignTeamPage } from './AssignTeamPage';
import { MonitoringPage } from './MonitoringPage';
import { OfficerProfile } from './OfficerProfile';

export const OfficerShell: React.FC = () => {
  const { session } = useAuth();
  const { pathname, navigate } = useRouter();

  // Authentication Boundary: enforce officer role
  useEffect(() => {
    if (!session) {
      navigate('/login');
    } else if (session.role === 'citizen') {
      navigate('/citizen/dashboard');
    }
  }, [session, navigate]);

  if (!session || session.role !== 'officer') {
    return null;
  }

  // Parse Subroutes
  // 1. /officer/incidents/:id/monitor
  const monitorMatch = pathname.match(/^\/officer\/incidents\/([^/]+)\/monitor\/?$/);
  if (monitorMatch) {
    const incidentId = monitorMatch[1];
    return (
      <ReportsProvider>
        <MonitoringPage incidentId={incidentId} />
      </ReportsProvider>
    );
  }

  // 2. /officer/incidents/:id/assign
  const assignMatch = pathname.match(/^\/officer\/incidents\/([^/]+)\/assign\/?$/);
  if (assignMatch) {
    const incidentId = assignMatch[1];
    return (
      <ReportsProvider>
        <AssignTeamPage incidentId={incidentId} />
      </ReportsProvider>
    );
  }

  // 3. /officer/incidents/:id
  const incidentMatch = pathname.match(/^\/officer\/incidents\/([^/]+)\/?$/);
  if (incidentMatch) {
    const incidentId = incidentMatch[1];
    return (
      <ReportsProvider>
        <IncidentDetails incidentId={incidentId} />
      </ReportsProvider>
    );
  }

  // 4. /officer/profile
  if (pathname === '/officer/profile') {
    return (
      <ReportsProvider>
        <OfficerProfile />
      </ReportsProvider>
    );
  }

  // 5. /officer/dashboard or /officer or /officer/incidents
  return (
    <ReportsProvider>
      <OfficerDashboard />
    </ReportsProvider>
  );
};
