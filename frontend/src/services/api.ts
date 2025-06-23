import axios from 'axios';
import { getCacheItem, setCacheItem, CACHE_KEYS, CACHE_EXPIRATION } from '../utils/cacheUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for auth token and logging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  
  // Log request details for debugging
  console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Don't override Content-Type for multipart/form-data (file uploads)
  if (config.data instanceof FormData) {
    // Delete the Content-Type header to let the browser set it with the boundary
    delete config.headers['Content-Type'];
    console.log('Request contains FormData, removing Content-Type header to allow browser to set it');
  }
  
  return config;
});

// Add response interceptor for error handling and caching
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}: Status ${response.status}`);
    
    // Cache GET responses if they're successful
    if (response.config.method?.toLowerCase() === 'get' && response.status === 200) {
      const url = response.config.url;
      
      // Only cache specific endpoints
      if (url?.includes('/wardrobe')) {
        setCacheItem(CACHE_KEYS.WARDROBE_ITEMS, response.data, CACHE_EXPIRATION.SHORT);
      } else if (url?.includes('/recommendations')) {
        setCacheItem(CACHE_KEYS.RECOMMENDATIONS, response.data, CACHE_EXPIRATION.SHORT);
      } else if (url?.includes('/marketplace') && !url.includes('/search')) {
        setCacheItem(CACHE_KEYS.MARKETPLACE_ITEMS, response.data, CACHE_EXPIRATION.MEDIUM);
      } else if (url?.includes('/marketplace/trending')) {
        setCacheItem(CACHE_KEYS.TRENDING_ITEMS, response.data, CACHE_EXPIRATION.MEDIUM);
      }
    }
    
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Enhanced API methods with caching
export const apiWithCache = {
  // GET request with cache
  async get<T>(url: string, config?: any): Promise<T> {
    // Check cache first
    const cacheKey = `${CACHE_KEYS.WARDROBE_ITEMS}_${url}`;
    const cachedData = getCacheItem<T>(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached data for ${url}`);
      return cachedData;
    }
    
    // If not in cache, make the API call
    const response = await api.get<T>(url, config);
    
    // Cache the response
    setCacheItem(cacheKey, response.data, CACHE_EXPIRATION.SHORT);
    
    return response.data;
  },
  
  // Other methods (no caching)
  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },
  
  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },
  
  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await api.delete<T>(url, config);
    return response.data;
  }
};
