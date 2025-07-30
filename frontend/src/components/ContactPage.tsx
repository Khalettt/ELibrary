import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import Footer from './Footer';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' }); // Clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear all errors

    try {
      const validatedData = contactFormSchema.parse(formData);
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real application, you would send this data to your backend API
      // Example:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(validatedData),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to send message.');
      // }

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you shortly.",
        variant: "default",
      });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formErrors);
        toast({
          title: "Validation Error",
          description: "Please correct the highlighted fields.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to Send Message",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-10">
        {/* Hero Section for Contact */}
        <section className="text-center py-16 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground rounded-lg shadow-lg mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            Get In <span className="text-blue-900">Touch</span>
          </h1>
          <p className="text-lg opacity-90 max-w-3xl mx-auto animate-fade-in-up delay-100">
            We'd love to hear from you! Reach out for support, feedback, or inquiries.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hassan@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Inquiry about books"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-blue-900 text-white" disabled={isLoading}>
                  {isLoading ? 'Sending...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Our Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Email Us</h3>
                  <p className="text-muted-foreground">asiismohamed23@elibrary.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Call Us</h3>
                  <p className="text-muted-foreground">+252 61 265 77 15</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Visit Our Office</h3>
                  <p className="text-muted-foreground">123 Knowledge Ave, Mogadishu, Somalia</p>
                </div>
              </div>
              <div className="text-muted-foreground text-sm pt-4">
                Our support team is available Monday - Friday, 9 AM - 5 PM (EAT).
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
