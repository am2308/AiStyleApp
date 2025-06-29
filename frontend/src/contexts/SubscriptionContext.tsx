import React, { createContext, useContext, useState, useEffect } from 'react';
import { revenueCatService } from '../services/revenueCatService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface SubscriptionContextType {
  isSubscribed: boolean;
  isLoading: boolean;
  offerings: any[] | null;
  customerInfo: any | null;
  expirationDate: string | null;
  getOfferings: () => Promise<void>;
  purchasePackage: (packageObject: any) => Promise<void>;
  restorePurchases: () => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [offerings, setOfferings] = useState<any[] | null>(null);
  const [customerInfo, setCustomerInfo] = useState<any | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);

  // Initialize RevenueCat when user is authenticated
  useEffect(() => {
    const initializeRevenueCat = async () => {
      if (isAuthenticated && user?.id) {
        try {
          await revenueCatService.initialize(user.id);
          await checkSubscriptionStatus();
        } catch (error) {
          console.error('Failed to initialize RevenueCat:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeRevenueCat();
  }, [isAuthenticated, user]);

  const checkSubscriptionStatus = async () => {
    if (!isAuthenticated) {
      setIsSubscribed(false);
      setCustomerInfo(null);
      setExpirationDate(null);
      return;
    }

    try {
      setIsLoading(true);
      const hasSubscription = await revenueCatService.hasActiveSubscription();
      setIsSubscribed(hasSubscription);

      const customerInfo = await revenueCatService.getCustomerInfo();
      setCustomerInfo(customerInfo);

      const expDate = await revenueCatService.getSubscriptionExpirationDate();
      setExpirationDate(expDate);
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOfferings = async () => {
    try {
      setIsLoading(true);
      const offerings = await revenueCatService.getOfferings();
      setOfferings(offerings);
    } catch (error) {
      console.error('Failed to get offerings:', error);
      toast.error('Failed to load subscription options');
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePackage = async (packageObject: any) => {
    try {
      setIsLoading(true);
      const customerInfo = await revenueCatService.purchasePackage(packageObject);
      setCustomerInfo(customerInfo);
      setIsSubscribed(true);
      
      // Get updated expiration date
      const expDate = await revenueCatService.getSubscriptionExpirationDate();
      setExpirationDate(expDate);
      
      toast.success('Subscription purchased successfully!');
    } catch (error: any) {
      console.error('Failed to purchase package:', error);
      
      // Handle user cancellation separately
      if (error.message?.includes('cancelled')) {
        toast.error('Purchase cancelled');
      } else {
        toast.error('Failed to complete purchase');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      const customerInfo = await revenueCatService.restorePurchases();
      setCustomerInfo(customerInfo);
      
      // Check if user has active subscription after restore
      const hasSubscription = await revenueCatService.hasActiveSubscription();
      setIsSubscribed(hasSubscription);
      
      // Get updated expiration date
      const expDate = await revenueCatService.getSubscriptionExpirationDate();
      setExpirationDate(expDate);
      
      if (hasSubscription) {
        toast.success('Subscription restored successfully!');
      } else {
        toast.info('No active subscriptions found');
      }
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      toast.error('Failed to restore purchases');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        isLoading,
        offerings,
        customerInfo,
        expirationDate,
        getOfferings,
        purchasePackage,
        restorePurchases,
        checkSubscriptionStatus
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
