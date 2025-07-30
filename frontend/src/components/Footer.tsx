import React from 'react';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from 'react-router-dom'; // Import Link for internal routing

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Books", href: "/#books" },
    { label: "About Us", href: "/about" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ];

  const elibraryFeatures = [
    "Vast Digital Collection",
    "Free & Premium Books",
    "Easy Downloads",
    "Admin Dashboard",
    "User Accounts",
    "24/7 Access",
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info - ELibrary */}
          <div> {/* Removed motion.div */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-premium-gold rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold">ELibrary</span>
            </div>
            <p className="text-primary-foreground/80 text-base mb-6 leading-relaxed">
              Your ultimate digital library for endless learning and entertainment.
              Access a world of books at your fingertips, anytime, anywhere.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-premium-gold mr-3" />
                <span className="text-sm">+252 61 2 65 77 15</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-premium-gold mr-3" />
                <span className="text-sm">info@elibrary.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-premium-gold mr-3" />
                <span className="text-sm">123 Knowledge Ave, Mogadishu, Somalia</span>
              </div>
            </div>
          </div>

          {/* Quick Links - ELibrary */}
          <div> {/* Removed motion.div */}
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-premium-gold transition-colors duration-200 text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ELibrary Features (formerly Services) */}
          <div> {/* Removed motion.div */}
            <h3 className="text-xl font-semibold mb-6">Our Features</h3>
            <ul className="space-y-3">
              {elibraryFeatures.map((feature) => (
                <li key={feature}>
                  <span className="text-primary-foreground/80 text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social - ELibrary */}
          <div> {/* Removed motion.div */}
            <h3 className="text-xl font-semibold mb-6">Stay Connected</h3>
            <p className="text-primary-foreground/80 text-base mb-6">
              Follow us on social media for the latest updates, new book releases, and reading tips.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a // Changed motion.a to a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-premium-gold hover:text-primary transition-all duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div // Removed motion.div
          className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-primary-foreground/60 text-sm">
            © 2025 ELibrary. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-primary-foreground/60 hover:text-premium-gold text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-primary-foreground/60 hover:text-premium-gold text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link to="/license-info" className="text-primary-foreground/60 hover:text-premium-gold text-sm transition-colors duration-200">
              License Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
