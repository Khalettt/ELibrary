import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
// Removed useNavigate from here, as AuthContext handles navigation after login
// import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Zod schemas (these should match your backend's schemas as closely as possible)
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'ADMIN'], { message: "Please select a valid role" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth(); // Get the login function from AuthContext

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER' as 'USER' | 'ADMIN', // Default to USER
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const API_BASE_URL = 'http://localhost:3000/api'; // Your backend API base URL

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      const validatedData = loginSchema.parse(loginForm);
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      // Handle network errors (e.g., server not running)
      if (!response) {
        throw new Error('Network error: Could not connect to the server.');
      }

      const data = await response.json();

      if (!response.ok) {
        // If the backend sends validation errors, data.errors might exist
        const errorMessage = data.message || `Login failed with status ${response.status}. Please check your credentials.`;
        const errorDetails = data.errors ? data.errors.map((err: any) => err.message).join(', ') : '';

        // If specific Zod errors are returned from backend, display them in form
        if (data.errors && Array.isArray(data.errors)) {
          const backendFormErrors: Record<string, string> = {};
          data.errors.forEach((err: any) => {
            if (err.path && err.path[0]) {
              backendFormErrors[err.path[0]] = err.message;
            }
          });
          setErrors(backendFormErrors); // Set errors to display next to fields
        }

        throw new Error(`${errorMessage} ${errorDetails}`);
      }

      // Call the login function from AuthContext to update state and handle redirection
      login(data.token, data.user);

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      onClose(); // Close the modal on successful login

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Zod validation errors from frontend (before API call)
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
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        // Specific handling for network issues
        toast({
          title: "Connection Error",
          description: "Could not connect to the server. Please ensure the backend is running and try again.",
          variant: "destructive",
        });
      } else {
        // General API error (e.g., invalid credentials, user not found)
        toast({
          title: "Login failed",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      const validatedData = registerSchema.parse(registerForm);
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          password: validatedData.password,
          role: validatedData.role,
        }),
      });

      // Handle network errors (e.g., server not running)
      if (!response) {
        throw new Error('Network error: Could not connect to the server.');
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || `Registration failed with status ${response.status}. Please try again.`;
        const errorDetails = data.errors ? data.errors.map((err: any) => err.message).join(', ') : '';

        if (data.errors && Array.isArray(data.errors)) {
          const backendFormErrors: Record<string, string> = {};
          data.errors.forEach((err: any) => {
            if (err.path && err.path[0]) {
              backendFormErrors[err.path[0]] = err.message;
            }
          });
          setErrors(backendFormErrors);
        }

        throw new Error(`${errorMessage} ${errorDetails}`);
      }

      // Call the login function from AuthContext to update state and handle redirection
      login(data.token, data.user);

      toast({
        title: "Account created!",
        description: "Welcome to ELibrary. You can now access all features.",
      });

      onClose(); // Close the modal on successful registration

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Zod validation errors from frontend (before API call)
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
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast({
          title: "Connection Error",
          description: "Could not connect to the server. Please ensure the backend is running and try again.",
          variant: "destructive",
        });
      } else {
        // General API error
        toast({
          title: "Registration failed",
          description: error.message || "An unexpected error occurred. Please try again or contact support.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-premium rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Welcome to ELibrary</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Sign in to your account</CardTitle>
                  <CardDescription>
                    Access your library and continue reading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                        />
                      </div>
                      {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                    </div>

                    <Button type="submit" className="w-full text-white" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-0 shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Create your account</CardTitle>
                  <CardDescription>
                    Join thousands of readers today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Enter your name"
                          className="pl-10"
                          value={registerForm.name}
                          onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                          // name is optional based on backend schema, so `required` is removed
                        />
                      </div>
                      {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          required
                        />
                      </div>
                      {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10"
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <select
                          id="register-role"
                          className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          value={registerForm.role}
                          onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value as 'USER' | 'ADMIN' })}
                          required // Role is required for registration
                        >
                          <option value="USER">User (Reader)</option>
                          <option value="ADMIN">Admin (Library Manager)</option>
                        </select>
                      </div>
                      {errors.role && <p className="text-sm text-destructive mt-1">{errors.role}</p>}
                    </div>

                    <Button type="submit" className="w-full text-white" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;