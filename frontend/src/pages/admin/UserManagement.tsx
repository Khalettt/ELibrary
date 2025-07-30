// src/pages/admin/UsersManagement.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/user'; // Create this type if it doesn't exist
import { Ban, CheckCircle } from 'lucide-react';

// Define a basic User type if you don't have one yet
// src/types/user.d.ts
// export interface User {
//   id: number;
//   name?: string;
//   email: string;
//   role: 'USER' | 'ADMIN';
//   status: 'ACTIVE' | 'BLOCKED' | 'PENDING_ADMIN_APPROVAL' | 'REJECTED';
//   createdAt: string;
// }

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { authToken, logout } = useAuth();

  const API_BASE_URL = 'http://localhost:3000/api';

  useEffect(() => {
    fetchUsers();
  }, [authToken]);

  const fetchUsers = async () => {
    if (!authToken) {
      toast({ title: "Unauthorized", description: "Please log in again.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Access Denied",
            description: "You are not authorized to view users, or your session has expired.",
            variant: "destructive",
          });
          logout();
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch users: ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      toast({
        title: "Error fetching users",
        description: error.message || "Could not load users from the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBlockStatus = async (userId: number, currentStatus: User['status']) => {
    if (!authToken) {
      toast({ title: "Unauthorized", description: "Please log in again.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Access Denied",
            description: "You are not authorized to change user status, or your session has expired.",
            variant: "destructive",
          });
          logout();
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update user status: ${response.statusText}`);
      }

      toast({
        title: "User Status Updated",
        description: `User ${userId} is now ${newStatus}.`,
      });
      fetchUsers(); // Re-fetch users to update the list
    } catch (error: any) {
      toast({
        title: "Failed to Update Status",
        description: error.message || "An error occurred while updating user status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>View and manage all registered users.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'ACTIVE' ? 'outline' : user.status === 'BLOCKED' ? 'destructive' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {user.role !== 'ADMIN' && user.status !== 'PENDING_ADMIN_APPROVAL' && ( // Admins cannot block other admins or pending admins
                        <Button
                          size="sm"
                          variant={user.status === 'ACTIVE' ? 'destructive' : 'default'}
                          onClick={() => handleToggleBlockStatus(user.id, user.status)}
                          disabled={isLoading}
                        >
                          {user.status === 'ACTIVE' ? <Ban className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                          {user.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersManagement;