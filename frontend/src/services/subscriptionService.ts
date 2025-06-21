import { api } from './api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  savings?: string;
  features: string[];
  popular: boolean;
}

export interface SubscriptionInfo {
  status: string;
  plan: string | null;
  startDate: string | null;
  endDate: string | null;
  isExpired: boolean;
  recommendationsUsed: number;
  freeRecommendationsLimit: number;
}

export interface AccessInfo {
  allowed: boolean;
  reason: string;
  remaining?: number;
  message?: string;
}

export const subscriptionService = {
  async getPlans(): Promise<{ plans: SubscriptionPlan[] }> {
    const response = await api.get('/subscription/plans');
    return response.data;
  },

  async getStatus(): Promise<{ subscription: SubscriptionInfo; access: AccessInfo }> {
    const response = await api.get('/subscription/status');
    return response.data;
  },

  async subscribe(plan: string): Promise<{ success: boolean; message: string; subscription: SubscriptionInfo }> {
    const response = await api.post('/subscription/subscribe', { plan });
    return response.data;
  },

  async cancel(): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/subscription/cancel');
    return response.data;
  },
};
