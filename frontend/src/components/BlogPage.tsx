import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Tag } from 'lucide-react';
import blog1 from "../assets/blog1.jpeg"
import blog2 from "../assets/blog2.jpeg"
import blog3 from "../assets/blog3.jpeg"
import blog4 from "../assets/blog4.jpeg"
import blog5 from "../assets/blog5.jpeg"
import Footer from './Footer';

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

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section for Blog */}
        <section className="text-center py-16 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground rounded-lg shadow-lg mb-12">
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
      <Footer />
    </div>
  );
};

export default BlogPage;
