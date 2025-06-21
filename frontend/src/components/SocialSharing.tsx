import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Instagram, Twitter, Facebook, Link, Download, Heart, MessageCircle, Send } from 'lucide-react';

interface SocialSharingProps {
  outfitData: {
    id: string;
    items: any[];
    occasion: string;
    imageUrl?: string;
  };
  userProfile: any;
}

const SocialSharing: React.FC<SocialSharingProps> = ({ outfitData, userProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
  const [isLiked, setIsLiked] = useState(false);

  const shareText = `Check out my ${outfitData.occasion} outfit styled with StyleAI! 🔥✨ #StyleAI #OOTD #FashionAI`;
  const shareUrl = `https://styleai.app/outfit/${outfitData.id}`;

  const socialPlatforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      action: () => {
        // In a real app, this would integrate with Instagram's API
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setIsShared(true);
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'from-blue-400 to-blue-600',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        setIsShared(true);
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-800',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        setIsShared(true);
      }
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDownload = () => {
    // In a real app, this would generate and download the outfit image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;
    
    if (ctx) {
      // Create a simple outfit card
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 600);
      
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`${outfitData.occasion} Outfit`, 20, 50);
      
      ctx.font = '16px Arial';
      ctx.fillText(`Styled by ${userProfile.name}`, 20, 80);
      ctx.fillText('Created with StyleAI', 20, 560);
      
      // Download the image
      const link = document.createElement('a');
      link.download = `styleai-outfit-${outfitData.occasion.toLowerCase()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
      >
        <Share2 className="w-4 h-4" />
        <span>Share Outfit</span>
      </motion.button>

      {/* Social Sharing Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={() => setIsOpen(false)}
              />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white px-6 py-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Share Your Outfit</h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>

                  {/* Outfit Preview */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {outfitData.occasion.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{outfitData.occasion} Outfit</h4>
                        <p className="text-sm text-gray-600">{outfitData.items.length} items • Styled by {userProfile.name}</p>
                      </div>
                    </div>
                    
                    {/* Engagement Stats */}
                    <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-purple-200">
                      <button
                        onClick={handleLike}
                        className={`flex items-center space-x-1 transition-colors ${
                          isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{likes}</span>
                      </button>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{Math.floor(Math.random() * 20) + 5}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Send className="w-4 h-4" />
                        <span className="text-sm">{Math.floor(Math.random() * 10) + 2}</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Platforms */}
                  <div className="space-y-3 mb-6">
                    <h4 className="text-sm font-medium text-gray-700">Share to social media</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {socialPlatforms.map((platform) => (
                        <motion.button
                          key={platform.name}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={platform.action}
                          className={`flex flex-col items-center space-y-2 p-4 rounded-lg bg-gradient-to-r ${platform.color} text-white hover:shadow-lg transition-all`}
                        >
                          <platform.icon className="w-6 h-6" />
                          <span className="text-xs font-medium">{platform.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Actions */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">More options</h4>
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCopyLink}
                        className="flex-1 flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Link className="w-4 h-4" />
                        <span className="text-sm">{isShared ? 'Copied!' : 'Copy Link'}</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Success Message */}
                  <AnimatePresence>
                    {isShared && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <p className="text-sm text-green-800 text-center">
                          🎉 Outfit shared successfully! Your style is inspiring others.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialSharing;
