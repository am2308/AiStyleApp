import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  Award, 
  Calendar, 
  Filter, 
  Search, 
  Plus, 
  Camera, 
  X, 
  ChevronDown,
  Sparkles,
  Zap,
  User,
  Trophy
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWardrobe } from '../contexts/WardrobeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import FashionBackground from '../components/FashionBackground';
import { communityService } from '../services/communityService';
import CreatePostModal from '../components/community/CreatePostModal';
import StyleChallengeCard from '../components/community/StyleChallengeCard';
import OutfitPost from '../components/community/OutfitPost';
import CommunityLeaderboard from '../components/community/CommunityLeaderboard';

const CommunityPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { items } = useWardrobe();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'leaderboard'>('feed');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: '',
    location: '',
    website: '',
    instagram: '',
    twitter: ''
  });
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  // Parse URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    const challenge = searchParams.get('challenge');
    
    if (tab === 'challenges') {
      setActiveTab('challenges');
    } else if (tab === 'leaderboard') {
      setActiveTab('leaderboard');
    }
    
    if (challenge) {
      setSelectedChallenge(challenge);
    }
  }, [location]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      setIsLoading(true);
      try {
        // Fetch posts, challenges, and trending users
        const [postsData, challengesData, usersData] = await Promise.all([
          communityService.getPosts(),
          communityService.getChallenges(),
          communityService.getTrendingUsers()
        ]);
        
        setPosts(postsData);
        setChallenges(challengesData);
        setTrendingUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch community data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityData();
  }, []);

  const handleCreatePost = async (postData: any) => {
    try {
      const newPost = await communityService.createPost(postData);
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setShowCreatePost(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await communityService.likePost(postId);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked 
              } 
            : post
        )
      );
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await communityService.joinChallenge(challengeId);
      setChallenges(prevChallenges => 
        prevChallenges.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, isJoined: true, participants: challenge.participants + 1 } 
            : challenge
        )
      );
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };

  const handleCompleteProfile = () => {
    setShowCompleteProfile(true);
  };

  const handleShareProfile = () => {
    // Create a shareable URL for the user's profile
    const shareUrl = `${window.location.origin}/community/profile/${user?.id}`;
    
    // Check if the Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: `${user?.name}'s StyleAI Profile`,
        text: `Check out my style profile on StyleAI!`,
        url: shareUrl
      }).catch(err => {
        console.error('Error sharing:', err);
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback to clipboard
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Profile link copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  const handleSaveProfile = async () => {
    try {
      // In a real app, you would update the user profile via API
      await updateProfile(profileData);
      
      // Close the modal
      setShowCompleteProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'following' && post.user.isFollowing) return true;
    if (filter === 'challenges' && post.challenge) return true;
    if (filter === 'trending' && post.isTrending) return true;
    return false;
  }).filter(post => {
    if (!searchQuery) return true;
    return (
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.challenge && post.challenge.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Get selected challenge details
  const selectedChallengeDetails = selectedChallenge 
    ? challenges.find(c => c.id === selectedChallenge)
    : null;

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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-3">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Style Community</h1>
                  <p className="text-gray-600">Share outfits, join challenges, and get inspired</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search posts, challenges, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90 backdrop-blur-sm"
                  />
                </div>
                
                {/* Create Post Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  <Plus size={18} />
                  <span>Create Post</span>
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => {
                  setActiveTab('feed');
                  setSelectedChallenge(null);
                  navigate('/community');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'feed'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="inline w-4 h-4 mr-2" />
                Community Feed
              </button>
              <button
                onClick={() => {
                  setActiveTab('challenges');
                  setSelectedChallenge(null);
                  navigate('/community?tab=challenges');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'challenges'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Award className="inline w-4 h-4 mr-2" />
                Style Challenges
              </button>
              <button
                onClick={() => {
                  setActiveTab('leaderboard');
                  setSelectedChallenge(null);
                  navigate('/community?tab=leaderboard');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'leaderboard'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="inline w-4 h-4 mr-2" />
                Leaderboard
              </button>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* User Profile Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'User'}</h3>
                    <p className="text-gray-600">@{user?.name?.toLowerCase().replace(/\s+/g, '') || 'username'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900">0</p>
                    <p className="text-xs text-gray-600">Posts</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900">0</p>
                    <p className="text-xs text-gray-600">Followers</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900">0</p>
                    <p className="text-xs text-gray-600">Following</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button 
                    onClick={handleCompleteProfile}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Complete Profile
                  </button>
                  <button 
                    onClick={handleShareProfile}
                    className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Share Profile
                  </button>
                </div>
              </div>
              
              {/* Active Challenges */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Active Challenges</h3>
                  <button 
                    onClick={() => {
                      setActiveTab('challenges');
                      setSelectedChallenge(null);
                      navigate('/community?tab=challenges');
                    }}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    View All
                  </button>
                </div>
                
                {challenges.filter(challenge => challenge.isActive).slice(0, 3).map(challenge => (
                  <div key={challenge.id} className="mb-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{challenge.name}</h4>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                        {challenge.daysLeft} days left
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{challenge.participants} participants</span>
                      {challenge.isJoined ? (
                        <button 
                          onClick={() => {
                            setSelectedChallenge(challenge.id);
                            setActiveTab('challenges');
                            navigate(`/community?tab=challenges&challenge=${challenge.id}`);
                          }}
                          className="text-xs text-green-600 font-medium hover:text-green-800"
                        >
                          View Challenge
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleJoinChallenge(challenge.id)}
                          className="text-xs text-purple-600 font-medium hover:text-purple-800"
                        >
                          Join Challenge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {challenges.filter(challenge => challenge.isActive).length === 0 && (
                  <div className="text-center py-6">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No active challenges</p>
                    <button 
                      onClick={() => {
                        setActiveTab('challenges');
                        navigate('/community?tab=challenges');
                      }}
                      className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                    >
                      Explore Challenges
                    </button>
                  </div>
                )}
              </div>
              
              {/* Trending Users */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Stylists</h3>
                
                {trendingUsers.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                        {user.profilePic ? (
                          <img 
                            src={user.profilePic} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.followers} followers</p>
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
            </motion.div>

            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              {isLoading ? (
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading community content...</p>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'feed' ? (
                <div className="space-y-6">
                  {/* Feed Filters */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                          filter === 'all'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All Posts
                      </button>
                      <button
                        onClick={() => setFilter('following')}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                          filter === 'following'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Following
                      </button>
                      <button
                        onClick={() => setFilter('challenges')}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                          filter === 'challenges'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Challenges
                      </button>
                      <button
                        onClick={() => setFilter('trending')}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                          filter === 'trending'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 inline mr-1" />
                        Trending
                      </button>
                    </div>
                  </div>
                  
                  {/* Posts */}
                  {filteredPosts.length === 0 ? (
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 text-center">
                      <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                        <Users className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Found</h3>
                      <p className="text-gray-600 mb-6">
                        {filter === 'all' 
                          ? "Be the first to share your style with the community!"
                          : filter === 'following'
                          ? "Follow some stylists to see their posts here"
                          : filter === 'challenges'
                          ? "Join a challenge and share your entry"
                          : "No trending posts at the moment"}
                      </p>
                      <button
                        onClick={() => setShowCreatePost(true)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                      >
                        <Plus size={18} className="mr-2" />
                        Create First Post
                      </button>
                    </div>
                  ) : (
                    filteredPosts.map(post => (
                      <OutfitPost 
                        key={post.id} 
                        post={post} 
                        onLike={() => handleLikePost(post.id)} 
                      />
                    ))
                  )}
                </div>
              ) : activeTab === 'challenges' ? (
                <div className="space-y-6">
                  {/* Challenge Categories */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                      <button
                        onClick={() => {
                          setSelectedChallenge(null);
                          navigate('/community?tab=challenges');
                        }}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                          !selectedChallenge ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All Challenges
                      </button>
                      <button
                        className="px-4 py-2 rounded-full text-sm whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Active
                      </button>
                      <button
                        className="px-4 py-2 rounded-full text-sm whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Upcoming
                      </button>
                      <button
                        className="px-4 py-2 rounded-full text-sm whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        Completed
                      </button>
                      <button
                        className="px-4 py-2 rounded-full text-sm whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        My Challenges
                      </button>
                    </div>
                  </div>
                  
                  {/* Selected Challenge Detail */}
                  {selectedChallenge && selectedChallengeDetails && (
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                      <div className="relative h-64">
                        <img 
                          src={selectedChallengeDetails.imageUrl} 
                          alt={selectedChallengeDetails.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        
                        <div className="absolute top-4 left-4">
                          <button 
                            onClick={() => {
                              setSelectedChallenge(null);
                              navigate('/community?tab=challenges');
                            }}
                            className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white transition-colors"
                          >
                            ← Back to Challenges
                          </button>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 right-4">
                          <h2 className="text-white text-3xl font-bold mb-2">{selectedChallengeDetails.name}</h2>
                          <div className="flex items-center space-x-4 text-white/90">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{new Date(selectedChallengeDetails.endDate).toLocaleDateString()} ({selectedChallengeDetails.daysLeft} days left)</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{selectedChallengeDetails.participants} participants</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Challenge Details</h3>
                          <p className="text-gray-600">{selectedChallengeDetails.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-1">Timeline</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(selectedChallengeDetails.startDate).toLocaleDateString()} - {new Date(selectedChallengeDetails.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-1">Entries</h4>
                            <p className="text-sm text-gray-600">{selectedChallengeDetails.entries} submissions</p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                            <p className="text-sm text-gray-600">
                              {selectedChallengeDetails.isJoined ? 'You have joined this challenge' : 'You have not joined yet'}
                            </p>
                          </div>
                        </div>
                        
                        {selectedChallengeDetails.prizes && selectedChallengeDetails.prizes.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prizes</h3>
                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4">
                              <ul className="space-y-2">
                                {selectedChallengeDetails.prizes.map((prize: any, index: number) => (
                                  <li key={index} className="flex items-start">
                                    <Trophy className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                                    <div>
                                      <p className="font-medium text-gray-900">{prize.name}</p>
                                      {prize.description && (
                                        <p className="text-sm text-gray-600">{prize.description}</p>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Challenge Entries</h3>
                          {posts.filter(post => post.challenge?.id === selectedChallenge).length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                              {posts.filter(post => post.challenge?.id === selectedChallenge).map(post => (
                                <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden">
                                  <img 
                                    src={post.images[0]} 
                                    alt={`Entry by ${post.user.name}`}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400';
                                    }}
                                  />
                                  <div className="p-3">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <div className="w-6 h-6 rounded-full overflow-hidden">
                                        {post.user.profilePic ? (
                                          <img 
                                            src={post.user.profilePic} 
                                            alt={post.user.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                                        )}
                                      </div>
                                      <span className="text-sm font-medium text-gray-900">{post.user.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <div className="flex items-center space-x-2">
                                        <div className="flex items-center">
                                          <Heart className="w-3 h-3 mr-1" />
                                          <span>{post.likes}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <MessageCircle className="w-3 h-3 mr-1" />
                                          <span>{post.comments}</span>
                                        </div>
                                      </div>
                                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-500 mb-4">No entries yet for this challenge</p>
                              <button
                                onClick={() => setShowCreatePost(true)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                              >
                                Submit Your Entry
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-center">
                          {selectedChallengeDetails.isJoined ? (
                            <button
                              onClick={() => setShowCreatePost(true)}
                              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                            >
                              Submit Your Entry
                            </button>
                          ) : (
                            <button
                              onClick={() => handleJoinChallenge(selectedChallenge)}
                              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                            >
                              Join This Challenge
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Challenge Grid */}
                  {!selectedChallenge && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {challenges.length === 0 ? (
                        <div className="md:col-span-2 bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 text-center">
                          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                            <Award className="w-12 h-12 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Challenges Available</h3>
                          <p className="text-gray-600">
                            Check back soon for exciting style challenges!
                          </p>
                        </div>
                      ) : (
                        challenges.map(challenge => (
                          <StyleChallengeCard 
                            key={challenge.id} 
                            challenge={challenge} 
                            onJoin={() => handleJoinChallenge(challenge.id)} 
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <CommunityLeaderboard users={trendingUsers} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={showCreatePost} 
        onClose={() => setShowCreatePost(false)} 
        onSubmit={handleCreatePost}
        wardrobeItems={items}
        challenges={challenges}
      />
      
      {/* Complete Profile Modal */}
      <AnimatePresence>
        {showCompleteProfile && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
                onClick={() => setShowCompleteProfile(false)}
              />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCompleteProfile(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {/* Profile Picture */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <button className="absolute bottom-0 right-0 p-1 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors">
                          <Camera size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    
                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                        rows={3}
                        placeholder="Tell the community about yourself and your style..."
                      />
                    </div>
                    
                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="City, Country"
                      />
                    </div>
                    
                    {/* Website */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    
                    {/* Social Media */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Instagram
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            @
                          </span>
                          <input
                            type="text"
                            value={profileData.instagram}
                            onChange={(e) => setProfileData({...profileData, instagram: e.target.value})}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="username"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Twitter
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            @
                          </span>
                          <input
                            type="text"
                            value={profileData.twitter}
                            onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="username"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCompleteProfile(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                  >
                    Save Profile
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;
