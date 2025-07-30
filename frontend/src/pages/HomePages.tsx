// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useLocation is not strictly needed here anymore
import { Book } from '../types/book'; // Hubi jidkan
import Hero from '@/components/Hero';
import BooksSection from '@/components/BooksSection';
import BookDetailsModal from '@/components/BookDetailsModal';
import { useAuth } from '@/context/AuthContext'; // Hubi jidkan
import { useToast } from '@/components/ui/use-toast'; // Hubi jidkan
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Tag } from 'lucide-react';
import blog1 from "../assets/blog1.jpeg"
import blog2 from "../assets/blog2.jpeg"
import blog3 from "../assets/blog3.jpeg"
import blog4 from "../assets/blog4.jpeg"
import blog5 from "../assets/blog5.jpeg"
import { BookOpen, Users, Globe, Lightbulb } from 'lucide-react';
import profilePhoto from "../assets/kj.png"
import { Star } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ContactPage from '@/components/ContactPage';


// Halkan ku qor API_BASE_URL kaaga, waa inuu la mid yahay kan backend-ka
const API_BASE_URL = 'http://localhost:3000/api';
const API_STATIC_URL = 'http://localhost:3000'; // For serving static files like images/pdfs

interface HomePageProps {
  onOpenAuth: () => void; // This prop is passed from AppLayout to open AuthModal
}

