import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Award, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OutfitPostProps {
  post: {
    id: string;
    user: {
      id: string;
      name: string;
      profilePic?: string;
      isFollowing: boolean;
    };
    images: string[];
    caption: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    isSaved: boolean;
    tags: string[];
    location?: string;
    createdAt: string;
    challenge?: {
      id: string;
      name: string;
    };
    wardrobeItems?: {
      id: string;
      name: string;
      category: string;
      imageUrl: string;
    }[];
  };
  onLike: () => void;
}

const OutfitPost: React.FC<OutfitPostProps> = ({ post, onLike }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setComment('');
      setIsSubmitting(false);
    }, 500);
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.user.id}`} className="block">
            {post.user.profilePic ? (
              <img 
                src={post.user.profilePic} 
                alt={post.user.name} 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150';
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                {post.user.name.charAt(0)}
              </div>
            )}
          </Link>
          <div>
            <div className="flex items-center">
              <Link to={`/profile/${post.user.id}`} className="font-medium text-gray-900 hover:underline">
                {post.user.name}
              </Link>
              {post.challenge && (
                <div className="flex items-center ml-2">
                  <span className="text-gray-400 text-sm">in</span>
                  <Link 
                    to={`/community/challenges/${post.challenge.id}`}
                    className="ml-1 text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {post.challenge.name}
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span>{formatDate(post.createdAt)}</span>
              {post.location && (
                <>
                  <span className="mx-1">•</span>
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!post.user.isFollowing && (
            <button className="text-xs px-3 py-1 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors">
              Follow
            </button>
          )}
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
      
      {/* Post Images */}
      <div className="relative">
        <div className="aspect-square bg-gray-100">
          <img 
            src={post.images[currentImageIndex]} 
            alt={`Post by ${post.user.name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600';
            }}
          />
        </div>
        
        {/* Image Navigation */}
        {post.images.length > 1 && (
          <>
            <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
              <button 
                onClick={handlePrevImage}
                disabled={currentImageIndex === 0}
                className={`p-1 rounded-full bg-white/70 backdrop-blur-sm text-gray-800 hover:bg-white transition-colors ${
                  currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
              <button 
                onClick={handleNextImage}
                disabled={currentImageIndex === post.images.length - 1}
                className={`p-1 rounded-full bg-white/70 backdrop-blur-sm text-gray-800 hover:bg-white transition-colors ${
                  currentImageIndex === post.images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {post.images.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Post Actions */}
      <div className="flex items-center justify-between p-4 border-t border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onLike}
            className={`flex items-center space-x-1 ${
              post.isLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
            }`}
          >
            <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
          <button className="text-gray-700 hover:text-gray-900">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        <button className={`text-gray-700 hover:text-yellow-500 ${post.isSaved ? 'text-yellow-500' : ''}`}>
          <Bookmark className={`w-6 h-6 ${post.isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-900 mb-2">
          <span className="font-medium">{post.user.name}</span>{' '}
          {post.caption}
        </p>
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map(tag => (
              <Link 
                key={tag} 
                to={`/community/tags/${tag}`}
                className="text-sm text-purple-600 hover:text-purple-800 hover:underline"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Wardrobe Items */}
        {post.wardrobeItems && post.wardrobeItems.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Featured Items:</h4>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {post.wardrobeItems.map(item => (
                <div key={item.id} className="flex-shrink-0 w-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mb-1">
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
                  <p className="text-xs text-gray-700 truncate">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Comments</h4>
            
            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="flex space-x-2 mb-4">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={!comment.trim() || isSubmitting}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </form>
            
            {/* Sample Comments */}
            <div className="space-y-3">
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Sarah</span>{' '}
                    <span className="text-gray-700">Love this look! The colors work so well together.</span>
                  </p>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                    <span>2h ago</span>
                    <button className="hover:text-gray-700">Like</button>
                    <button className="hover:text-gray-700">Reply</button>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Michael</span>{' '}
                    <span className="text-gray-700">Where did you get that jacket? It's amazing!</span>
                  </p>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                    <span>1h ago</span>
                    <button className="hover:text-gray-700">Like</button>
                    <button className="hover:text-gray-700">Reply</button>
                  </div>
                </div>
              </div>
            </div>
            
            {post.comments > 2 && (
              <button className="mt-3 text-sm text-purple-600 hover:text-purple-800">
                View all {post.comments} comments
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OutfitPost;
