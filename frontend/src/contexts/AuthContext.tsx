import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { getCacheItem, setCacheItem, CACHE_KEYS, CACHE_EXPIRATION, clearCache } from '../utils/cacheUtils';

interface User {
  id: string;
  email: string;
  name: string;
  skinTone?: string;
  bodyType?: string;
  preferredStyle?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserProfile = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Check cache first
      const cachedUser = getCacheItem<User>(CACHE_KEYS.USER_PROFILE);
      if (cachedUser) {
        console.log('Using cached user profile');
        setUser(cachedUser);
        setIsLoading(false);
        return;
      }
      
      // If not in cache, fetch from API
      const userData = await authService.getProfile();
      setUser(userData);
      
      // Cache the user profile
      setCacheItem(CACHE_KEYS.USER_PROFILE, userData, CACHE_EXPIRATION.LONG);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const login = async (email: string, password: string) => {
    try {
      const { user: userData, token } = await authService.login(email, password);
      localStorage.setItem('authToken', token);
      setUser(userData);
      
      // Cache the user profile
      setCacheItem(CACHE_KEYS.USER_PROFILE, userData, CACHE_EXPIRATION.LONG);
      
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const { user: newUser, token } = await authService.signup(userData);
      localStorage.setItem('authToken', token);
      setUser(newUser);
      
      // Cache the user profile
      setCacheItem(CACHE_KEYS.USER_PROFILE, newUser, CACHE_EXPIRATION.LONG);
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    
    // Clear all cache on logout
    clearCache();
    
    toast.success('Logged out successfully');
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      
      // Update the cached user profile
      setCacheItem(CACHE_KEYS.USER_PROFILE, updatedUser, CACHE_EXPIRATION.LONG);
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
