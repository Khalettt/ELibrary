// types/books.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_image_url: string; // Corrected from cover_image
  price: number; // 0 for free books, in cents (integer)
  is_premium: boolean;
  category: string;
  pages: number;
  publication_date: string;
  isbn: string | null; // Can be null in DB
  file_url?: string; // for downloadable content, can be undefined/null
  createdAt: string; // Corrected from created_at (Prisma uses camelCase)
  updatedAt: string; // Corrected from updated_at (Prisma uses camelCase)
}

export type BookCategory = "FICTION" | "NON_FICTION" | "SCIENCE" | "HISTORY" | "TECHNOLOGY" | "BUSINESS" | "ART" | "HEALTH" | "BIOGRAPHY" | "OTHER";


export interface User {
  id: string;
  name?: string; // Added from Prisma schema
  email: string;
  role: 'USER' | 'ADMIN'; // Matched with Prisma enum
  createdAt: string; // Corrected from created_at
  updatedAt: string; // Added from Prisma schema
}

export interface Purchase {
  id: string;
  userId: string; // Corrected from user_id
  bookId: string; // Corrected from book_id
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  stripeSessionId?: string; // Corrected from stripe_session_id
  createdAt: string; // Corrected from created_at
}