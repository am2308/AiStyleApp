import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  RefreshCw,
  ArrowRight,
  Star,
  Award,
  Calendar
} from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import FashionBackground from '../components/FashionBackground';
import toast from 'react-hot-toast';

const SubscriptionPage: React.FC = () => {
  const { 
    isSubscribed, 
    isLoading, 
    offerings, 
    customerInfo, 
    expirationDate,
    getOfferings, 
    purchasePackage, 
    restorePurchases,
    checkSubscriptionStatus
  } = useSubscription();
  
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Fetch offerings when component mounts
  useEffect(() => {
    const loadOfferings = async () => {
      try {
        await getOfferings();
      } catch (error) {
        console.error('Failed to load offerings:', error);
      }
    };

    loadOfferings();
  }, [getOfferings]);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days remaining in subscription
  const getDaysRemaining = (dateString: string | null) => {
    if (!dateString) return 0;
    
    const expirationDate = new Date(dateString);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Handle package selection
  const handleSelectPackage = (pkg: any) => {
    setSelectedPackage(pkg);
  };

  // Handle purchase
  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error('Please select a subscription plan');
      return;
    }

    try {
      setIsPurchasing(true);
      await purchasePackage(selectedPackage);
      toast.success('Subscription purchased successfully!');
    } catch (error: any) {
      // User cancellation is already handled in the service
      if (!error.message?.includes('cancelled')) {
        toast.error('Failed to complete purchase');
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  // Handle restore purchases
  const handleRestorePurchases = async () => {
    try {
      setIsRestoring(true);
      await restorePurchases();
    } catch (error) {
      toast.error('Failed to restore purchases');
    } finally {
      setIsRestoring(false);
    }
  };

  // Refresh subscription status
  const handleRefreshStatus = async () => {
    try {
      await checkSubscriptionStatus();
      toast.success('Subscription status updated');
    } catch (error) {
      toast.error('Failed to update subscription status');
    }
  };

  // Mock offerings for development/preview
  const mockOfferings = [
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

  // Use mock offerings if real ones aren't available
  const displayOfferings = offerings || mockOfferings;

  // Premium features list
  const premiumFeatures = [
    'Unlimited outfit recommendations',
    'Advanced 3D virtual try-on',
    'Smart shopping suggestions',
    'Priority support',
    'Ad-free experience',
    'Exclusive style challenges',
    'Advanced style analytics',
    'Early access to new features'
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aesthetic Background */}
      <FashionBackground />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">StyleAI Premium</h1>
                <p className="text-gray-600">Unlock the full potential of your personal stylist</p>
              </div>
            </div>
          </motion.div>

          {/* Subscription Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Subscription Status</h2>
              <button
                onClick={handleRefreshStatus}
                disabled={isLoading}
                className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : isSubscribed ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Crown className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Premium Active</h3>
                    <p className="text-green-700">You have full access to all premium features</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/80 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <h4 className="font-medium text-gray-900">Expiration Date</h4>
                    </div>
                    <p className="text-gray-700">{formatDate(expirationDate)}</p>
                  </div>
                  
                  <div className="bg-white/80 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-4 h-4 text-green-600" />
                      <h4 className="font-medium text-gray-900">Time Remaining</h4>
                    </div>
                    <p className="text-gray-700">{getDaysRemaining(expirationDate)} days</p>
                  </div>
                  
                  <div className="bg-white/80 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Award className="w-4 h-4 text-green-600" />
                      <h4 className="font-medium text-gray-900">Plan</h4>
                    </div>
                    <p className="text-gray-700">
                      {customerInfo?.entitlements?.premium?.productIdentifier === 'com.styleai.monthly' ? 'Monthly' :
                       customerInfo?.entitlements?.premium?.productIdentifier === 'com.styleai.quarterly' ? 'Quarterly' :
                       customerInfo?.entitlements?.premium?.productIdentifier === 'com.styleai.annual' ? 'Annual' :
                       'Premium'}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleRestorePurchases}
                    disabled={isRestoring}
                    className="flex items-center space-x-2 px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    {isRestoring ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600 mr-2"></div>
                        <span>Restoring...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Restore Purchases</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-yellow-100 rounded-full p-3">
                    <Crown className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900">Free Plan</h3>
                    <p className="text-yellow-700">Upgrade to unlock all premium features</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/80 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Sparkles className="w-4 h-4 text-yellow-600" />
                      <h4 className="font-medium text-gray-900">Free Recommendations</h4>
                    </div>
                    <p className="text-gray-700">3 outfit recommendations per month</p>
                  </div>
                  
                  <div className="bg-white/80 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <ShieldCheck className="w-4 h-4 text-yellow-600" />
                      <h4 className="font-medium text-gray-900">Limited Features</h4>
                    </div>
                    <p className="text-gray-700">Basic functionality only</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleRestorePurchases}
                    disabled={isRestoring}
                    className="flex items-center space-x-2 px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
                  >
                    {isRestoring ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-600 mr-2"></div>
                        <span>Restoring...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Restore Purchases</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Subscription Plans */}
          {!isSubscribed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Plan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {displayOfferings.map((offering) => {
                  const pkg = offering.availablePackages[0];
                  const product = pkg.product;
                  
                  // Determine if this is the quarterly plan (best value)
                  const isQuarterly = offering.identifier === 'quarterly';
                  
                  // Calculate savings for quarterly and annual plans
                  let savings = null;
                  if (offering.identifier === 'quarterly') {
                    // 3 months at monthly price would be 9.99 * 3 = 29.97
                    // So savings is 29.97 - 24.99 = 4.98, which is about 17%
                    savings = {
                      amount: 4.98,
                      percentage: 17
                    };
                  } else if (offering.identifier === 'annual') {
                    // 12 months at monthly price would be 9.99 * 12 = 119.88
                    // So savings is 119.88 - 79.99 = 39.89, which is about 33%
                    savings = {
                      amount: 39.89,
                      percentage: 33
                    };
                  }
                  
                  return (
                    <motion.div
                      key={offering.identifier}
                      whileHover={{ scale: 1.02 }}
                      className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        selectedPackage?.identifier === pkg.identifier
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      } ${isQuarterly ? 'ring-2 ring-purple-500' : ''}`}
                      onClick={() => handleSelectPackage(pkg)}
                    >
                      {isQuarterly && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Best Value
                          </span>
                        </div>
                      )}

                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                        <div className="mb-4">
                          <span className="text-3xl font-bold">{product.priceString}</span>
                          <span className="text-gray-500">/{offering.identifier === 'monthly' ? 'month' : 
                                                           offering.identifier === 'quarterly' ? '3 months' : 
                                                           'year'}</span>
                        </div>
                        
                        {savings && (
                          <div className="mb-4">
                            <span className="text-sm text-gray-500 line-through">
                              ${offering.identifier === 'quarterly' ? '29.97' : '119.88'}
                            </span>
                            <span className="ml-2 text-sm text-green-600 font-medium">
                              Save {savings.percentage}%
                            </span>
                          </div>
                        )}

                        <ul className="text-sm text-gray-600 space-y-2 mb-6">
                          {premiumFeatures.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedPackage?.identifier === pkg.identifier && (
                        <div className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none">
                          <div className="absolute top-2 right-2">
                            <div className="bg-purple-500 rounded-full p-1">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Purchase Button */}
              <div className="text-center">
                <button
                  onClick={handlePurchase}
                  disabled={!selectedPackage || isPurchasing}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPurchasing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Subscribe Now
                      <ArrowRight className="inline ml-2" size={16} />
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 mt-4">
                  Subscription will automatically renew. Cancel anytime.
                </p>
              </div>
            </motion.div>
          )}

          {/* Premium Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Premium Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-900">Unlimited Recommendations</h3>
                </div>
                <p className="text-purple-700 mb-4">
                  Get unlimited AI-powered outfit recommendations tailored to your style, body type, and preferences.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-purple-800">Personalized for every occasion</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-purple-800">Advanced color coordination</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-purple-800">Seasonal style updates</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">Advanced 3D Try-On</h3>
                </div>
                <p className="text-blue-700 mb-4">
                  Experience enhanced 3D visualization with photorealistic rendering and advanced customization.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-blue-800">High-resolution textures</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-blue-800">Multiple lighting environments</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-blue-800">Advanced pose customization</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 rounded-full p-2">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900">Smart Shopping</h3>
                </div>
                <p className="text-green-700 mb-4">
                  Get personalized shopping recommendations that perfectly complement your existing wardrobe.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-green-800">Wardrobe gap analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-green-800">Price comparison across retailers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-green-800">Exclusive deals and discounts</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-amber-100 rounded-full p-2">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-amber-900">Premium Community</h3>
                </div>
                <p className="text-amber-700 mb-4">
                  Join an exclusive community of fashion enthusiasts and get expert style advice.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-amber-800">VIP style challenges</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-amber-800">Early access to new features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-amber-800">Priority support</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What Our Premium Users Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150"
                    alt="Sarah Chen"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Chen</h4>
                    <p className="text-sm text-gray-600">Fashion Blogger</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "StyleAI Premium has revolutionized how I plan my outfits. The 3D visualization is incredible and the recommendations are spot-on!"
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=150"
                    alt="Michael Johnson"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Michael Johnson</h4>
                    <p className="text-sm text-gray-600">Business Professional</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "I save 40 minutes every morning with StyleAI Premium. The AI knows my style better than I do! Worth every penny."
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=150"
                    alt="Emma Rodriguez"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">Emma Rodriguez</h4>
                    <p className="text-sm text-gray-600">College Student</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "The smart shopping feature alone is worth the subscription. I've discovered amazing pieces that perfectly complement my wardrobe."
                </p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">How does billing work?</h3>
                <p className="text-gray-600">
                  Your subscription will be charged to your payment method immediately upon purchase. 
                  It will automatically renew at the end of your billing cycle unless you cancel.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. Your premium access will continue until the end of your current billing period.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">What happens to my data if I cancel?</h3>
                <p className="text-gray-600">
                  Your wardrobe data and preferences will be preserved even if you cancel your subscription. 
                  You'll still have access to your items, but premium features will be limited.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">How do I restore my subscription on a new device?</h3>
                <p className="text-gray-600">
                  Simply click the "Restore Purchases" button on this page after logging in with your account.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          {!isSubscribed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-xl text-center text-white"
            >
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Style?</h2>
              <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
                Join thousands of users who have revolutionized their fashion journey with StyleAI Premium
              </p>
              
              <button
                onClick={handlePurchase}
                disabled={!selectedPackage || isPurchasing}
                className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPurchasing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-600 mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    Get Premium Now
                    <ArrowRight className="inline ml-2" size={16} />
                  </>
                )}
              </button>
              
              <p className="mt-4 text-sm text-white/80">
                30-day satisfaction guarantee. Cancel anytime.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
