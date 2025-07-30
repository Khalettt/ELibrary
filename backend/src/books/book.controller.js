// src/books/book.controller.js
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Zod schema for book validation
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  pages: z.preprocess(Number, z.number().int().positive("Pages must be a positive number")),
  price: z.preprocess(Number, z.number().min(0, "Price cannot be negative")),
  isbn: z.string().regex(/^(?:ISBN(?:-13)?:?)(?=[0-9]{13}$)\d{3}-?\d{10}$|^([0-9]{9}X|[0-9]{10})$/, 'Invalid ISBN format').optional().or(z.literal('')),
  is_premium: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
});

// Multer storage configuration for book files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    const coversDir = path.join(uploadDir, 'covers');
    const pdfsDir = path.join(uploadDir, 'pdfs');

    // Ensure directories exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    if (!fs.existsSync(coversDir)) {
      fs.mkdirSync(coversDir, { recursive: true });
    }
    if (!fs.existsSync(pdfsDir)) {
      fs.mkdirSync(pdfsDir, { recursive: true });
    }

    if (file.fieldname === 'coverImage') {
      cb(null, coversDir);
    } else if (file.fieldname === 'bookFile') {
      cb(null, pdfsDir);
    } else {
      cb(new Error('Invalid field name for file upload'), '');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadBookCover = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for books (PDFs)
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'coverImage') {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed for cover image!'), false);
      }
    } else if (file.fieldname === 'bookFile') {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed for book file!'), false);
      }
    }
    cb(null, true);
  },
}).fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'bookFile', maxCount: 1 }
]);