const HomePage = ({ onOpenAuth }: HomePageProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { user, authToken, logout } = useAuth(); // Use useAuth hook for user and token
  const { toast } = useToast();
  const navigate = useNavigate(); // For potential redirects

  // --- Fetch Books ---
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/books`); // Fetch all books
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch books: ${response.statusText}`);
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message || "Failed to load books. Please try again later.");
        toast({
          title: "Error fetching books",
          description: err.message || "Could not load books from the server.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [toast]); // Dependency array includes toast to avoid lint warnings

  // --- Handlers for Book Actions ---

  const handleViewBookDetails = (book: Book) => {
    setSelectedBook(book);
    setIsDetailsModalOpen(true);
  };

  const handleDownloadBook = async (book: Book) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to download books.",
        variant: "destructive",
      });
      onOpenAuth(); // Open the authentication modal
      return;
    }

    if (book.is_premium) {
      toast({
        title: "Premium Book",
        description: "This is a premium book. Please use the 'Purchase' option.",
        variant: "info",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/books/download/${book.id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`, // Send auth token for protected download
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Access Denied",
            description: "You are not authorized to download this file, or your session has expired. Please log in again.",
            variant: "destructive",
          });
          logout(); // Log out if token is invalid/expired
          onOpenAuth(); // Open modal
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to download book.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = book.file_url ? book.file_url.split('/').pop() || `${book.title}.pdf` : `${book.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Downloading "${book.title}"...`,
      });

    } catch (err: any) {
      toast({
        title: "Download Failed",
        description: err.message || "An error occurred during download.",
        variant: "destructive",
      });
    }
  };

  const handlePurchaseBook = (book: Book) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase books.",
        variant: "destructive",
      });
      onOpenAuth(); // Open the authentication modal
      return;
    }

    const whatsappNumber = "+252612657715";
    const message = `Hello, I'm interested in purchasing the premium book: "${book.title}" by ${book.author}. Its price is $${(book.price / 100).toFixed(2)}. My email is ${user.email}.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    toast({
      title: "WhatsApp Contact",
      description: "Redirecting to WhatsApp to complete your purchase. Please send the pre-filled message.",
      variant: "default",
    });

    // You can also add logic for a dedicated payment page:
    // navigate(`/checkout?bookId=${book.id}`);
  };



const blogPosts = [
  {
    id: 1,
    title: "The Future of Digital Libraries: Trends and Innovations",
    author: "ELibrary Team",
    date: "July 25, 2024",
    category: "Technology",
    summary: "Explore how digital libraries are evolving with AI, personalized recommendations, and immersive reading experiences.",
    imageUrl: blog1,
  },
  {
    id: 2,
    title: "Top 10 Must-Read Books for Personal Growth in 2024",
    author: "Content Curator",
    date: "July 20, 2024",
    category: "Self-Improvement",
    summary: "A curated list of inspiring books that can help you achieve your personal and professional goals this year.",
    imageUrl: blog2
  },
  {
    id: 3,
    title: "How Reading Enhances Cognitive Abilities",
    author: "Dr. A. Hassan",
    date: "July 15, 2024",
    category: "Health & Science",
    summary: "Delve into the scientific benefits of reading, from improving memory to boosting critical thinking skills.",
    imageUrl: blog3
  },
  {
    id: 4,
    title: "Exploring African Literature: Voices from the Continent",
    author: "Cultural Insights",
    date: "July 10, 2024",
    category: "Culture",
    summary: "A journey through the rich and diverse landscape of African storytelling, highlighting key authors and themes.",
    imageUrl: blog4
  },
  {
    id: 5,
    title: "The Art of Speed Reading: Tips and Tricks",
    author: "Reading Coach",
    date: "July 05, 2024",
    category: "Reading Tips",
    summary: "Learn effective techniques to increase your reading speed and comprehension without sacrificing understanding.",
    imageUrl: blog5
  },
];


const testimonialsData = [
  {
    id: 1,
    name: "Ali Mohamed",
    location: "Mogadishu, Somalia",
    rating: 5,
    quote: "ELibrary has transformed my reading habits. The vast collection of books, especially the free ones, is incredible. It's so easy to find new authors and genres. Highly recommend!",
    avatar: profilePhoto
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    location: "Nairobi, Kenya",
    rating: 5,
    quote: "As a student, ELibrary is a lifesaver. I can access so many academic resources and classic literature without breaking the bank. The interface is clean and user-friendly.",
    avatar: profilePhoto
  },
  {
    id: 3,
    name: "Abdirahmaan Ali",
    location: "London, UK",
    rating: 4,
    quote: "I love the premium selection! The process for purchasing is unique but effective, and I appreciate the direct contact. It's great to support a platform that values accessible knowledge.",
    avatar: profilePhoto
  },
  {
    id: 4,
    name: "Omar Abdi",
    location: "Dubai, UAE",
    rating: 5,
    quote: "The admin dashboard is fantastic. Managing books is a breeze, and the analytics give me a clear overview of the library's performance. A truly well-designed platform.",
    avatar: profilePhoto
  },
  {
    id: 5,
    name: "Abdi saacid Yusuf",
    location: "Istanbul, Turkey",
    rating: 4,
    quote: "A great initiative for digital literacy. I found several rare books I've been looking for. The only suggestion would be more payment options, but overall, excellent!",
    avatar: profilePhoto
  },
  {
    id: 6,
    name: "Mohamed Said",
    location: "Djibouti City, Djibouti",
    rating: 5,
    quote: "Simple, effective, and rich with content. ELibrary is my go-to for all my reading needs. The download process is smooth, and the book details are very helpful.",
    avatar: profilePhoto
  },
];


const faqData = [
  {
    question: "What is ELibrary?",
    answer: "ELibrary is a digital platform offering a vast collection of books, including free classics and premium contemporary titles, accessible to readers worldwide. Our goal is to promote literacy and provide easy access to knowledge."
  },
  {
    question: "How do I create an account?",
    answer: "You can create an account by clicking on the 'Sign In' button in the top right corner and navigating to the 'Sign Up' tab. Fill in your details, choose your role (User or Admin), and you're good to go!"
  },
  {
    question: "Are there free books available?",
    answer: "Yes, ELibrary offers a wide selection of free books, including many classics. Look for books marked 'Free' or with a price of $0.00."
  },
  {
    question: "How do I download a free book?",
    answer: "Once you are logged in, simply click on the 'Download Free' button on the book's card or details page. The PDF file will start downloading automatically."
  },
  {
    question: "How do I purchase a premium book?",
    answer: "For premium books, click on the 'Purchase' button. You will be redirected to a WhatsApp chat with our sales team, where you can complete the purchase process. We are working on integrating more direct payment methods soon."
  },
  {
    question: "What if I forget my password?",
    answer: "Currently, password reset functionality is not directly available on the frontend. Please contact our support team via the 'Contact Us' page, and we will assist you in resetting your password."
  },
  {
    question: "Can I read books offline?",
    answer: "Once you download a book (PDF), you can read it offline using any PDF reader on your device."
  }
];
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg text-gray-700">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-muted/30 p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-lg text-gray-700 text-center">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero
        onOpenAuth={onOpenAuth} // Pass onOpenAuth to Hero
        user={user}
      />

      {/* Books Section */}
      <BooksSection
        books={books}
        onViewDetails={handleViewBookDetails}
        user={user}
        onDownload={handleDownloadBook}
        onPurchase={handlePurchaseBook}
      />

    <div className="min-h-screen bg-muted/30  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <section className="text-center py-16 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            Our <span className="text-blue-900">Blog</span>
          </h1>
          <p className="text-lg opacity-90 max-w-3xl mx-auto animate-fade-in-up delay-100">
            Insights, tips, and stories from the world of books and beyond.
          </p>
        </section>

        {/* Blog Posts Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {blogPosts.map(post => (
            <Card key={post.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <CardDescription className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-1" /> {post.date}
                  <Tag className="h-4 w-4 ml-4 mr-1" /> {post.category}
                </CardDescription>
                <CardTitle className="text-xl font-bold mb-2 line-clamp-2">
                  {post.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.summary}
                </p>
                <Button variant="link" className="p-0 h-auto text-primary">
                  Read More &rarr;
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>

    
    <div className="min-h-screen bg-muted/30  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section for About */}
        <section className="text-center py-16 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            About <span className="text-blue-950">ELibrary</span>
          </h1>
          <p className="text-lg opacity-90 max-w-3xl mx-auto animate-fade-in-up delay-100">
            Our mission is to make knowledge accessible to everyone, everywhere.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-12">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-foreground">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-lg text-muted-foreground">
              <p className="mb-4">
                ELibrary was founded on the belief that education and reading should be a universal right, not a privilege. We strive to build a comprehensive digital library that offers a vast collection of books, from timeless classics to modern bestsellers, catering to diverse interests and learning needs.
              </p>
              <p>
                We are committed to fostering a love for reading and continuous learning by providing an intuitive, accessible, and enriching platform for readers worldwide.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Key Pillars Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Vast Collection</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Thousands of titles across various genres and categories, constantly expanding.
            </CardContent>
          </Card>

          <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Community Focused</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Building a global community of readers and knowledge seekers.
            </CardContent>
          </Card>

          <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Global Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Access books anytime, anywhere, on any device.
            </CardContent>
          </Card>

          <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Continuous Learning</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Empowering individuals through knowledge and self-improvement.
            </CardContent>
          </Card>
        </section>

        {/* Team Section (Placeholder) */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Team Member Card 1 */}
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <img
                  src={profilePhoto}
                  alt="Team Member"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">Jane Doe</h3>
                <p className="text-sm text-muted-foreground">Founder & CEO</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Passionate about literacy and technology.
                </p>
              </CardContent>
            </Card>
            {/* Team Member Card 2 */}
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <img
                  src={profilePhoto}
                  alt="Team Member"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">John Smith</h3>
                <p className="text-sm text-muted-foreground">Lead Developer</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Crafting seamless digital reading experiences.
                </p>
              </CardContent>
            </Card>
            {/* Team Member Card 3 */}
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <img
                  src={profilePhoto}
                  alt="Team Member"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">Emily White</h3>
                <p className="text-sm text-muted-foreground">Content Curator</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Bringing the best books to our readers.
                </p>
              </CardContent>
            </Card>
            {/* Team Member Card 4 */}
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <img
                  src={profilePhoto}
                  alt="Team Member"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">David Green</h3>
                <p className="text-sm text-muted-foreground">Customer Support</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Ensuring a smooth experience for every user.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-primary text-primary-foreground py-16 rounded-lg shadow-lg mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Become a part of the ELibrary community and explore the world of knowledge.
          </p>
          <button className="px-8 py-3 text-lg font-semibold">
            Start Reading Now
          </button>
        </section>
      </div>
    </div>


    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section for Testimonials */}
        <section className="text-center py-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            What Our <span className="text-blue-900">Readers Say</span>
          </h1>
          <p className="text-lg opacity-90 max-w-3xl mx-auto animate-fade-in-up delay-100">
            Hear directly from the community about their ELibrary experience.
          </p>
        </section>

        {/* Testimonials Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {testimonialsData.map(testimonial => (
            <Card key={testimonial.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? 'fill-premium-gold text-premium-gold' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>

        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section for FAQ */}
        <section className="text-center py-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            Frequently Asked <span className="text-blue-900">Questions</span>
          </h1>
          <p className="text-lg opacity-90 max-w-3xl mx-auto animate-fade-in-up delay-100">
            Find quick answers to the most common questions about ELibrary.
          </p>
        </section>

        {/* FAQ Accordion */}
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <section className="text-center mt-12 mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Still have questions?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Don't hesitate to reach out to our support team. We're here to help!
          </p>
          <a href="/contact" className="inline-block">
            <button className="bg-gradient-premium px-8 py-3 text-lg font-semibold">
              Contact Us
            </button>
          </a>
        </section>
      </div>
    </div>

      <Footer />
      <BookDetailsModal
        book={selectedBook}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        user={user}
        onDownload={handleDownloadBook}
        onPurchase={handlePurchaseBook}
      />


    </div>
  );
};

export default HomePage;