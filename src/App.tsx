/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/public/HomePage';
import { AboutPage } from './components/public/AboutPage';
import { SupportPage } from './components/public/SupportPage';
import { ContactPage } from './components/public/ContactPage';
import { LoginPage } from './components/public/LoginPage';
import { CitizenShell } from './components/citizen/CitizenShell';
import { OfficerShell } from './components/officer/OfficerShell';

const AppContent: React.FC = () => {
  const { pathname } = useRouter();

  // Route matching with public pages and authenticated shells
  const renderRoute = () => {
    if (pathname.startsWith('/citizen')) {
      return <CitizenShell />;
    }

    switch (pathname) {
      case '/about':
        return <AboutPage />;
      case '/support':
        return <SupportPage />;
      case '/contact':
        return <ContactPage />;
      case '/login':
        return <LoginPage />;
      case '/officer':
        return <OfficerShell />;
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
