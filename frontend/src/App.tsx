import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WardrobeProvider } from './contexts/WardrobeContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import FashionBackground from './components/FashionBackground';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import BoltBadge from './components/BoltBadge';

// Lazy-loaded components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WardrobePage = lazy(() => import('./pages/WardrobePage'));
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));

// Loading component
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SubscriptionProvider>
          <WardrobeProvider>
            <Router>
              <div className="min-h-screen relative">
                {/* Global Fashion Background */}
                <FashionBackground />
                
                {/* Navigation */}
                <Navbar />
                
                {/* Main Content */}
                <main className="relative z-10">
                  <ErrorBoundary>
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        
                        {/* Protected Routes */}
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <DashboardPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <ProfilePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/wardrobe"
                          element={
                            <ProtectedRoute>
                              <WardrobePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/recommendations"
                          element={
                            <ProtectedRoute>
                              <RecommendationsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/marketplace"
                          element={
                            <ProtectedRoute>
                              <MarketplacePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/community"
                          element={
                            <ProtectedRoute>
                              <CommunityPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/subscription"
                          element={
                            <ProtectedRoute>
                              <SubscriptionPage />
                            </ProtectedRoute>
                          }
                        />
                        
                        {/* Catch all route - redirect to landing page */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>
                
                {/* Toast Notifications */}
                <Toaster position="top-right" />
                
                {/* Bolt.new Badge */}
                <BoltBadge position="bottom-right" />
              </div>
            </Router>
          </WardrobeProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
