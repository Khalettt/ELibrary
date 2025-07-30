// src/auth/auth.middleware.js
import jwt from 'jsonwebtoken';
import pkg from '@prisma/client';
const { PrismaClient, UserStatus } = pkg; // Import UserStatus

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) {
      console.error('JWT Verification Error:', err.message);
      return res.status(403).json({ message: 'Invalid or expired token.', error: err.message });
    }

    try {
      const userIdAsNumber = parseInt(payload.userId, 10);

      if (isNaN(userIdAsNumber) || userIdAsNumber <= 0) {
        console.error('Invalid userId in token: Not a valid positive number. Received:', payload.userId);
        return res.status(403).json({ message: 'Invalid user ID format in token. Please log in again.' });
      }

      console.log('Payload userId from token (parsed to int):', userIdAsNumber, 'Type:', typeof userIdAsNumber);

      const user = await prisma.user.findUnique({
        where: {
          id: userIdAsNumber,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true, // Select status
        }
      });

      if (!user) {
        console.log('User not found for ID from token:', userIdAsNumber);
        return res.status(404).json({ message: 'User not found.' });
      }

      // Check if user is blocked
      if (user.status === UserStatus.BLOCKED) {
        return res.status(403).json({ message: 'Your account has been blocked.' });
      }

      req.user = user;
      next();
    } catch (dbError) {
      console.error('Database Error in authenticateToken:', dbError);
      if (dbError.code === 'P2032' || dbError.code === 'P2009') {
          return res.status(403).json({ message: 'Database ID type mismatch. Please log in again and ensure your Prisma schema is up-to-date.' });
      }
      res.status(500).json({ message: 'Internal server error during authentication.' });
    }
  });
};

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }
    next();
  };
};