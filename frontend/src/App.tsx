import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePages";
import NotFound from "./pages/NotFound";
import AboutPage from "./components/AboutPage";
import TestimonialsPage from "./components/TestimonialsPage";
import FaqPage from "./components/Faq";
import ContactPage from "./components/ContactPage";
import BlogPage from "./components/BlogPage";

// Admin Dashboard Components
import AdminLayout from "./pages/admin/AdminLayout"; // NEW: Import AdminLayout
import BooksManagement from "./pages/admin/BooksManagement"; // NEW: Import BooksManagement
import UsersManagement from "./pages/admin/UserManagement"; // NEW: Import UsersManagement
import AdminRequestsManagement from "./pages/admin/AdminRequestsManagement"; // NEW: Import AdminRequestsManagement

import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import { useState } from 'react';
import React from 'react';

const queryClient = new QueryClient();

// ProtectedRoute component to guard routes
const ProtectedRoute = ({ children, roles }: { children: JSX.Element; roles?: ('ADMIN' | 'USER')[] }) => {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/30">
        <p className="text-lg text-gray-700">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppLayout = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout, isLoadingAuth } = useAuth();

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenAuth={handleOpenAuthModal} /> {/* user and onLogout are now handled inside Navbar */}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage onOpenAuth={handleOpenAuthModal} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/privacy-policy" element={<div className="p-8">Privacy Policy Page Content</div>} />
          <Route path="/terms-of-service" element={<div className="p-8">Terms of Service Page Content</div>} />
          <Route path="/license-info" element={<div className="p-8">License Info Page Content</div>} />

          {/* NEW: Nested routes for Admin Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Default dashboard view (Books Management) */}
            <Route index element={<Navigate to="books" replace />} />
            <Route path="books" element={<BooksManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="admin-requests" element={<AdminRequestsManagement />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;