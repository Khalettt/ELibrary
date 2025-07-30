import { useState } from 'react';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import BookCard from './BookCard';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface BooksSectionProps {
  books: Book[];
  onViewDetails: (book: Book) => void;
  user: any;
  onDownload: (book: Book) => void;
  onPurchase: (book: Book) => void;
}

const BooksSection = ({ books, onViewDetails, user, onDownload, onPurchase }: BooksSectionProps) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(books.map(book => book.category)))];

  // Filter books by category
  const filteredBooks = selectedCategory === 'All' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  // Display books based on showAll state
  const displayBooks = showAll ? filteredBooks : filteredBooks.slice(0, 8);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <section id="books" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured <span className="text-red-600">Books</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of premium and free books across various categories
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <div className="flex items-center gap-2 mr-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm ">Filter by:</span>
          </div>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-gray-400" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {displayBooks.map((book, index) => (
            <div 
              key={book.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BookCard
                book={book}
                onViewDetails={onViewDetails}
                user={user}
                onDownload={onDownload}
                onPurchase={onPurchase}
              />
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {filteredBooks.length > 8 && (
          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              onClick={toggleShowAll}
              className="px-8 py-3 text-lg font-semibold group"
            >
              {showAll ? (
                <>
                  Show Less
                  <ChevronUp className="ml-2 w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                </>
              ) : (
                <>
                  See All Books ({filteredBooks.length})
                  <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-black mb-2">
              {books.filter(b => !b.is_premium).length}
            </div>
            <div className="text-blue-900">Free Books Available</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-black mb-2">
              {books.filter(b => b.is_premium).length}
            </div>
            <div className="text-blue-900">Premium Titles</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-black mb-2">
              {categories.length - 1}
            </div>
            <div className="text-blue-900">Categories</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BooksSection;