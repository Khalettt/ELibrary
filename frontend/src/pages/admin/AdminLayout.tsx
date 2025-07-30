// src/pages/admin/AdminLayout.tsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, UserCheck, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const AdminLayout = () => {
  const { user, logout, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/30">
        <p className="text-lg text-gray-700">Loading user permissions...</p>
      </div>
    );
  }

  // Redirect if not authenticated or not an admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/30">
        <Card className="p-8 text-center shadow-lg">
          <CardTitle className="text-3xl font-bold text-red-600 mb-4">Access Denied</CardTitle>
          <CardDescription className="text-lg text-gray-700">
            You do not have administrative privileges to view this page.
          </CardDescription>
          <Button onClick={logout} className="mt-6 bg-gradient-premium">
            Go to Home / Login
          </Button>
        </Card>
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Books Management', path: '/dashboard/books', icon: BookOpen },
    { name: 'Users Management', path: '/dashboard/users', icon: Users },
    { name: 'Admin Requests', path: '/dashboard/admin-requests', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your E-Library platform</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.name || user?.email}</span>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r p-4 hidden md:block">
          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center p-3 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <link.icon className="w-5 h-5 mr-3" />
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet /> {/* This is where nested routes will render */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;