import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import { Button } from '@/components/ui/button';
import { BookOpen, User, Menu, X, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
}

const Navbar = ({ onOpenAuth }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close mobile menu after logout
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              ELibrary
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground text-xl hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/blog" className="text-foreground text-xl hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/about" className="text-foreground text-xl hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/testimonials" className="text-foreground text-xl hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link to="/faq" className="text-foreground text-xl hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="text-foreground text-xl hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    {/* Link to Profile Page (assuming /profile) */}
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      {/* Link to Admin Dashboard */}
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onOpenAuth} className="bg-blue-800 text-white">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/#books" className="block px-3 py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Books
              </Link>
              <Link to="/about" className="block px-3 py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to="/testimonials" className="block px-3 py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Testimonials
              </Link>
              <Link to="/faq" className="block px-3 py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                FAQ
              </Link>
              <Link to="/contact" className="block px-3 py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/blog" className="block px-3 py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Blog
              </Link>
              {user ? (
                <>
                  {/* Profile Link in Mobile Menu */}
                  <Link to="/profile" className="block px-3 py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4 inline-block" /> Profile
                  </Link>
                  {user.role === 'ADMIN' && (
                    // Admin Dashboard Link in Mobile Menu
                    <Link to="/dashboard" className="block px-3 py-2 text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                      <Settings className="mr-2 h-4 w-4 inline-block" /> Admin Dashboard
                    </Link>
                  )}
                  <Button
                    onClick={handleLogout}
                    className="w-full justify-start mt-2 bg-gradient-premium text-primary-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </Button>
                </>
              ) : (
                <div className="px-3 py-2">
                  <Button onClick={() => { onOpenAuth(); setIsMenuOpen(false); }} className="w-full bg-gradient-premium">
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
