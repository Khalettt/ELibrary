import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import profilePhoto from "../assets/kj.png" 
import Footer from './Footer';

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

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section for Testimonials */}
        <section className="text-center py-16 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground rounded-lg shadow-lg mb-12">
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
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
