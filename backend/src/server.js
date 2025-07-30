// src/app.js (ama index.js/server.js)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import bookRoutes from './books/book.routes.js';
import authRoutes from "./routes/auth.js"; // HAGAAJIN: Jidka saxda ah
import userRoutes from './users/user.routes.js';

dotenv.config();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // Allow your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes for authentication
app.use('/api/auth', authRoutes);

// Routes for books
app.use('/api/books', bookRoutes);

// Routes for users and admin requests
app.use('/api/users', userRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Welcome to the ELibrary Backend API!");
});

// Global error handler
// Note: 'z' and 'multer' are not imported here, so these checks might cause errors
// if they are not globally available or imported in this file.
// For now, I'm keeping them as you provided, but be aware.
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  // if (err instanceof z.ZodError) { // Zod is not imported in app.js
  //   return res.status(400).json({ message: 'Validation error in request body.', errors: err.errors });
  // }
  // if (err instanceof multer.MulterError) { // Multer is not imported in app.js
  //   return res.status(400).json({ message: `File upload error: ${err.message}` });
  // }
  res.status(500).send({ message: 'Something broke!', error: err.message || 'Unknown server error.' });
});

// Connect to DB and start server
async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  } finally {
    process.on('beforeExit', async () => {
      await prisma.$disconnect();
    });
    process.on('SIGINT', async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
    process.on('SIGTERM', async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }
}

main();