// Helper function to delete files
const deleteFile = (filePath) => {
  if (filePath && !filePath.includes('unsplash.com')) { // Avoid deleting external images
    const fullPath = path.join(__dirname, '../../', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted file: ${fullPath}`);
    }
  }
};

// Create a new book
export const createBook = async (req, res) => {
  try {
    const validatedData = bookSchema.parse(req.body);
    const files = req.files;
    const coverImage = files && typeof files === 'object' && 'coverImage' in files ? files.coverImage[0] : undefined;
    const bookPdf = files && typeof files === 'object' && 'bookFile' in files ? files.bookFile[0] : undefined;

    if (!coverImage) {
      if (bookPdf) deleteFile(bookPdf.path);
      return res.status(400).json({ message: 'Cover image is required.' });
    }

    if (!validatedData.is_premium && !bookPdf) {
      if (coverImage) deleteFile(coverImage.path);
      return res.status(400).json({ message: 'Book file (PDF) is required for free books.' });
    }

    const cover_image_url = `/uploads/covers/${coverImage.filename}`;
    const file_url = bookPdf ? `/uploads/pdfs/${bookPdf.filename}` : null;

    const newBook = await prisma.book.create({
      data: {
        ...validatedData,
        cover_image_url,
        file_url,
        publication_date: new Date().toISOString().split('T')[0],
        price: validatedData.price,
        isbn: validatedData.isbn || null,
      },
    });
    res.status(201).json(newBook);
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (req.files) {
        const files = req.files;
        const uploadedCover = files && typeof files === 'object' && 'coverImage' in files ? files.coverImage[0] : undefined;
        const uploadedBook = files && typeof files === 'object' && 'bookFile' in files ? files.bookFile[0] : undefined;

        if (uploadedCover) deleteFile(uploadedCover.path);
        if (uploadedBook) deleteFile(uploadedBook.path);
      }
      console.error('Zod Validation Error:', error.errors);
      return res.status(400).json({ errors: error.errors, message: 'Validation failed' });
    }
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Failed to create book.', error: error.message });
  }
};

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to retrieve books.', error: error.message });
  }
};

// Get book by ID
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id },
    });
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ message: 'Failed to retrieve book.', error: error.message });
  }
};

// Update a book
export const updateBook = async (req, res) => {
  const { id } = req.params;
  try {
    const validatedData = bookSchema.parse(req.body);

    const files = req.files;
    const coverImage = files && typeof files === 'object' && 'coverImage' in files ? files.coverImage[0] : undefined;
    const bookPdf = files && typeof files === 'object' && 'bookFile' in files ? files.bookFile[0] : undefined;

    const existingBook = await prisma.book.findUnique({ where: { id } });
    if (!existingBook) {
      if (coverImage) deleteFile(coverImage.path);
      if (bookPdf) deleteFile(bookPdf.path);
      return res.status(404).json({ message: 'Book not found.' });
    }

    let cover_image_url = existingBook.cover_image_url;
    if (coverImage) {
      deleteFile(existingBook.cover_image_url);
      cover_image_url = `/uploads/covers/${coverImage.filename}`;
    }

    let file_url = existingBook.file_url;
    if (bookPdf) {
      if (existingBook.file_url) deleteFile(existingBook.file_url);
      file_url = `/uploads/pdfs/${bookPdf.filename}`;
    } else if (!validatedData.is_premium) {
      if (!existingBook.file_url) {
        return res.status(400).json({ message: 'Book file (PDF) is required for free books if not already present and no new file uploaded.' });
      }
    } else if (validatedData.is_premium && existingBook.file_url && !bookPdf) {
      deleteFile(existingBook.file_url);
      file_url = null;
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        ...validatedData,
        cover_image_url,
        file_url,
        price: validatedData.price,
        isbn: validatedData.isbn || null,
      },
    });
    res.status(200).json(updatedBook);
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (req.files) {
        const files = req.files;
        const uploadedCover = files && typeof files === 'object' && 'coverImage' in files ? files.coverImage[0] : undefined;
        const uploadedBook = files && typeof files === 'object' && 'bookFile' in files ? files.bookFile[0] : undefined;

        if (uploadedCover) deleteFile(uploadedCover.path);
        if (uploadedBook) deleteFile(uploadedBook.path);
      }
      console.error('Zod Validation Error:', error.errors);
      return res.status(400).json({ errors: error.errors, message: 'Validation failed' });
    }
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book.', error: error.message });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const existingBook = await prisma.book.findUnique({ where: { id } });
    if (!existingBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    deleteFile(existingBook.cover_image_url);
    deleteFile(existingBook.file_url);

    await prisma.book.delete({ where: { id } });
    res.status(200).json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book.', error: error.message });
  }
};

// Download book functionality
export const downloadBook = async (req, res) => {
  try {
    const { id } = req.params;
    // req.user is available here due to authenticateToken middleware
    const userId = req.user?.id; // Assuming user ID is available in req.user

    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book || !book.file_url) {
      return res.status(404).json({ message: 'Book file not found or not available for download.' });
    }

    // IMPORTANT LOGIC: Only allow download if the book is FREE
    // For premium books, you'd add logic here to check if the `userId` has purchased this `book.id`.
    if (book.is_premium) {
      // Future: Check if user has purchased this book (e.g., from a 'Purchase' table)
      // const userHasPurchased = await prisma.purchase.findFirst({
      //   where: {
      //     userId: userId,
      //     bookId: book.id,
      //     status: 'completed'
      //   }
      // });
      // if (!userHasPurchased) {
      return res.status(403).json({ message: 'This is a premium book. Please purchase it to download.' });
      // }
    }

    const filePath = path.join(__dirname, '../../', book.file_url);

    if (!fs.existsSync(filePath)) {
      console.error(`File not found at: ${filePath}`);
      return res.status(404).json({ message: 'Book file does not exist on server.' });
    }

    res.download(filePath, book.title + path.extname(filePath), (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (res.headersSent) {
          console.error("Headers already sent for download error. Could not send new error response.");
          return;
        }
        res.status(500).json({ message: 'Could not download the book.' });
      }
    });
  } catch (error) {
    console.error('Error in downloadBook:', error);
    res.status(500).json({ message: 'Internal server error during download.', error: error.message });
  }
};