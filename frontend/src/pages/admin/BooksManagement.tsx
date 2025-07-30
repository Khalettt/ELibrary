// src/pages/admin/BooksManagement.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Book, BookCategory } from '@/types/books'; // Make sure Book type is updated for Int ID
import { Plus, Edit, Trash2, BookOpen as BookIcon, Users as UsersIcon, TrendingUp, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';


// --- Zod Validation Schemas ---
const bookFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'TECHNOLOGY', 'BUSINESS', 'ART', 'HEALTH', 'BIOGRAPHY', 'OTHER'], {
    message: "Please select a valid category"
  }),
  pages: z.preprocess((val) => Number(val), z.number().int().positive('Pages must be a positive number')),
  price: z.preprocess((val) => Number(val), z.number().min(0, 'Price cannot be negative')),
  isbn: z.string().regex(/^(?:ISBN(?:-13)?:?)(?=[0-9]{13}$)\d{3}-?\d{10}$|^([0-9]{9}X|[0-9]{10})$/, 'Invalid ISBN format').optional().or(z.literal('')),
  is_premium: z.boolean(),
});

// Define valid categories for the select dropdown
const BOOK_CATEGORIES: BookCategory[] = [
  "FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "TECHNOLOGY", "BUSINESS", "ART", "HEALTH", "BIOGRAPHY", "OTHER"
];

