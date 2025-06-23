import { api, apiWithCache } from './api';
import { getCacheItem, setCacheItem, CACHE_KEYS, CACHE_EXPIRATION } from '../utils/cacheUtils';

export interface OutfitRecommendation {
  id: string;
  items: string[];
  confidence: number;
  occasion: string;
  description: string;
  styleNotes?: string;
  missingItems?: MissingItem[];
}

export interface MissingItem {
  category: string;
  color: string;
  description: string;
  searchTerms: string[];
  priority: 'low' | 'medium' | 'high';
  priceRange: {
    min: number;
    max: number;
  };
  availableProducts?: MarketplaceItem[];
}

export interface MarketplaceItem {
  id: string;
  name: string;
  category: string;
  color?: string;
  price: number;
  imageUrl: string;
  brand: string;
  url: string;
  source: string;
  rating?: number;
  condition?: string;
  relevanceScore?: number;
}

export interface WardrobeAnalysis {
  strengths: string[];
  gaps: string[];
  suggestions: string[];
}

export interface RecommendationResponse {
  recommendations: OutfitRecommendation[];
  wardrobeAnalysis: WardrobeAnalysis;
  message?: string;
  subscriptionInfo?: any;
  accessInfo?: any;
}

export interface MarketplaceResponse {
  items: MarketplaceItem[];
  totalCount: number;
  filters: any;
  sources: string[];
}

export interface ShoppingListItem {
  item: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  reason: string;
  searchTerms: string[];
  priceRange: {
    min: number;
    max: number;
  };
  occasions: string[];
  availableProducts?: MarketplaceItem[];
}

export interface ShoppingListResponse {
  shoppingList: ShoppingListItem[];
}

export const recommendationService = {
  async getOutfitRecommendations(occasion?: string): Promise<RecommendationResponse> {
    try {
      // Generate cache key based on occasion
      const cacheKey = `${CACHE_KEYS.RECOMMENDATIONS}_${occasion || 'all'}`;
      
      // Check cache first
      const cachedRecommendations = getCacheItem<RecommendationResponse>(cacheKey);
      if (cachedRecommendations) {
        console.log('Using cached recommendations');
        return cachedRecommendations;
      }
      
      // If not in cache, make the API call
      const response = await api.get('/recommendations', {
        params: { occasion }
      });
      
      // Cache the response
      setCacheItem(cacheKey, response.data, CACHE_EXPIRATION.SHORT);
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      
      // If it's a 403 error (subscription required), pass it through
      if (error.response?.status === 403) {
        throw error;
      }
      
      // For other errors, return empty data
      return {
        recommendations: [],
        wardrobeAnalysis: {
          strengths: [],
          gaps: [],
          suggestions: []
        }
      };
    }
  },

  async getRecommendationsForItems(itemIds: string[], occasion?: string): Promise<RecommendationResponse> {
    try {
      // Generate cache key based on itemIds and occasion
      const cacheKey = `${CACHE_KEYS.RECOMMENDATIONS}_items_${itemIds.join('_')}_${occasion || 'all'}`;
      
      // Check cache first
      const cachedRecommendations = getCacheItem<RecommendationResponse>(cacheKey);
      if (cachedRecommendations) {
        console.log('Using cached item-specific recommendations');
        return cachedRecommendations;
      }
      
      // If not in cache, make the API call
      const response = await api.post('/recommendations/for-items', {
        itemIds,
        occasion
      });
      
      // Cache the response
      setCacheItem(cacheKey, response.data, CACHE_EXPIRATION.SHORT);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching item-specific recommendations:', error);
      throw error;
    }
  },

  async getMarketplaceItems(
    category?: string, 
    color?: string, 
    occasion?: string,
    priceRange?: { min: number; max: number }
  ): Promise<MarketplaceResponse> {
    try {
      // Generate cache key based on filters
      const cacheKey = `${CACHE_KEYS.MARKETPLACE_ITEMS}_${category || 'all'}_${color || 'all'}_${occasion || 'all'}_${priceRange?.min || 0}_${priceRange?.max || 0}`;
      
      // Check cache first
      const cachedItems = getCacheItem<MarketplaceResponse>(cacheKey);
      if (cachedItems) {
        console.log('Using cached marketplace items');
        return cachedItems;
      }
      
      // If not in cache, make the API call
      const params: any = {};
      if (category) params.category = category;
      if (color) params.color = color;
      if (occasion) params.occasion = occasion;
      if (priceRange) {
        params.minPrice = priceRange.min;
        params.maxPrice = priceRange.max;
      }

      const response = await api.get('/marketplace', { params });
      
      // Cache the response
      setCacheItem(cacheKey, response.data, CACHE_EXPIRATION.MEDIUM);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      throw error;
    }
  },

  async searchMarketplace(
    query: string,
    category?: string,
    priceRange?: { min: number; max: number },
    sources?: string[]
  ): Promise<{ products: MarketplaceItem[]; query: string; totalCount: number; sources: string[] }> {
    try {
      const params: any = { q: query };
      if (category) params.category = category;
      if (priceRange) {
        params.minPrice = priceRange.min;
        params.maxPrice = priceRange.max;
      }
      if (sources) params.sources = sources.join(',');

      const response = await api.get('/marketplace/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching marketplace:', error);
      throw error;
    }
  },

  async getSmartShoppingList(occasions?: string[]): Promise<ShoppingListResponse> {
    try {
      // Generate cache key based on occasions
      const cacheKey = `${CACHE_KEYS.MARKETPLACE_ITEMS}_shopping_list_${occasions?.join('_') || 'all'}`;
      
      // Check cache first
      const cachedList = getCacheItem<ShoppingListResponse>(cacheKey);
      if (cachedList) {
        console.log('Using cached shopping list');
        return cachedList;
      }
      
      // If not in cache, make the API call
      const params: any = {};
      if (occasions && occasions.length > 0) {
        params.occasions = occasions.join(',');
      }

      const response = await api.get('/marketplace/shopping-list', { params });
      
      // Cache the response
      setCacheItem(cacheKey, response.data, CACHE_EXPIRATION.MEDIUM);
      
      return response.data;
    } catch (error) {
      console.error('Error generating smart shopping list:', error);
      throw error;
    }
  },

  async getTrendingItems(category?: string): Promise<{ trending: MarketplaceItem[]; category: string; terms: string[] }> {
    try {
      // Generate cache key based on category
      const cacheKey = `${CACHE_KEYS.TRENDING_ITEMS}_${category || 'all'}`;
      
      // Check cache first
      const cachedItems = getCacheItem<{ trending: MarketplaceItem[]; category: string; terms: string[] }>(cacheKey);
      if (cachedItems) {
        console.log('Using cached trending items');
        return cachedItems;
      }
      
      // If not in cache, make the API call
      const params: any = {};
      if (category) params.category = category;

      const response = await api.get('/marketplace/trending', { params });
      
      // Cache the response
      setCacheItem(cacheKey, response.data, CACHE_EXPIRATION.MEDIUM);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching trending items:', error);
      throw error;
    }
  }
};
