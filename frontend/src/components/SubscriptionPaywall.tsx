import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Sparkles, Zap, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Link } from 'react-router-dom';

interface SubscriptionPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'recommendations' | 'tryOn' | 'shopping' | 'community';
  remainingUses?: number;
}

const SubscriptionPaywall: React.FC<SubscriptionPaywallProps> = ({ 
  isOpen, 
  onClose, 
  feature,
  remainingUses = 0
}) => {
  const { offerings, purchasePackage } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Feature-specific content
  const featureContent = {
    recommendations: {
      title: 'Unlimited Outfit Recommendations',
      description: 'Get personalized outfit suggestions for any occasion, tailored to your style and preferences.',
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
      benefits: [
        'Unlimited AI-powered outfit recommendations',
        'Personalized for your body type and style',
        'Occasion-specific styling',
        'Advanced color coordination'
      ]
    },
    tryOn: {
      title: 'Advanced 3D Try-On',
      description: 'See how clothes look on your personalized 3D model with realistic rendering and lighting.',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600',
      benefits: [
        'High-resolution 3D visualization',
        'Multiple lighting environments',
        'Advanced pose customization',
        'Photo try-on with AR technology'
      ]
    },
    shopping: {
      title: 'Smart Shopping Recommendations',
      description: 'Discover items that perfectly complement your existing wardrobe and fill style gaps.',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600',
      benefits: [
        'Personalized shopping suggestions',
        'Wardrobe gap analysis',
        'Price comparison across retailers',
        'Exclusive deals and discounts'
      ]
    },
    community: {
      title: 'Premium Community Features',
      description: 'Join an exclusive community of fashion enthusiasts and participate in style challenges.',
      image: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=600',
      benefits: [
        'VIP style challenges with prizes',
        'Early access to new features',
        'Priority support',
        'Exclusive community events'
      ]
    }
  };

  const content = featureContent[feature];

  // Mock offerings if real ones aren't available
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

  // Handle purchase
  const handlePurchase = async () => {
    if (!selectedPackage) return;

    try {
      setIsPurchasing(true);
      await purchasePackage(selectedPackage);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
              onClick={onClose}
            />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Feature Image */}
              <div className="relative h-48">
                <img 
                  src={content.image} 
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 bg-white/80 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white transition-colors"
                >
                  <X size={20} />
                </button>
                
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-2">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{content.title}</h2>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Feature Description */}
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">{content.description}</p>
                  
                  {/* Free Uses Remaining */}
                  {remainingUses > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                          <Zap className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900">Free Uses Remaining: {remainingUses}</h4>
                          <p className="text-sm text-blue-700">
                            Upgrade to premium for unlimited access
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Benefits */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                    <h3 className="font-medium text-purple-900 mb-3">Premium Benefits</h3>
                    <ul className="space-y-2">
                      {content.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <Sparkles className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                          <span className="text-purple-800">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Subscription Options */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Choose Your Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayOfferings.map((offering) => {
                      const pkg = offering.availablePackages[0];
                      const product = pkg.product;
                      
                      // Calculate savings for annual plan
                      let savingsText = null;
                      if (offering.identifier === 'annual') {
                        savingsText = 'Save 33%';
                      }
                      
                      return (
                        <motion.div
                          key={offering.identifier}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedPackage?.identifier === pkg.identifier
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">{product.title}</h4>
                              <div className="flex items-center">
                                <span className="text-lg font-bold text-gray-900">{product.priceString}</span>
                                <span className="text-sm text-gray-500 ml-1">
                                  /{offering.identifier === 'monthly' ? 'month' : 'year'}
                                </span>
                              </div>
                              {savingsText && (
                                <span className="text-xs text-green-600 font-medium">{savingsText}</span>
                              )}
                            </div>
                            
                            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                              {selectedPackage?.identifier === pkg.identifier && (
                                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Testimonial */}
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src="https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150"
                      alt="Sarah Chen"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">Sarah Chen</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "StyleAI Premium has completely transformed my daily routine. The recommendations are spot-on and the 3D try-on feature is incredible!"
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handlePurchase}
                    disabled={!selectedPackage || isPurchasing}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50"
                  >
                    {isPurchasing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-5 h-5" />
                        <span>Subscribe Now</span>
                      </>
                    )}
                  </button>
                  
                  <Link
                    to="/subscription"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={onClose}
                  >
                    <span>View All Plans</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Subscription will automatically renew. Cancel anytime.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionPaywall;
