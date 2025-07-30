// src/components/BookDetailsModal.tsx
import { Book } from '../types/book'; // Hubi jidkan
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crown, Download, Calendar, BookOpen, Star, X } from 'lucide-react';

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onDownload: (book: Book) => void;
  onPurchase: (book: Book) => void;
}

const API_STATIC_URL = 'http://localhost:3000'; // Hubi inuu kan sax yahay!

const BookDetailsModal = ({ book, isOpen, onClose, user, onDownload, onPurchase }: BookDetailsModalProps) => {
  if (!book) return null;

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${(price / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAction = () => {
    // Logic for user not logged in is handled by parent (HomePage) via onOpenAuth.
    // Here we just trigger the download/purchase directly.
    if (book.is_premium && book.price > 0) {
      onPurchase(book);
    } else {
      onDownload(book);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Header Image */}
          <div className="relative h-64 sm:h-80 overflow-hidden">
            <img
              src={`${API_STATIC_URL}${book.cover_image_url}`} // Kani waa hagaajinta
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />

            {/* Premium Badge */}
            {book.is_premium && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-premium text-primary-foreground border-0 px-3 py-1">
                  <Crown className="w-4 h-4 mr-1" />
                  Premium
                </Badge>
              </div>
            )}

            {/* Book Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
              <Badge variant="outline" className="mb-2 bg-background/20 text-primary-foreground border-primary-foreground/30">
                {book.category}
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-lg opacity-90">by {book.author}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Book Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <h3 className="font-semibold text-lg mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {book.description}
                </p>

                <h3 className="font-semibold text-lg mb-3">What You'll Learn</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Comprehensive understanding of {book.category.toLowerCase()} concepts</li>
                  <li>• Practical applications and real-world examples</li>
                  <li>• Expert insights from {book.author}</li>
                  <li>• Step-by-step guidance and best practices</li>
                </ul>
              </div>

              <div className="space-y-4">
                {/* Price Card */}
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <div className={`text-3xl font-bold mb-2 ${book.price === 0 ? 'text-green-600' : 'text-premium-gold'}`}>
                    {formatPrice(book.price)}
                  </div>
                  {book.price > 0 && (
                    <div className="text-sm text-muted-foreground line-through mb-4">
                      ${((book.price * 1.5) / 100).toFixed(2)}
                    </div>
                  )}

                  <Button
                    className={`w-full ${book.is_premium ? 'bg-gradient-premium' : 'bg-primary'} text-primary-foreground mb-3`}
                    onClick={handleAction}
                    disabled={!user} // Button disabled if no user
                  >
                    {!user ? (
                      'Login Required'
                    ) : book.is_premium && book.price > 0 ? (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        Purchase Now
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Free
                      </>
                    )}
                  </Button>

                  {!user && (
                    <p className="text-xs text-muted-foreground">
                      Please login to access this book
                    </p>
                  )}
                </div>

                {/* Book Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pages:</span>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {book.pages}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Published:</span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(book.publication_date)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ISBN:</span>
                    <span className="font-mono text-xs">{book.isbn || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-premium-gold text-premium-gold mr-1" />
                      <span>4.8 (127 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center p-4">
                <Download className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Instant Download</h4>
                <p className="text-sm text-muted-foreground">Get immediate access</p>
              </div>
              <div className="text-center p-4">
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Multiple Formats</h4>
                <p className="text-sm text-muted-foreground">PDF, EPUB, MOBI</p>
              </div>
              <div className="text-center p-4">
                <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Money Back</h4>
                <p className="text-sm text-muted-foreground">30-day guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsModal;