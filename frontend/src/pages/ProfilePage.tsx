import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { User, Save, Crown, Calendar, Zap, Settings, Sparkles, TrendingUp, Award } from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import SubscriptionModal from '../components/SubscriptionModal';
import FashionBackground from '../components/FashionBackground';
import { motion } from 'framer-motion';

interface ProfileForm {
  name: string;
  skinTone: string;
  bodyType: string;
  preferredStyle: string;
}

interface SubscriptionInfo {
  status: string;
  plan: string | null;
  startDate: string | null;
  endDate: string | null;
  isExpired: boolean;
  recommendationsUsed: number;
  freeRecommendationsLimit: number;
}

interface AccessInfo {
  allowed: boolean;
  reason: string;
  remaining?: number;
  message?: string;
}

const skinTones = [
  'Very Fair',
  'Fair',
  'Light',
  'Medium',
  'Tan',
  'Deep',
  'Very Deep',
];

const bodyTypes = [
  'Pear',
  'Apple',
  'Hourglass',
  'Rectangle',
  'Inverted Triangle',
];

const styles = [
  'Casual',
  'Business',
  'Formal',
  'Bohemian',
  'Minimalist',
  'Trendy',
  'Classic',
];

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [accessInfo, setAccessInfo] = useState<AccessInfo | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      skinTone: user?.skinTone || '',
      bodyType: user?.bodyType || '',
      preferredStyle: user?.preferredStyle || '',
    },
  });

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setIsLoadingSubscription(true);
      const response = await subscriptionService.getStatus();
      setSubscriptionInfo(response.subscription);
      setAccessInfo(response.access);
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      setIsLoading(true);
      await updateProfile(data);
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscriptionSuccess = () => {
    setShowSubscriptionModal(false);
    fetchSubscriptionStatus();
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSubscriptionStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'cancelled': return 'Cancelled';
      case 'expired': return 'Expired';
      default: return 'Free Trial';
    }
  };

  const getPlanDisplayName = (plan: string | null) => {
    if (!plan) return 'Free Trial';
    
    const planNames: { [key: string]: string } = {
      '1_month': '1 Month Premium',
      '3_months': '3 Months Premium',
      '6_months': '6 Months Premium',
      '1_year': '1 Year Premium'
    };
    
    return planNames[plan] || plan;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aesthetic Background */}
      <FashionBackground />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl border border-white/20"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Style Profile Settings</h1>
                <p className="text-sm text-gray-600">
                  Personalize your profile for better outfit recommendations
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                type="text"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="skinTone" className="block text-sm font-medium text-gray-700">
                  Skin Tone
                </label>
                <select
                  {...register('skinTone', { required: 'Please select your skin tone' })}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90"
                >
                  <option value="">Select your skin tone</option>
                  {skinTones.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
                {errors.skinTone && (
                  <p className="mt-1 text-sm text-red-600">{errors.skinTone.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700">
                  Body Type
                </label>
                <select
                  {...register('bodyType', { required: 'Please select your body type' })}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90"
                >
                  <option value="">Select your body type</option>
                  {bodyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.bodyType && (
                  <p className="mt-1 text-sm text-red-600">{errors.bodyType.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="preferredStyle" className="block text-sm font-medium text-gray-700">
                  Preferred Style
                </label>
                <select
                  {...register('preferredStyle', { required: 'Please select your preferred style' })}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90"
                >
                  <option value="">Select your preferred style</option>
                  {styles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
                {errors.preferredStyle && (
                  <p className="mt-1 text-sm text-red-600">{errors.preferredStyle.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50"
              >
                <Save size={18} />
                <span>{isLoading ? 'Saving...' : 'Save Profile'}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Subscription Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl border border-white/20"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Subscription & Usage</h2>
                <p className="text-sm text-gray-600">
                  Manage your subscription and track your usage
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoadingSubscription ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 rounded-full p-3">
                        <Crown className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getPlanDisplayName(subscriptionInfo?.plan ?? null)}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusColor(subscriptionInfo?.status || 'free')}`}>
                            {getSubscriptionStatusText(subscriptionInfo?.status || 'free')}
                          </span>
                          {subscriptionInfo?.endDate && subscriptionInfo.status === 'active' && (
                            <span className="text-sm text-gray-600">
                              • Expires {new Date(subscriptionInfo.endDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {subscriptionInfo?.status !== 'active' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSubscriptionModal(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                      >
                        Upgrade Now
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recommendations Usage */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-gray-900">Recommendations Usage</h4>
                    </div>
                    
                    {subscriptionInfo?.status === 'active' ? (
                      <div>
                        <p className="text-2xl font-bold text-green-600">Unlimited</p>
                        <p className="text-sm text-gray-600">Premium subscription active</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline space-x-2 mb-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {accessInfo?.remaining || 0}
                          </span>
                          <span className="text-sm text-gray-600">
                            of {subscriptionInfo?.freeRecommendationsLimit || 3} remaining
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${((accessInfo?.remaining || 0) / (subscriptionInfo?.freeRecommendationsLimit || 3)) * 100}%` 
                            }}
                          ></div>
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          {subscriptionInfo?.recommendationsUsed || 0} recommendations used
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Account Info */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-gray-900">Account Information</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Member since</p>
                        <p className="font-medium">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      
                      {subscriptionInfo?.startDate && (
                        <div>
                          <p className="text-sm text-gray-600">Subscription started</p>
                          <p className="font-medium">
                            {new Date(subscriptionInfo.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subscription Actions */}
                {subscriptionInfo?.status === 'active' && (
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Subscription Management</h4>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowSubscriptionModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={16} />
                        <span>Change Plan</span>
                      </button>
                      
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to cancel your subscription?')) {
                            try {
                              await subscriptionService.cancel();
                              fetchSubscriptionStatus();
                            } catch (error) {
                              console.error('Failed to cancel subscription:', error);
                            }
                          }
                        }}
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                )}

                {/* Free Trial Info */}
                {subscriptionInfo?.status !== 'active' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Free Trial Limitations</h4>
                        <p className="text-sm text-yellow-800 mt-1">
                          You have {accessInfo?.remaining || 0} free recommendations remaining. 
                          Upgrade to Premium for unlimited outfit suggestions and smart shopping features.
                        </p>
                        <button
                          onClick={() => setShowSubscriptionModal(true)}
                          className="mt-3 text-sm font-medium text-yellow-900 hover:text-yellow-700 underline"
                        >
                          View Premium Plans →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Style Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl border border-white/20"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Style Achievements</h2>
                <p className="text-sm text-gray-600">
                  Track your fashion journey milestones
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Style Explorer</h4>
                <p className="text-sm text-gray-600">Complete your profile</p>
                <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full w-full"></div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4 text-center">
                <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Wardrobe Builder</h4>
                <p className="text-sm text-gray-600">Add 10 items to wardrobe</p>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 text-center">
                <Crown className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900">Style Master</h4>
                <p className="text-sm text-gray-600">Get 50 recommendations</p>
                <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subscription Modal */}
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onSuccess={handleSubscriptionSuccess}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
