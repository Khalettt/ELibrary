// src/users/user.controller.js
import pkg from '@prisma/client';
const { PrismaClient, UserStatus, Role } = pkg;

const prisma = new PrismaClient();

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to retrieve users.', error: error.message });
  }
};

// Update user status (Admin only)
export const updateUserStatus = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { status } = req.body; // Expected: "ACTIVE" or "BLOCKED"

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    if (!Object.values(UserStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user status:', error);
    if (error.code === 'P2025') { // Record not found
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(500).json({ message: 'Failed to update user status.', error: error.message });
  }
};

// Get pending admin requests (Admin only)
export const getPendingAdminRequests = async (req, res) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        status: UserStatus.PENDING_ADMIN_APPROVAL,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true, // Will be 'USER' for pending admins
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending admin requests:', error);
    res.status(500).json({ message: 'Failed to retrieve pending admin requests.', error: error.message });
  }
};

// Approve an admin request (Admin only)
export const approveAdminRequest = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.status !== UserStatus.PENDING_ADMIN_APPROVAL) {
      return res.status(404).json({ message: 'User not found or not a pending admin request.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error approving admin request:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(500).json({ message: 'Failed to approve admin request.', error: error.message });
  }
};

// Reject an admin request (Admin only)
export const rejectAdminRequest = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.status !== UserStatus.PENDING_ADMIN_APPROVAL) {
      return res.status(404).json({ message: 'User not found or not a pending admin request.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: Role.USER, // Revert to regular user role
        status: UserStatus.REJECTED, // Set status to REJECTED
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error rejecting admin request:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(500).json({ message: 'Failed to reject admin request.', error: error.message });
  }
};