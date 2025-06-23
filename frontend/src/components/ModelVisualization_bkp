import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Palette, RotateCcw, Maximize2, Minimize2, Camera, Download, Share2, Sparkles, Zap, Play, Pause } from 'lucide-react';
import Avatar3D from './Avatar3D';

interface ModelVisualizationProps {
  userProfile: {
    skinTone?: string;
    bodyType?: string;
    preferredStyle?: string;
  };
  outfitItems: Array<{
    id: string;
    name: string;
    category: string;
    color: string;
    imageUrl: string;
  }>;
  occasion: string;
  className?: string;
}

const ModelVisualization: React.FC<ModelVisualizationProps> = ({
  userProfile,
  outfitItems,
  occasion,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modelPose, setModelPose] = useState<'standing' | 'walking' | 'sitting'>('standing');
  const [lighting, setLighting] = useState<'studio' | 'natural' | 'dramatic'>('studio');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Realistic loading time for 3D model generation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [outfitItems]);

  const handlePoseChange = () => {
    const poses: ('standing' | 'walking' | 'sitting')[] = ['standing', 'walking', 'sitting'];
    const currentIndex = poses.indexOf(modelPose);
    const nextIndex = (currentIndex + 1) % poses.length;
    setModelPose(poses[nextIndex]);
  };

  const handleLightingChange = () => {
    const lightings: ('studio' | 'natural' | 'dramatic')[] = ['studio', 'natural', 'dramatic'];
    const currentIndex = lightings.indexOf(lighting);
    const nextIndex = (currentIndex + 1) % lightings.length;
    setLighting(lightings[nextIndex]);
  };

  const generateStyleAnalysis = () => {
    const analysis = [];
    
    if (userProfile.skinTone) {
      analysis.push(`The color palette beautifully complements your ${userProfile.skinTone} complexion`);
    }
    
    if (userProfile.bodyType) {
      analysis.push(`This silhouette perfectly flatters your ${userProfile.bodyType} body type`);
    }
    
    if (userProfile.preferredStyle) {
      analysis.push(`Expertly styled to match your ${userProfile.preferredStyle} aesthetic`);
    }

    // Color harmony analysis
    const colors = outfitItems.map(item => item.color);
    const uniqueColors = [...new Set(colors)];
    
    if (uniqueColors.length <= 3) {
      analysis.push('Excellent color coordination creates a harmonious and sophisticated look');
    }

    return analysis.join('. ') + '.';
  };

  return (
    <div className={`bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-xl border-2 border-gray-200 shadow-xl ${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 rounded-full p-2">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">3D Virtual Model</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Palette className="w-4 h-4" />
              <span>{userProfile.skinTone} • {userProfile.bodyType}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePoseChange}
            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
            title={`Change pose (${modelPose})`}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleLightingChange}
            className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
            title={`Lighting: ${lighting}`}
          >
            <Zap className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
            title={isAnimating ? "Pause animation" : "Play animation"}
          >
            {isAnimating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3D Model Display Area */}
      <div className="relative h-96 lg:h-[500px] p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mb-6"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Creating Your 3D Avatar</h4>
                <p className="text-gray-600 text-sm mb-1">Analyzing {userProfile.skinTone} complexion</p>
                <p className="text-gray-600 text-sm mb-1">Adjusting for {userProfile.bodyType} body type</p>
                <p className="text-gray-500 text-xs">Rendering photorealistic 3D model...</p>
              </motion.div>
              
              {/* Advanced loading progress */}
              <motion.div 
                className="w-64 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="model"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full"
            >
              <Avatar3D
                userProfile={userProfile}
                outfitItems={outfitItems}
                pose={modelPose}
                lighting={lighting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Outfit Information */}
      <div className="p-6 border-t bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900">3D Outfit Preview for {occasion}</h4>
            <p className="text-sm text-gray-600">{outfitItems.length} items • Photorealistic rendering</p>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Outfit Items with Enhanced Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {outfitItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05, y: -2 }}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div
                className="w-full h-16 rounded mb-2 border shadow-sm"
                style={{
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-600">{item.category}</span>
                <div
                  className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                  style={{
                    backgroundColor: item.color === 'White' ? '#ffffff' :
                                    item.color === 'Black' ? '#000000' :
                                    item.color === 'Blue' ? '#3b82f6' :
                                    item.color === 'Red' ? '#ef4444' :
                                    item.color === 'Green' ? '#10b981' :
                                    item.color === 'Gray' ? '#6b7280' :
                                    item.color === 'Purple' ? '#8b5cf6' :
                                    item.color === 'Pink' ? '#ec4899' :
                                    item.color === 'Yellow' ? '#f59e0b' :
                                    item.color === 'Orange' ? '#f97316' :
                                    item.color === 'Brown' ? '#92400e' :
                                    '#6b7280'
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Advanced Style Analysis */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 rounded-full p-2 mt-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-purple-900 mb-1">AI Style Analysis</h5>
              <p className="text-sm text-purple-800 leading-relaxed">
                {generateStyleAnalysis()}
              </p>
              <div className="mt-3 flex items-center space-x-4 text-xs text-purple-700">
                <span>Pose: {modelPose}</span>
                <span>•</span>
                <span>Lighting: {lighting}</span>
                <span>•</span>
                <span>3D Rendered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelVisualization;
