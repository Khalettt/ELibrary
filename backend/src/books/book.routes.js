// src/books/book.routes.js
import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../auth/auth.middleware.js'; // Hubi jidkan
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  uploadBookCover, // This is your multer middleware
  downloadBook
} from './book.controller.js'; // Hubi jidkan

const router = Router();

// Public routes (no authentication needed)
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Protected routes (require authentication and specific roles)
router.post('/', authenticateToken, authorizeRoles(['ADMIN']), uploadBookCover, createBook);
router.put('/:id', authenticateToken, authorizeRoles(['ADMIN']), uploadBookCover, updateBook);
router.delete('/:id', authenticateToken, authorizeRoles(['ADMIN']), deleteBook);

// Protected download route: User must be authenticated to download any book.
// The controller will then check if the book is free or if the user has purchased it (future logic).
router.get('/download/:id', authenticateToken, downloadBook); // ADDED authenticateToken

export default router;