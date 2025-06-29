// RevenueCat service implementation
// This is a mock implementation since we're not using the actual RevenueCat SDK

// Define interfaces for RevenueCat types
interface RevenueCatOptions {
  publicApiKey: string;
}

interface Offering {
  identifier: string;
  serverDescription: string;
  availablePackages: Package[];
}

interface Package {
  identifier: string;
  packageType: string;
  product: Product;
  offeringIdentifier: string;
}

interface Product {
  identifier: string;
  description: string;
  title: string;
  price: number;
  priceString: string;
  currencyCode: string;
}

interface CustomerInfo {
  originalAppUserId: string;
  entitlements: {
    [key: string]: {
      identifier: string;
      isActive: boolean;
      willRenew: boolean;
      periodType: string;
      latestPurchaseDate: string;
      originalPurchaseDate: string;
      expirationDate: string | null;
      productIdentifier: string;
      isSandbox: boolean;
    }
  };
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
}

// Mock RevenueCat class
class RevenueCatMock {
  private publicApiKey: string;
  private userId: string | null = null;
  private mockCustomerInfo: CustomerInfo | null = null;
  private mockOfferings: Offering[] = [];

  constructor(options: RevenueCatOptions) {
    this.publicApiKey = options.publicApiKey;
    console.log('RevenueCat initialized with public key:', this.publicApiKey);
    
    // Initialize mock offerings
    this.mockOfferings = [
      {
        identifier: 'monthly',
        serverDescription: 'Monthly subscription',
        availablePackages: [
          {
            identifier: 'monthly_standard',
            packageType: 'MONTHLY',
            product: {
              identifier: 'com.styleai.monthly',
              title: 'Monthly Premium',
              description: 'Full access to all StyleAI features',
              price: 9.99,
              priceString: '$9.99',
              currencyCode: 'USD'
            },
            offeringIdentifier: 'monthly'
          }
        ]
      },
      {
        identifier: 'quarterly',
        serverDescription: 'Quarterly subscription',
        availablePackages: [
          {
            identifier: 'quarterly_standard',
            packageType: 'THREE_MONTH',
            product: {
              identifier: 'com.styleai.quarterly',
              title: '3 Months Premium',
              description: 'Full access to all StyleAI features',
              price: 24.99,
              priceString: '$24.99',
              currencyCode: 'USD'
            },
            offeringIdentifier: 'quarterly'
          }
        ]
      },
      {
        identifier: 'annual',
        serverDescription: 'Annual subscription',
        availablePackages: [
          {
            identifier: 'annual_standard',
            packageType: 'ANNUAL',
            product: {
              identifier: 'com.styleai.annual',
              title: 'Annual Premium',
              description: 'Full access to all StyleAI features',
              price: 79.99,
              priceString: '$79.99',
              currencyCode: 'USD'
            },
            offeringIdentifier: 'annual'
          }
        ]
      }
    ];
  }

  async identify(userId: string): Promise<void> {
    this.userId = userId;
    console.log('RevenueCat identified user:', userId);
    
    // Initialize mock customer info
    this.mockCustomerInfo = {
      originalAppUserId: userId,
      entitlements: {},
      activeSubscriptions: [],
      allPurchasedProductIdentifiers: []
    };
    
    return Promise.resolve();
  }

  async getOfferings(): Promise<Offering[]> {
    console.log('RevenueCat getOfferings called');
    return Promise.resolve(this.mockOfferings);
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    console.log('RevenueCat getCustomerInfo called');
    if (!this.mockCustomerInfo) {
      throw new Error('User not identified');
    }
    return Promise.resolve(this.mockCustomerInfo);
  }

