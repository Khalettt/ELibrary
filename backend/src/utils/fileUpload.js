// src/utils/fileUpload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const createUploadDirs = () => {
  const coversDir = path.join(__dirname, '../../uploads/covers');
  const pdfsDir = path.join(__dirname, '../../uploads/pdfs');
  if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
  }
  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
  }
};

createUploadDirs(); // Call once on startup

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'coverImage') {
      cb(null, 'uploads/covers/');
    } else if (file.fieldname === 'bookFile') {
      cb(null, 'uploads/pdfs/');
    } else {
      cb(new Error('Invalid field name for file upload'), '');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverImage') {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed for coverImage!'), false);
    }
  } else if (file.fieldname === 'bookFile') {
    // Accept PDFs only
    if (!file.originalname.match(/\.(pdf)$/i)) {
      return cb(new Error('Only PDF files are allowed for bookFile!'), false);
    }
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50 MB file size limit for PDFs, covers are smaller
  }
});