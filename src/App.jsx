import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import AboutPage from './pages/AboutPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import DestinationDetailPage from './pages/DestinationDetailPage.jsx';
import DestinationsPage from './pages/DestinationsPage.jsx';
import ExperienceDetailPage from './pages/ExperienceDetailPage.jsx';
import ExperiencesPage from './pages/ExperiencesPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PolicyPage from './pages/PolicyPage.jsx';
import SafetyPage from './pages/SafetyPage.jsx';
import StoriesPage from './pages/StoriesPage.jsx';
import StoryDetailPage from './pages/StoryDetailPage.jsx';

const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const AdminInquiries = lazy(() => import('./pages/AdminInquiries.jsx'));
const AdminTravelers = lazy(() => import('./pages/AdminTravelers.jsx'));
const AdminPackages = lazy(() => import('./pages/AdminPackages.jsx'));
const AdminCalendar = lazy(() => import('./pages/AdminCalendar.jsx'));
const AdminSettings = lazy(() => import('./pages/AdminSettings.jsx'));

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/experiences/:slug" element={<ExperienceDetailPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/stories/:slug" element={<StoryDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/privacy" element={<PolicyPage />} />
            <Route path="/terms" element={<PolicyPage />} />
            <Route path="/cancellation" element={<PolicyPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Admin Section (Independent of AppShell) */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="admin-loading-screen">Waking up admin services...</div>}>
                <AdminPage />
              </Suspense>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="travelers" element={<AdminTravelers />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
