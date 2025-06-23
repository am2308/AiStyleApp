import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Palette, Sparkles } from 'lucide-react';
import BabylonAvatar from './BabylonAvatar';
import AvatarControls from './AvatarControls';
import OutfitDetails from './OutfitDetails';
import * as THREE from 'three';

interface RealisticAvatarProps {
  userProfile: {
    skinTone?: string;
    bodyType?: string;
    preferredStyle?: string;
    gender?: 'male' | 'female' | 'unisex';
  };
  outfitItems: Array<{
    id: string;
    name: string;
    category: string;
    color: string;
    imageUrl: string;
  }>;
  outfitData: {
    occasion: string;
    confidence: number;
    description: string;
    styleNotes?: string;
    missingItems?: Array<{
      category: string;
      description: string;
      priority: string;
      availableProducts?: Array<{
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        url: string;
        source: string;
      }>;
    }>;
  };
  className?: string;
}

const RealisticAvatar: React.FC<RealisticAvatarProps> = ({
  userProfile,
  outfitItems,
  outfitData,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modelPose, setModelPose] = useState<'standing' | 'walking' | 'casual' | 'formal'>('standing');
  const [lighting, setLighting] = useState<'studio' | 'natural' | 'dramatic'>('studio');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  // Preload textures for better performance
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const texturesToLoad = outfitItems.length;
    let loadedCount = 0;
    
    outfitItems.forEach(item => {
      if (item.imageUrl) {
        textureLoader.load(
          item.imageUrl,
          () => {
            loadedCount++;
            if (loadedCount === texturesToLoad) {
              setTexturesLoaded(true);
            }
          },
          undefined,
          (error) => {
            console.error('Error loading texture:', error);
            loadedCount++;
            if (loadedCount === texturesToLoad) {
              setTexturesLoaded(true);
            }
          }
        );
      } else {
        loadedCount++;
        if (loadedCount === texturesToLoad) {
          setTexturesLoaded(true);
        }
      }
    });
  }, [outfitItems]);

  const handlePoseChange = () => {
    const poses: ('standing' | 'walking' | 'casual' | 'formal')[] = ['standing', 'walking', 'casual', 'formal'];
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

  const handleAnimationToggle = () => {
    setIsAnimating(!isAnimating);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    
    if (!isFullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleScreenshot = () => {
    // Implementation for taking a screenshot of the 3D model
    if (containerRef.current) {
      try {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `styleai-outfit-${outfitData.occasion.toLowerCase()}.png`;
          link.href = dataUrl;
          link.click();
        }
      } catch (error) {
        console.error('Error taking screenshot:', error);
      }
    }
  };

  const handleShare = () => {
    // Implementation for sharing the outfit
    alert('Share functionality would open a sharing dialog');
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-xl border-2 border-gray-200 shadow-xl ${className} ${isFullscreen ? 'fixed inset-0 z-50 p-4' : ''}`}
    >
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 rounded-full p-2">
            <User className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Realistic 3D Virtual Model</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Palette className="w-3 h-3 lg:w-4 lg:h-4" />
              <span>{userProfile.skinTone} • {userProfile.bodyType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Model Display Area */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full"
            >
              <BabylonAvatar
                userProfile={userProfile}
                outfitItems={outfitItems}
                pose={modelPose}
                lighting={lighting}
                onLoadingChange={setIsLoading}
                useRealClothingTextures={true}
              />
              
              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <AvatarControls
                  pose={modelPose}
                  lighting={lighting}
                  isAnimating={isAnimating}
                  isFullscreen={isFullscreen}
                  onPoseChange={handlePoseChange}
                  onLightingChange={handleLightingChange}
                  onAnimationToggle={handleAnimationToggle}
                  onFullscreenToggle={handleFullscreenToggle}
                  onScreenshot={handleScreenshot}
                  onShare={handleShare}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Outfit Information */}
      <div className="p-4 lg:p-6 border-t bg-white">
        <OutfitDetails 
          outfit={outfitData}
          items={outfitItems}
        />
      </div>
    </div>
  );
};

export default RealisticAvatar;
