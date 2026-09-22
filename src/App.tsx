/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/public/HomePage';
import { AboutPage } from './components/public/AboutPage';
import { SupportPage } from './components/public/SupportPage';
import { ContactPage } from './components/public/ContactPage';
import { LoginPage } from './components/public/LoginPage';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { ReportIssuePage } from './components/citizen/ReportIssuePage';
import { MyReportsPage } from './components/citizen/MyReportsPage';
import { ReportDetailsPage } from './components/citizen/ReportDetailsPage';
import { CitizenProfilePage } from './components/citizen/CitizenProfilePage';
import { OfficerShell } from './components/officer/OfficerShell';

const AppContent: React.FC = () => {
  const { pathname } = useRouter();
  const { session } = useAuth();

  // Route matching with public pages and authenticated shells
  const renderRoute = () => {
    // Protected Citizen Routes Check
    if (pathname.startsWith('/citizen')) {
      if (!session) {
        return <LoginPage />;
      }

      if (pathname === '/citizen/report') {
        return <ReportIssuePage />;
      }
      if (pathname === '/citizen/reports') {
        return <MyReportsPage />;
      }
      if (pathname.startsWith('/citizen/reports/')) {
        const reportId = pathname.replace('/citizen/reports/', '').split('/')[0];
        return <ReportDetailsPage reportId={reportId} />;
      }
      if (pathname === '/citizen/profile') {
        return <CitizenProfilePage />;
      }
      // Default citizen path: /citizen or /citizen/dashboard
      return <CitizenDashboard />;
    }

    // Protected Officer Route
    if (pathname.startsWith('/officer')) {
      if (!session) {
        return <LoginPage />;
      }
      return <OfficerShell />;
    }

    // Public Routes
    switch (pathname) {
      case '/about':
        return <AboutPage />;
      case '/support':
        return <SupportPage />;
      case '/contact':
        return <ContactPage />;
      case '/login':
        return <LoginPage />;
      case '/':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#182315] selection:bg-[#4D602B] selection:text-white font-sans antialiased">
      <Header />
      <main className="flex-1 flex flex-col">
        {renderRoute()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RouterProvider>
  );
}
