import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

// Define the User interface (adjust based on your actual user structure from backend)
interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER'; // Or whatever roles you have
  name?: string; // Add name as optional based on your User model
}

// Define the shape of your AuthContext
interface AuthContextType {
  user: User | null;
  authToken: string | null;
  isLoadingAuth: boolean;
  // login function now takes token and user data directly, to be called *after* a successful API login
  login: (token: string, userData: User) => void;
  logout: () => void;
}

// Create the context with default null values
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // To manage initial auth state loading
  const { toast } = useToast();
  const navigate = useNavigate(); // Get navigate from react-router-dom

  // Load user and token from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        // Clear invalid data from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        toast({
            title: "Session Expired",
            description: "Your previous session was invalid. Please log in again.",
            variant: "destructive",
        });
      }
    }
    setIsLoadingAuth(false); // Authentication state loaded
  }, []);

  // This login function is called BY AuthModal *after* a successful API call
  const login = (token: string, userData: User) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));

    // Role-based Redirection
    if (userData.role === 'ADMIN') {
      navigate('/dashboard');
    } else {
      navigate('/'); // Redirect regular users to homepage
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // Always redirect to login or home page after logout
    navigate('/'); // Redirect to home/login page after logout
  };

  // Provide the state and functions to consumers
  return (
    <AuthContext.Provider value={{ user, authToken, isLoadingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};