  async purchasePackage(packageObject: Package): Promise<CustomerInfo> {
    console.log('RevenueCat purchasePackage called with:', packageObject);
    
    if (!this.mockCustomerInfo) {
      throw new Error('User not identified');
    }
    
    // Simulate purchase
    const now = new Date();
    const expirationDate = new Date();
    
    // Set expiration based on package type
    if (packageObject.packageType === 'MONTHLY') {
      expirationDate.setMonth(expirationDate.getMonth() + 1);
    } else if (packageObject.packageType === 'THREE_MONTH') {
      expirationDate.setMonth(expirationDate.getMonth() + 3);
    } else if (packageObject.packageType === 'ANNUAL') {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }
    
    // Update mock customer info
    this.mockCustomerInfo.entitlements.premium = {
      identifier: 'premium',
      isActive: true,
      willRenew: true,
      periodType: packageObject.packageType,
      latestPurchaseDate: now.toISOString(),
      originalPurchaseDate: now.toISOString(),
      expirationDate: expirationDate.toISOString(),
      productIdentifier: packageObject.product.identifier,
      isSandbox: true
    };
    
    this.mockCustomerInfo.activeSubscriptions = [packageObject.product.identifier];
    this.mockCustomerInfo.allPurchasedProductIdentifiers = [packageObject.product.identifier];
    
    return Promise.resolve(this.mockCustomerInfo);
  }

  async restorePurchases(): Promise<CustomerInfo> {
    console.log('RevenueCat restorePurchases called');
    
    if (!this.mockCustomerInfo) {
      throw new Error('User not identified');
    }
    
    // In a real implementation, this would check with the store
    // For our mock, we'll just return the current state
    return Promise.resolve(this.mockCustomerInfo);
  }
}

// Export a mock RevenueCat class
export const RevenueCat = RevenueCatMock;

// Export the service functions
export const revenueCatService = {
  /**
   * Initialize RevenueCat with user ID
   */
  initialize: async (userId: string): Promise<void> => {
    try {
      const revenueCat = new RevenueCatMock({
        publicApiKey: import.meta.env.VITE_REVENUECAT_PUBLIC_KEY || 'your_public_key_here',
      });
      
      await revenueCat.identify(userId);
      console.log('RevenueCat initialized with user ID:', userId);
      
      // Store the instance in window for reuse
      (window as any).revenueCatInstance = revenueCat;
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  },

  /**
   * Get available offerings
   */
  getOfferings: async (): Promise<Offering[]> => {
    try {
      const revenueCat = (window as any).revenueCatInstance as RevenueCatMock;
      if (!revenueCat) {
        throw new Error('RevenueCat not initialized');
      }
      
      const offerings = await revenueCat.getOfferings();
      return offerings;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      throw error;
    }
  },

  /**
   * Get customer info
   */
  getCustomerInfo: async (): Promise<CustomerInfo> => {
    try {
      const revenueCat = (window as any).revenueCatInstance as RevenueCatMock;
      if (!revenueCat) {
        throw new Error('RevenueCat not initialized');
      }
      
      const customerInfo = await revenueCat.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  },

  /**
   * Purchase a package
   */
  purchasePackage: async (packageObject: Package): Promise<CustomerInfo> => {
    try {
      const revenueCat = (window as any).revenueCatInstance as RevenueCatMock;
      if (!revenueCat) {
        throw new Error('RevenueCat not initialized');
      }
      
      const customerInfo = await revenueCat.purchasePackage(packageObject);
      return customerInfo;
    } catch (error) {
      console.error('Failed to purchase package:', error);
      throw error;
    }
  },

  /**
   * Restore purchases
   */
  restorePurchases: async (): Promise<CustomerInfo> => {
    try {
      const revenueCat = (window as any).revenueCatInstance as RevenueCatMock;
      if (!revenueCat) {
        throw new Error('RevenueCat not initialized');
      }
      
      const customerInfo = await revenueCat.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  },

  /**
   * Check if user has active subscription
   */
  hasActiveSubscription: async (entitlementId: string = 'premium'): Promise<boolean> => {
    try {
      const revenueCat = (window as any).revenueCatInstance as RevenueCatMock;
      if (!revenueCat) {
        throw new Error('RevenueCat not initialized');
      }
      
      const customerInfo = await revenueCat.getCustomerInfo();
      return customerInfo.entitlements[entitlementId]?.isActive || false;
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return false;
    }
  },

  /**
   * Get subscription expiration date
   */
  getSubscriptionExpirationDate: async (entitlementId: string = 'premium'): Promise<string | null> => {
    try {
      const revenueCat = (window as any).revenueCatInstance as RevenueCatMock;
      if (!revenueCat) {
        throw new Error('RevenueCat not initialized');
      }
      
      const customerInfo = await revenueCat.getCustomerInfo();
      return customerInfo.entitlements[entitlementId]?.expirationDate || null;
    } catch (error) {
      console.error('Failed to get subscription expiration date:', error);
      return null;
    }
  }
};
