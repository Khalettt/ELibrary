// src/components/BookCard.tsx
import { useState } from 'react';
import { Book } from '../types/book'; // Hubi jidkan
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Crown, Download, Eye, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onViewDetails: (book: Book) => void;
  user: any;
  onDownload: (book: Book) => void;
  onPurchase: (book: Book) => void;
}

const API_STATIC_URL = 'http://localhost:3000'; // Hubi inuu kan sax yahay!

const BookCard = ({ book, onViewDetails, user, onDownload, onPurchase }: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${(price / 100).toFixed(2)}`;
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
    <Card
      className="group relative overflow-hidden bg-gradient-card border-0 shadow-card-soft hover:shadow-book transition-all duration-300 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badge */}
      {book.is_premium && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-premium text-primary-foreground border-0 px-2 py-1">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}

      {/* Book Cover */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={`${API_STATIC_URL}${book.cover_image_url}`} // Kani waa hagaajinta
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Overlay Actions */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            size="sm"
            variant="secondary"
            className="backdrop-blur-sm bg-background/90"
            onClick={() => onViewDetails(book)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Category */}
        <Badge variant="outline" className="mb-2 text-xs">
          {book.category}
        </Badge>

        {/* Title & Author */}
        <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3">
          by {book.author}
        </p>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {book.description}
        </p>

        {/* Book Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{book.pages} pages</span>
          <div className="flex items-center">
            <Star className="w-3 h-3 fill-premium-gold text-premium-gold mr-1" />
            <span>4.8</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className={`font-bold text-lg ${book.price === 0 ? 'text-green-600' : 'text-premium-gold'}`}>
            {formatPrice(book.price)}
          </span>
          {book.price > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              ${((book.price * 1.5) / 100).toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className={`w-full ${book.is_premium ? 'bg-gradient-premium' : 'bg-primary'} text-primary-foreground`}
          onClick={handleAction}
        >
          {book.is_premium && book.price > 0 ? (
            <>
              <Crown className="w-4 h-4 mr-2" />
              Purchase
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Free
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;