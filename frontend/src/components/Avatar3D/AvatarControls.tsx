import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Zap, Camera, Download, Share2, Play, Pause, Maximize2, Minimize2 } from 'lucide-react';

interface AvatarControlsProps {
  pose: string;
  lighting: string;
  isAnimating: boolean;
  isFullscreen: boolean;
  onPoseChange: () => void;
  onLightingChange: () => void;
  onAnimationToggle: () => void;
  onFullscreenToggle: () => void;
  onScreenshot: () => void;
  onShare: () => void;
}

const AvatarControls: React.FC<AvatarControlsProps> = ({
  pose,
  lighting,
  isAnimating,
  isFullscreen,
  onPoseChange,
  onLightingChange,
  onAnimationToggle,
  onFullscreenToggle,
  onScreenshot,
  onShare
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPoseChange}
          className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
          title={`Change pose (${pose})`}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLightingChange}
          className="p-2 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
          title={`Lighting: ${lighting}`}
        >
          <Zap className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAnimationToggle}
          className="p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
          title={isAnimating ? "Pause animation" : "Play animation"}
        >
          {isAnimating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </motion.button>
      </div>
      
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onScreenshot}
          className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          title="Take screenshot"
        >
          <Camera className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShare}
          className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
          title="Share outfit"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFullscreenToggle}
          className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </motion.button>
      </div>
    </div>
  );
};

export default AvatarControls;
