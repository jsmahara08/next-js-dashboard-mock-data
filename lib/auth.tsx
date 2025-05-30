"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In production, this would call an API endpoint to validate the token
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock login - in production, this would call an API endpoint
      if (email === 'admin@example.com' && password === 'password') {
        // Mock user data
        const mockUser: User = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          avatar: 'https://ui-avatars.com/api/?name=Admin+User',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        // Set cookie - in production this would be done by the server
        document.cookie = 'auth-token=mock-jwt-token; path=/; max-age=86400';
        
        // Store user in localStorage - in production, consider more secure options
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast.success('Login successful');
        router.push('/admin/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed');
      console.error('Login error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Clear localStorage
    localStorage.removeItem('user');
    
    setUser(null);
    toast.info('Logged out successfully');
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}