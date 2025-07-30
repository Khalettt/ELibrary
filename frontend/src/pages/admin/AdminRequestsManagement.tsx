// src/pages/admin/AdminRequestsManagement.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { User } from '../../types/user';
import { Check, X } from 'lucide-react';

const AdminRequestsManagement = () => {
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { authToken, logout } = useAuth();

  const API_BASE_URL = 'http://localhost:3000/api';

  useEffect(() => {
    fetchPendingRequests();
  }, [authToken]);

  const fetchPendingRequests = async () => {
    if (!authToken) {
      toast({ title: "Unauthorized", description: "Please log in again.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/admin-requests`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Access Denied",
            description: "You are not authorized to view admin requests, or your session has expired.",
            variant: "destructive",
          });
          logout();
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch admin requests: ${response.statusText}`);
      }
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      toast({
        title: "Error fetching admin requests",
        description: error.message || "Could not load admin requests from the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveReject = async (userId: number, action: 'approve' | 'reject') => {
    if (!authToken) {
      toast({ title: "Unauthorized", description: "Please log in again.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/admin-requests/${userId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Access Denied",
            description: "You are not authorized to perform this action, or your session has expired.",
            variant: "destructive",
          });
          logout();
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} admin request: ${response.statusText}`);
      }

      toast({
        title: `Admin Request ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `User ${userId}'s admin request has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
      });
      fetchPendingRequests(); // Re-fetch requests
    } catch (error) {
      toast({
        title: `Failed to ${action} request`,
        description: error.message || `An error occurred while ${action}ing the request.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Requests</CardTitle>
        <CardDescription>Review and approve or reject pending admin registrations.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading pending requests...</div>
        ) : pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No pending admin requests.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Requested On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveReject(user.id, 'approve')}
                          disabled={isLoading}
                        >
                          <Check className="w-4 h-4 mr-2" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproveReject(user.id, 'reject')}
                          disabled={isLoading}
                        >
                          <X className="w-4 h-4 mr-2" /> Reject
                        </Button>
                      </div>
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

export default AdminRequestsManagement;