const BooksManagement = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { user, logout, authToken } = useAuth(); // Removed isLoadingAuth as it's handled by AdminLayout

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    coverImageFile: null as File | null,
    currentCoverImageUrl: '',
    price: '0',
    is_premium: false,
    category: '' as BookCategory | '',
    pages: '0',
    isbn: '',
    bookFile: null as File | null,
    currentBookFileUrl: '',
  });

  const API_BASE_URL = 'http://localhost:3000/api';

  useEffect(() => {
    // Only fetch books if user is admin and authenticated
    if (authToken && user?.role === 'ADMIN') {
      fetchBooks();
    }
  }, [authToken, user]);

  const fetchBooks = async () => {
    if (!authToken) {
      toast({
        title: "Authentication required",
        description: "Please log in to manage books.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            toast({
                title: "Access Denied",
                description: "You are not authorized to view this content, or your session has expired.",
                variant: "destructive",
            });
            logout();
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch books: ${response.statusText}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (error: any) {
      toast({
        title: "Error fetching books",
        description: error.message || "Could not load books from the server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetBookForm = () => {
    setBookForm({
      title: '',
      author: '',
      description: '',
      coverImageFile: null,
      currentCoverImageUrl: '',
      price: '0',
      is_premium: false,
      category: '',
      pages: '0',
      isbn: '',
      bookFile: null,
      currentBookFileUrl: '',
    });
    setFormErrors({});
  };

  const handleAddBook = () => {
    setEditingBook(null);
    resetBookForm();
    setIsEditModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description,
      coverImageFile: null,
      currentCoverImageUrl: book.cover_image_url,
      price: (book.price / 100).toString(),
      is_premium: book.is_premium,
      category: book.category as BookCategory,
      pages: book.pages.toString(),
      isbn: book.isbn || '',
      bookFile: null,
      currentBookFileUrl: book.file_url || '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleDeleteBook = async (bookId: string) => { // Book ID is string (UUID)
    if (!authToken) {
      toast({ title: "Unauthorized", description: "Please log in again.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'DELETE',
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
        throw new Error(errorData.message || 'Failed to delete book');
      }
      toast({
        title: "Book deleted",
        description: "The book has been successfully removed from the library.",
      });
      fetchBooks();
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message || "An error occurred while deleting the book.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const validatedData = bookFormSchema.parse({
        title: bookForm.title,
        author: bookForm.author,
        description: bookForm.description,
        category: bookForm.category,
        pages: bookForm.pages,
        price: bookForm.price,
        isbn: bookForm.isbn,
        is_premium: bookForm.is_premium,
      });

      if (!authToken) {
        toast({ title: "Unauthorized", description: "Please log in again.", variant: "destructive" });
        return;
      }

      setIsLoading(true);

      const formData = new FormData();
      formData.append('title', validatedData.title);
      formData.append('author', validatedData.author);
      formData.append('description', validatedData.description);
      formData.append('category', validatedData.category);
      formData.append('pages', validatedData.pages.toString());
      formData.append('price', (validatedData.price * 100).toString());
      formData.append('is_premium', validatedData.is_premium.toString());
      formData.append('isbn', validatedData.isbn || '');

      if (bookForm.coverImageFile) {
        formData.append('coverImage', bookForm.coverImageFile);
      }
      if (bookForm.bookFile) {
        formData.append('bookFile', bookForm.bookFile);
      }

      const method = editingBook ? 'PUT' : 'POST';
      const url = editingBook ? `${API_BASE_URL}/books/${editingBook.id}` : `${API_BASE_URL}/books`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            toast({
                title: "Access Denied",
                description: "You are not authorized to perform this action, or your session has expired.",
                variant: "destructive",
            });
            logout();
        }
        throw new Error(data.message || `Failed to save book: ${response.statusText}`);
      }

      toast({
        title: editingBook ? "Book updated" : "Book added",
        description: editingBook ? "The book has been successfully updated." : "The new book has been added to the library.",
      });

      setIsEditModalOpen(false);
      fetchBooks();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });
        setFormErrors(errors);
        toast({
          title: "Validation Error",
          description: "Please correct the highlighted fields.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Operation failed",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const totalBooks = books.length;
  const freeBooks = books.filter(book => !book.is_premium).length;
  const premiumBooks = books.filter(book => book.is_premium).length;
  const totalRevenue = books.filter(book => book.is_premium).reduce((sum, book) => sum + book.price, 0) / 100;

  return (
    <div className="min-h-screen"> {/* Removed bg-muted/30 as it's in AdminLayout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              Total books in your library
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Books</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{freeBooks}</div>
            <p className="text-xs text-muted-foreground">
              {totalBooks > 0 ? `${Math.round((freeBooks / totalBooks) * 100)}% of total` : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Books</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{premiumBooks}</div>
            <p className="text-xs text-muted-foreground">
              {totalBooks > 0 ? `${Math.round((premiumBooks / totalBooks) * 100)}% of total` : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From premium books
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Books Management</CardTitle>
              <CardDescription>
                Add, edit, or remove books from your library
              </CardDescription>
            </div>
            <Button onClick={handleAddBook} className="bg-gradient-premium" disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Book
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading books...</div>
          ) : books.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No books found. Add your first book!</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={book.cover_image_url}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium">{book.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {book.pages} pages
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{book.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={book.price === 0 ? 'text-green-600' : 'text-premium-gold'}>
                          {book.price === 0 ? 'Free' : `$${(book.price / 100).toFixed(2)}`}
                        </span>
                      </TableCell>
                      <TableCell>
                        {book.is_premium ? (
                          <Badge className="bg-gradient-premium text-primary-foreground">
                            Premium
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Free</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditBook(book)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            <Trash2 className="w-4 h-4" />
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  placeholder="Book title"
                  className='text-xl font-semibold'
                />
                {formErrors.title && <p className="text-destructive text-sm mt-1">{formErrors.title}</p>}
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={bookForm.author}
                  onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  placeholder="Author name"
                  className='text-xl font-semibold'
                />
                {formErrors.author && <p className="text-destructive text-sm mt-1">{formErrors.author}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={bookForm.description}
                onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                placeholder="Book description"
                rows={1}
                className='text-xl font-semibold'
              />
              {formErrors.description && <p className="text-destructive text-sm mt-1">{formErrors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={bookForm.category}
                  onValueChange={(value: BookCategory) => setBookForm({ ...bookForm, category: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOK_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-destructive text-sm mt-1">{formErrors.category}</p>}
              </div>
              <div>
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  value={bookForm.pages}
                  onChange={(e) => setBookForm({ ...bookForm, pages: e.target.value })}
                  placeholder="Number of pages"
                  className='text-xl font-semibold'
                />
                {formErrors.pages && <p className="text-destructive text-sm mt-1">{formErrors.pages}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={bookForm.price}
                  onChange={(e) => setBookForm({ ...bookForm, price: e.target.value })}
                  placeholder="0.00 for free books"
                  className='text-xl font-semibold'
                />
                {formErrors.price && <p className="text-destructive text-sm mt-1">{formErrors.price}</p>}
              </div>
              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={bookForm.isbn}
                  onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                  placeholder="978-0-123456-78-9"
                  className='text-xl font-semibold'
                />
                {formErrors.isbn && <p className="text-destructive text-sm mt-1">{formErrors.isbn}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="cover_image_file">Book Cover Image</Label>
              <Input
                id="cover_image_file"
                type="file"
                accept="image/*"
                onChange={(e) => setBookForm({ ...bookForm, coverImageFile: e.target.files ? e.target.files[0] : null })}
                className="file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:py-1 file:px-3 file:mr-2 hover:file:bg-primary/90"
              />
              {editingBook && bookForm.currentCoverImageUrl && (
                <p className="text-sm text-muted-foreground mt-1">Current: <a href={`${API_BASE_URL.replace('/api', '')}${bookForm.currentCoverImageUrl}`} target="_blank" rel="noopener noreferrer" className="underline truncate max-w-[200px] inline-block">{bookForm.currentCoverImageUrl}</a> (Upload new to replace)</p>
              )}
            </div>

            <div>
              <Label htmlFor="book_file">Book File (PDF)</Label>
              <Input
                id="book_file"
                type="file"
                accept="application/pdf"
                onChange={(e) => setBookForm({ ...bookForm, bookFile: e.target.files ? e.target.files[0] : null })}
                className="file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:py-1 file:px-3 file:mr-2 hover:file:bg-primary/90"
              />
              {editingBook && bookForm.currentBookFileUrl && (
                <p className="text-sm text-muted-foreground mt-1">Current: <a href={`${API_BASE_URL.replace('/api', '')}${bookForm.currentBookFileUrl}`} target="_blank" rel="noopener noreferrer" className="underline truncate max-w-[200px] inline-block">{bookForm.currentBookFileUrl}</a> (Upload new to replace)</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_premium"
                checked={bookForm.is_premium}
                onCheckedChange={(checked: boolean) => setBookForm({ ...bookForm, is_premium: checked })}
              />
              <Label htmlFor="is_premium">This is a premium book</Label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} type="button" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-premium" disabled={isLoading}>
                {isLoading ? (editingBook ? 'Updating...' : 'Adding...') : (editingBook ? 'Update Book' : 'Add Book')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksManagement;