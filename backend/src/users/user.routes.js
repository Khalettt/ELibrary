// src/users/user.routes.js
import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../auth/auth.middleware.js';
import {
  getAllUsers,
  updateUserStatus,
  getPendingAdminRequests,
  approveAdminRequest,
  rejectAdminRequest
} from './user.controller.js';

const router = Router();

// User Management Routes (Admin only)
router.get('/', authenticateToken, authorizeRoles(['ADMIN']), getAllUsers);
router.put('/:id/status', authenticateToken, authorizeRoles(['ADMIN']), updateUserStatus);

// Admin Request Management Routes (Admin only)
router.get('/admin-requests', authenticateToken, authorizeRoles(['ADMIN']), getPendingAdminRequests);
router.put('/admin-requests/:id/approve', authenticateToken, authorizeRoles(['ADMIN']), approveAdminRequest);
router.put('/admin-requests/:id/reject', authenticateToken, authorizeRoles(['ADMIN']), rejectAdminRequest);

export default router;