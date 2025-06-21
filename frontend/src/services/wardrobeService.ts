import { api } from './api';

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
    const response = await api.get('/wardrobe');
    return response.data;
  },

  async addItem(itemData: {
    name: string;
    category: string;
    color: string;
    image: File;
  }): Promise<WardrobeItem> {
    const formData = new FormData();
    formData.append('name', itemData.name);
    formData.append('category', itemData.category);
    formData.append('color', itemData.color);
    formData.append('image', itemData.image);
    // ADD THIS LOG
    console.log("FormData image:", formData.get('image'));
    if (itemData.image) {
      console.log("Image name:", itemData.image.name, "size:", itemData.image.size, "type:", itemData.image.type);
    }
    
    const response = await api.post('/wardrobe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/wardrobe/${id}`);
  },
};
