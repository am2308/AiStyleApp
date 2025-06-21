import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shirt, 
  Sparkles, 
  ShoppingBag, 
  User, 
  TrendingUp, 
  Calendar, 
  Award, 
  Users, 
  ArrowRight, 
  Heart, 
  MessageCircle, 
  Share2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWardrobe } from '../contexts/WardrobeContext';
import { recommendationService } from '../services/recommendationService';
import { communityService } from '../services/communityService';
import FashionBackground from '../components/FashionBackground';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { items } = useWardrobe();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [trendingItems, setTrendingItems] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch data in parallel
        const [recsResponse, trendingResponse, challengesResponse, postsResponse] = await Promise.all([
          recommendationService.getOutfitRecommendations(),
          recommendationService.getTrendingItems(),
          communityService.getChallenges(),
          communityService.getPosts()
        ]);
        
        setRecommendations(recsResponse.recommendations || []);
        setTrendingItems(trendingResponse.trending || []);
        setChallenges(challengesResponse || []);
        setCommunityPosts(postsResponse || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get active challenges
  const activeChallenges = challenges.filter(challenge => challenge.isActive);
  
  // Get trending community posts
  const trendingPosts = communityPosts.slice(0, 3);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aesthetic Background */}
      <FashionBackground />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
                <p className="text-gray-600">Your personal AI stylist is ready to inspire you today</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/recommendations"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  <Sparkles size={18} />
                  <span>Get Outfit Ideas</span>
                </Link>
                <Link
                  to="/community"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users size={18} />
                  <span>Join Community</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Shirt className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{items.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Wardrobe Items</p>
                </div>
                
                <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-pink-100 rounded-full p-2">
                      <Sparkles className="w-5 h-5 text-pink-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{recommendations.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Outfit Ideas</p>
                </div>
                
                <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{activeChallenges.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Active Challenges</p>
                </div>
                
                <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-green-100 rounded-full p-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">85%</span>
                  </div>
                  <p className="text-sm text-gray-600">Style Score</p>
                </div>
              </motion.div>
              
              {/* Recent Outfit Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Recent Outfit Ideas</h2>
                  </div>
                  <Link 
                    to="/recommendations"
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Recommendations Yet</h3>
                    <p className="text-gray-600 mb-4">Add items to your wardrobe to get personalized outfit ideas</p>
                    <Link
                      to="/wardrobe"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Shirt className="w-4 h-4 mr-2" />
                      Add Wardrobe Items
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendations.slice(0, 2).map((recommendation, index) => (
                      <Link 
                        key={recommendation.id} 
                        to="/recommendations"
                        className="block group"
                      >
                        <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
                          <div className="aspect-video bg-gray-100 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                                <User className="w-6 h-6 text-purple-600" />
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              <h3 className="text-white font-medium">{recommendation.occasion} Outfit</h3>
                              <div className="flex items-center text-white/80 text-xs">
                                <Sparkles className="w-3 h-3 mr-1" />
                                <span>{Math.round(recommendation.confidence * 100)}% match</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{recommendation.description}</p>
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                              {recommendation.items.slice(0, 3).map((itemId: string) => {
                                const item = items.find(i => i.id === itemId);
                                return item ? (
                                  <div key={item.id} className="flex-shrink-0 w-12">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400';
                                        }}
                                      />
                                    </div>
                                  </div>
                                ) : null;
                              })}
                              {recommendation.items.length > 3 && (
                                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                                  +{recommendation.items.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
              
              {/* Community Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Community Highlights</h2>
                  </div>
                  <Link 
                    to="/community"
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
                ) : trendingPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Join Our Community</h3>
                    <p className="text-gray-600 mb-4">Share your style and get inspired by others</p>
                    <Link
                      to="/community"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Explore Community
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {trendingPosts.map(post => (
                      <Link 
                        key={post.id} 
                        to="/community"
                        className="block group"
                      >
                        <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
                          <div className="aspect-square bg-gray-100 relative">
                            <img 
                              src={post.images[0]} 
                              alt={`Post by ${post.user.name}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600';
                              }}
                            />
                            <div className="absolute top-2 left-2 flex items-center space-x-1">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-white/80 p-0.5">
                                {post.user.profilePic ? (
                                  <img 
                                    src={post.user.profilePic} 
                                    alt={post.user.name}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                                )}
                              </div>
                              <div className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded-full">
                                <span className="text-xs font-medium text-gray-900">{post.user.name}</span>
                              </div>
                            </div>
                            {post.challenge && (
                              <div className="absolute top-2 right-2">
                                <div className="px-2 py-1 bg-purple-100 rounded-full flex items-center space-x-1">
                                  <Award className="w-3 h-3 text-purple-600" />
                                  <span className="text-xs font-medium text-purple-800">{post.challenge.name}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">{post.caption}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                  <Heart className="w-3 h-3 mr-1" />
                                  <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center">
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  <span>{post.comments}</span>
                                </div>
                              </div>
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              {/* Profile Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'User'}</h3>
                    <p className="text-gray-600">{user?.preferredStyle || 'Style profile incomplete'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {!user?.preferredStyle && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">Complete your style profile to get better recommendations</p>
                      <Link 
                        to="/profile"
                        className="text-xs font-medium text-yellow-800 hover:text-yellow-900 underline"
                      >
                        Update Profile
                      </Link>
                    </div>
                  )}
                  
                  <Link
                    to="/profile"
                    className="block w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
                  >
                    View Profile
                  </Link>
                </div>
              </motion.div>
              
              {/* Active Challenges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Active Challenges</h3>
                  </div>
                  <Link 
                    to="/community"
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    View All
                  </Link>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
                ) : activeChallenges.length === 0 ? (
                  <div className="text-center py-6">
                    <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 mb-2">No active challenges</p>
                    <Link 
                      to="/community"
                      className="text-sm text-purple-600 hover:text-purple-800"
                    >
                      Explore Challenges
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeChallenges.slice(0, 3).map(challenge => (
                      <Link 
                        key={challenge.id}
                        to="/community"
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{challenge.name}</h4>
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                            {challenge.daysLeft} days left
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{challenge.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{challenge.participants} participants</span>
                          {challenge.isJoined ? (
                            <span className="text-green-600 font-medium">Joined</span>
                          ) : (
                            <span className="text-purple-600 font-medium">Join Now</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
              
              {/* Trending Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Trending Items</h3>
                  </div>
                  <Link 
                    to="/marketplace"
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    View All
                  </Link>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
                ) : trendingItems.length === 0 ? (
                  <div className="text-center py-6">
                    <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 mb-2">No trending items</p>
                    <Link 
                      to="/marketplace"
                      className="text-sm text-purple-600 hover:text-purple-800"
                    >
                      Explore Marketplace
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trendingItems.slice(0, 3).map(item => (
                      <Link 
                        key={item.id}
                        to="/marketplace"
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">{item.category}</p>
                            <p className="text-xs font-medium text-gray-900">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
              
              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
                  </div>
                  <Link 
                    to="/recommendations"
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    Calendar
                  </Link>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">New Challenge Launch</h4>
                      <span className="text-xs text-gray-600">Tomorrow</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Autumn Layers Challenge begins tomorrow!</p>
                    <Link 
                      to="/community"
                      className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Set Reminder
                    </Link>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">Planned Outfit</h4>
                      <span className="text-xs text-gray-600">Friday</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Work meeting outfit planned for Friday</p>
                    <Link 
                      to="/recommendations"
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Outfit
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return date.toLocaleDateString();
};

export default DashboardPage;
