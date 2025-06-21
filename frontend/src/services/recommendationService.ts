import { api } from './api';

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
    const response = await api.get('/recommendations', {
      params: { occasion }
    });
    return response.data;
  },

  async getRecommendationsForItems(itemIds: string[], occasion?: string): Promise<RecommendationResponse> {
    const response = await api.post('/recommendations/for-items', {
      itemIds,
      occasion
    });
    return response.data;
  },

  async getMarketplaceItems(
    category?: string, 
    color?: string, 
    occasion?: string,
    priceRange?: { min: number; max: number }
  ): Promise<MarketplaceResponse> {
    const params: any = {};
    if (category) params.category = category;
    if (color) params.color = color;
    if (occasion) params.occasion = occasion;
    if (priceRange) {
      params.minPrice = priceRange.min;
      params.maxPrice = priceRange.max;
    }

    const response = await api.get('/marketplace', { params });
    return response.data;
  },

  async searchMarketplace(
    query: string,
    category?: string,
    priceRange?: { min: number; max: number },
    sources?: string[]
  ): Promise<{ products: MarketplaceItem[]; query: string; totalCount: number; sources: string[] }> {
    const params: any = { q: query };
    if (category) params.category = category;
    if (priceRange) {
      params.minPrice = priceRange.min;
      params.maxPrice = priceRange.max;
    }
    if (sources) params.sources = sources.join(',');

    const response = await api.get('/marketplace/search', { params });
    return response.data;
  },

  async getSmartShoppingList(occasions?: string[]): Promise<ShoppingListResponse> {
    const params: any = {};
    if (occasions && occasions.length > 0) {
      params.occasions = occasions.join(',');
    }

    const response = await api.get('/marketplace/shopping-list', { params });
    return response.data;
  },

  async getTrendingItems(category?: string): Promise<{ trending: MarketplaceItem[]; category: string; terms: string[] }> {
    const params: any = {};
    if (category) params.category = category;

    const response = await api.get('/marketplace/trending', { params });
    return response.data;
  }
};
