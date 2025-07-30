import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';

interface HeroProps {
  onOpenAuth: () => void;
  user: any;
}

const Hero = ({ onOpenAuth, user }: HeroProps) => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById('books');
    booksSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      >
        <div className="absolute inset-0 from-primary/90 via-primary/70 to-primary/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Hero Text */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-primary mb-6 animate-fade-in">
            Discover Your Next
            <span className="block text-blue-900">
              Great Read
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-primary mb-8 max-w-2xl mx-auto animate-slide-up">
            Access thousands of books, from timeless classics to modern bestsellers. 
            Your digital library awaits with premium content and free collections.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <Button 
              size="lg" 
              className="bg-black text-white px-8 py-4 text-lg font-semibold group"
              onClick={scrollToBooks}
            >
              Explore Library
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {!user && (
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground  text-black hover:bg-primary-foreground hover:text-primary px-8 py-4 text-lg font-semibold"
                onClick={onOpenAuth}
              >
                <Search className="mr-2 h-5 w-5" />
                Join for Free
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-blue-950">10,000+</div>
              <div className="text-primary">Books Available</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl font-bold text-blue-950">5,000+</div>
              <div className="text-primary">Free Downloads</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-3xl font-bold text-blue-950">24/7</div>
              <div className="text-primary">Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;