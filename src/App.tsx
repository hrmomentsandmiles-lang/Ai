/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { CitizenShell } from './components/citizen/CitizenShell';
import { OfficerShell } from './components/officer/OfficerShell';

const AppContent: React.FC = () => {
  const { pathname } = useRouter();

  // Route matching
  const renderRoute = () => {
    switch (pathname) {
      case '/citizen':
        return <CitizenShell />;
      case '/officer':
        return <OfficerShell />;
      case '/':
      case '/login':
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 text-slate-900 selection:bg-slate-900 selection:text-white font-sans antialiased">
      <Header />
      <main className="flex-1 flex flex-col justify-center">
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
