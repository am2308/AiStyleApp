import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Star, Crown, TrendingUp, User, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CommunityLeaderboardProps {
  users: any[];
}

const CommunityLeaderboard: React.FC<CommunityLeaderboardProps> = ({ users }) => {
  // Sort users by followers (or any other metric)
  const sortedUsers = [...users].sort((a, b) => b.followers - a.followers);
  
  // Get top 3 users
  const topUsers = sortedUsers.slice(0, 3);
  
  // Get remaining users
  const remainingUsers = sortedUsers.slice(3);

  return (
    <div className="space-y-6">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full p-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Style Leaderboard</h2>
            <p className="text-gray-600">Top community members this month</p>
          </div>
        </div>
        
        {/* Top 3 Users Podium */}
        <div className="flex items-end justify-center space-x-4 mb-10 pt-10">
          {/* 2nd Place */}
          {topUsers.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                {topUsers[1].profilePic ? (
                  <img 
                    src={topUsers[1].profilePic} 
                    alt={topUsers[1].name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-gray-200">
                    {topUsers[1].name.charAt(0)}
                  </div>
                )}
                <div className="absolute -top-3 -right-1">
                  <Medal className="w-6 h-6 text-gray-400 fill-current" />
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="font-medium text-gray-900">{topUsers[1].name}</p>
                <p className="text-xs text-gray-500">{topUsers[1].followers} followers</p>
              </div>
              <div className="w-20 h-16 bg-gray-200 rounded-t-lg mt-4 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-700">2</span>
              </div>
            </motion.div>
          )}
          
          {/* 1st Place */}
          {topUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                {topUsers[0].profilePic ? (
                  <img 
                    src={topUsers[0].profilePic} 
                    alt={topUsers[0].name} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150';
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-yellow-400">
                    {topUsers[0].name.charAt(0)}
                  </div>
                )}
                <div className="absolute -top-4 -right-1">
                  <Crown className="w-8 h-8 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="font-semibold text-gray-900">{topUsers[0].name}</p>
                <p className="text-xs text-gray-500">{topUsers[0].followers} followers</p>
              </div>
              <div className="w-24 h-24 bg-yellow-200 rounded-t-lg mt-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-700">1</span>
              </div>
            </motion.div>
          )}
          
          {/* 3rd Place */}
          {topUsers.length > 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                {topUsers[2].profilePic ? (
                  <img 
                    src={topUsers[2].profilePic} 
                    alt={topUsers[2].name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-gray-200">
                    {topUsers[2].name.charAt(0)}
                  </div>
                )}
                <div className="absolute -top-3 -right-1">
                  <Award className="w-6 h-6 text-amber-700 fill-current" />
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="font-medium text-gray-900">{topUsers[2].name}</p>
                <p className="text-xs text-gray-500">{topUsers[2].followers} followers</p>
              </div>
              <div className="w-20 h-12 bg-amber-100 rounded-t-lg mt-4 flex items-center justify-center">
                <span className="text-xl font-bold text-amber-700">3</span>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Leaderboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 text-center">
            <div className="bg-white/80 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900">Most Liked</h3>
            <p className="text-sm text-gray-600">Sarah Chen</p>
            <p className="text-xs text-gray-500">2.4K likes this month</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 text-center">
            <div className="bg-white/80 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-900">Most Engaged</h3>
            <p className="text-sm text-gray-600">Michael Johnson</p>
            <p className="text-xs text-gray-500">156 comments this month</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 text-center">
            <div className="bg-white/80 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Share2 className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-semibold text-gray-900">Most Shared</h3>
            <p className="text-sm text-gray-600">Emma Rodriguez</p>
            <p className="text-xs text-gray-500">89 shares this month</p>
          </div>
        </div>
        
        {/* Remaining Users */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Stylists</h3>
          <div className="space-y-3">
            {remainingUsers.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="text-center w-6">
                    <span className="text-sm font-semibold text-gray-700">{index + 4}</span>
                  </div>
                  
                  {user.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{user.followers} followers</span>
                      <span className="mx-1">•</span>
                      <span>{user.posts} posts</span>
                    </div>
                  </div>
                </div>
                
                <button className={`text-xs px-3 py-1 rounded-full ${
                  user.isFollowing 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Challenge Winners */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full p-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Challenge Winners</h2>
            <p className="text-gray-600">Top outfits from our style challenges</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200">
              <img 
                src="https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Monochrome Challenge Winner"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">#MonochromeWeek</h3>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 mb-2">Winner: Sarah Chen</p>
              <div className="flex items-center text-xs text-gray-500">
                <Heart className="w-3 h-3 mr-1 text-red-500" />
                <span>342 likes</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200">
              <img 
                src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Business Casual Challenge Winner"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">#BusinessCasual</h3>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 mb-2">Winner: Michael Johnson</p>
              <div className="flex items-center text-xs text-gray-500">
                <Heart className="w-3 h-3 mr-1 text-red-500" />
                <span>287 likes</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200">
              <img 
                src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Summer Vibes Challenge Winner"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">#SummerVibes</h3>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600 mb-2">Winner: Emma Rodriguez</p>
              <div className="flex items-center text-xs text-gray-500">
                <Heart className="w-3 h-3 mr-1 text-red-500" />
                <span>315 likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityLeaderboard;
