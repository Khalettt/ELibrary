// src/auth/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import pkg from '@prisma/client';
const { PrismaClient, Role, UserStatus } = pkg; // Import UserStatus

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').optional(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'ADMIN'], { message: 'Invalid role' }).default('USER'),
});

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await prisma.user.count();
    let finalRole = role;
    let finalStatus = UserStatus.ACTIVE;

    if (userCount === 0) {
      // First user is always ADMIN and ACTIVE
      finalRole = Role.ADMIN;
      finalStatus = UserStatus.ACTIVE;
    } else if (role === Role.ADMIN) {
      // If not the first user and role is ADMIN, set status to PENDING_ADMIN_APPROVAL
      finalStatus = UserStatus.PENDING_ADMIN_APPROVAL;
      finalRole = Role.USER; // Temporarily set role to USER until approved
      console.log(`User ${email} registered as PENDING_ADMIN_APPROVAL.`);
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: finalRole,
        status: finalStatus, // Set the status
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true, // Select status
        createdAt: true,
      },
    });

    const token = jwt.sign({ userId: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, status: newUser.status }, JWT_SECRET, { expiresIn: '365d' });

    res.status(201).json({ message: 'User registered successfully', token, user: newUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors, message: 'Validation failed' });
    }
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    console.log('Attempting to find user by email:', email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Check user status before allowing login
    if (user.status === UserStatus.BLOCKED) {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
    }
    if (user.status === UserStatus.PENDING_ADMIN_APPROVAL) {
      return res.status(403).json({ message: 'Your admin request is pending approval. Please wait for an administrator to review it.' });
    }
    if (user.status === UserStatus.REJECTED) {
      return res.status(403).json({ message: 'Your admin request was rejected. You can login as a regular user or contact support.' });
    }


    console.log('User found:', user.email, 'User ID type:', typeof user.id, 'User ID value:', user.id);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, name: user.name, role: user.role, status: user.status }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors, message: 'Validation failed' });
    }
    console.error('Error during login:', error);
    if (error.code === 'P2032' || error.code === 'P2009') {
        return res.status(500).json({ message: 'Database ID type mismatch during login. Please ensure your Prisma schema matches your actual database structure and rerun migrations.' });
    }
    res.status(500).json({ message: 'Internal server error during login.' });
  }
};