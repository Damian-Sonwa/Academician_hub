import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient, setAuthToken, removeAuthToken, getAuthToken } from '@/integrations/api/client';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  level?: number;
  xp?: number;
  badges?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; avatar?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Load user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          // Verify token by fetching current user
          const response = await apiClient.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          // Token is invalid, remove it
          removeAuthToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login({ email, password });
      
      // Store JWT token
      setAuthToken(response.token);
      
      // Set user data
      setUser(response.user);
      
      // Invalidate queries to refetch with new auth
      queryClient.invalidateQueries();
      
      toast.success(response.message || `Welcome back, ${response.user.name}! 🎉`);
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.register({ name, email, password });
      
      // Store JWT token
      setAuthToken(response.token);
      
      // Set user data
      setUser(response.user);
      
      // Invalidate queries to refetch with new auth
      queryClient.invalidateQueries();
      
      toast.success(response.message || `Account created! Welcome, ${name}! 🎊`);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove token
    removeAuthToken();
    
    // Clear user state
    setUser(null);
    
    // Clear all queries
    queryClient.clear();
    
    toast.info('Logged out successfully 👋');
  };

  const updateProfile = async (data: { name?: string; avatar?: string }) => {
    if (!user) return;
    
    try {
      const response = await apiClient.updateProfile(data);
      setUser(response.user);
      toast.success(response.message || 'Profile updated! ✨');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!getAuthToken(),
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

