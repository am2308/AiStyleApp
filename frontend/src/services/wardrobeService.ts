import { api, apiWithCache } from './api';
import { getCacheItem, setCacheItem, CACHE_KEYS, CACHE_EXPIRATION } from '../utils/cacheUtils';
import { resizeImage } from '../utils/imageOptimizer';

export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  color: string;
  imageUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const wardrobeService = {
  async getItems(): Promise<WardrobeItem[]> {
    try {
      console.log('Making API request to /wardrobe');
      
      // Check cache first
      const cachedItems = getCacheItem<WardrobeItem[]>(CACHE_KEYS.WARDROBE_ITEMS);
      if (cachedItems) {
        console.log('Using cached wardrobe items');
        return cachedItems;
      }
      
      // If not in cache, make the API call
      const response = await api.get('/wardrobe');
      console.log('API response:', response.data);
      
      // Cache the response
      setCacheItem(CACHE_KEYS.WARDROBE_ITEMS, response.data, CACHE_EXPIRATION.SHORT);
      
      return response.data || [];
    } catch (error: any) {
      console.error('Error fetching wardrobe items:', error);
      
      // If it's a network error or API is not available, return empty array for demo
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('API not available, returning empty array for demo');
        return [];
      }
      
      throw error;
    }
  },

  async addItem(itemData: {
    name: string;
    category: string;
    color: string;
    image: File;
  }): Promise<WardrobeItem> {
    try {
      console.log('Preparing to add item:', {
        name: itemData.name,
        category: itemData.category,
        color: itemData.color,
        imageSize: itemData.image.size,
        imageType: itemData.image.type,
        imageName: itemData.image.name
      });
      
      // Resize the image before uploading
      const resizedImage = await resizeImage(itemData.image, 1200, 1200, 0.85);
      console.log('Image resized:', {
        originalSize: itemData.image.size,
        resizedSize: resizedImage.size,
        compressionRatio: (resizedImage.size / itemData.image.size).toFixed(2)
      });
      
      const formData = new FormData();
      formData.append('name', itemData.name);
      formData.append('category', itemData.category);
      formData.append('color', itemData.color);
      
      // Ensure the file is properly appended with the correct field name
      formData.append('image', resizedImage, resizedImage.name);
      
      // Log FormData contents for debugging
      console.log('FormData created with entries:');
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[0] === 'image' ? 'File object' : pair[1]}`);
      }
      
      // Make the API request without manually setting Content-Type
      const response = await api.post('/wardrobe', formData);
      
      console.log('Item added successfully:', response.data);
      
      // Invalidate the wardrobe items cache
      setCacheItem(CACHE_KEYS.WARDROBE_ITEMS, null, 0);
      
      return response.data;
    } catch (error: any) {
      console.error('Error in wardrobeService.addItem:', error);
      
      // For demo purposes, if API is not available, create a mock item
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('API not available, creating mock item for demo');
        const mockItem: WardrobeItem = {
          id: Date.now().toString(),
          name: itemData.name,
          category: itemData.category,
          color: itemData.color,
          imageUrl: URL.createObjectURL(itemData.image),
          userId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return mockItem;
      }
      
      throw error;
    }
  },

  async deleteItem(id: string): Promise<void> {
    try {
      await api.delete(`/wardrobe/${id}`);
      
      // Invalidate the wardrobe items cache
      setCacheItem(CACHE_KEYS.WARDROBE_ITEMS, null, 0);
    } catch (error: any) {
      console.error('Error deleting wardrobe item:', error);
      
      // For demo purposes, if API is not available, just log and continue
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('API not available, mock deleting item for demo');
        return;
      }
      
      throw error;
    }
  },
};
