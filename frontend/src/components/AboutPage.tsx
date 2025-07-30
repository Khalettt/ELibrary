import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Globe, Lightbulb } from 'lucide-react';
import Footer from './Footer';
import profilePhoto from "../assets/kj.png";
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section for About */}
        <section className="text-center py-16 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground rounded-lg shadow-lg mb-12">
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
      <Footer />
    </div>
  );
};

export default AboutPage;
