import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Sparkles, Zap } from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';

interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  savings?: string;
  features: string[];
  popular: boolean;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionService.getPlans();
      setPlans(response.plans);
      
      // Auto-select the popular plan
      const popularPlan = response.plans.find(plan => plan.popular);
      if (popularPlan) {
        setSelectedPlan(popularPlan.id);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      setIsSubscribing(true);
      await subscriptionService.subscribe(selectedPlan);
      onSuccess();
    } catch (error: any) {
      console.error('Subscription failed:', error);
      alert(error.message || 'Subscription failed. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Crown className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
                    <p className="text-purple-100">Unlock unlimited outfit recommendations</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-8">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <>
                  {/* Benefits */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">What you'll get:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 rounded-full p-2">
                          <Sparkles className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-gray-700">Unlimited outfit recommendations</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                          <Zap className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-gray-700">Smart shopping suggestions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 rounded-full p-2">
                          <Crown className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-gray-700">Priority support</span>
                      </div>
                    </div>
                  </div>

                  {/* Plans */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {plans.map((plan) => (
                      <motion.div
                        key={plan.id}
                        whileHover={{ scale: 1.02 }}
                        className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                              Most Popular
                            </span>
                          </div>
                        )}

                        <div className="text-center">
                          <h4 className="text-lg font-semibold mb-2">{plan.name}</h4>
                          <div className="mb-4">
                            <span className="text-3xl font-bold">${plan.price}</span>
                            <span className="text-gray-500">/{plan.duration}</span>
                          </div>
                          
                          {plan.originalPrice && (
                            <div className="mb-4">
                              <span className="text-sm text-gray-500 line-through">
                                ${plan.originalPrice}
                              </span>
                              <span className="ml-2 text-sm text-green-600 font-medium">
                                Save {plan.savings}
                              </span>
                            </div>
                          )}

                          <ul className="text-sm text-gray-600 space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {selectedPlan === plan.id && (
                          <div className="absolute inset-0 border-2 border-purple-500 rounded-lg pointer-events-none">
                            <div className="absolute top-2 right-2">
                              <div className="bg-purple-500 rounded-full p-1">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Subscribe Button */}
                  <div className="text-center">
                    <button
                      onClick={handleSubscribe}
                      disabled={!selectedPlan || isSubscribing}
                      className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubscribing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Subscribe Now'
                      )}
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-4">
                      * This is a demo subscription. No actual payment will be processed.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;
