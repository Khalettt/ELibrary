import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from './Footer';

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
  },
  {
    question: "What are the system requirements for ELibrary?",
    answer: "ELibrary is a web-based platform, so you only need a modern web browser (like Chrome, Firefox, Edge, Safari) and an internet connection. For reading downloaded books, a PDF reader is required."
  },
  {
    question: "How can I suggest a new book?",
    answer: "We welcome suggestions! Please use the 'Contact Us' page to send us your book recommendations. Our content team regularly reviews suggestions."
  },
  {
    question: "Is ELibrary available in other languages?",
    answer: "Currently, ELibrary's interface is primarily in English. However, many books in our collection may be available in various languages. We plan to add multi-language support for the platform in the future."
  }
];

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section for FAQ */}
        <section className="text-center py-16 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground rounded-lg shadow-lg mb-12">
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
      <Footer />
    </div>
  );
};

export default FaqPage;
