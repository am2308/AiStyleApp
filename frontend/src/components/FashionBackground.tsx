import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fashionImages = [
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
];

// Preload images
const preloadImages = (urls: string[]) => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

const FashionBackground: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(fashionImages.length).fill(false));
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const isInitialRender = useRef(true);

  // Preload all images on mount
  useEffect(() => {
    if (isInitialRender.current) {
      preloadImages(fashionImages);
      isInitialRender.current = false;
    }
    
    // Track image loading
    fashionImages.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded(prev => {
          const newLoaded = [...prev];
          newLoaded[index] = true;
          return newLoaded;
        });
      };
      img.src = src;
    });
    
    // Check if user has reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(false);
    }
    
    // Start transition interval only if visible
    if (isVisible) {
      intervalRef.current = window.setInterval(() => {
        if (imagesLoaded[nextImageIndex]) {
          setIsTransitioning(true);
          
          setTimeout(() => {
            setCurrentImageIndex(nextImageIndex);
            setNextImageIndex((nextImageIndex + 1) % fashionImages.length);
            setIsTransitioning(false);
          }, 1000); // Half of transition duration
        }
      }, 8000); // Change image every 8 seconds (reduced from 5 seconds)
    }
    
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nextImageIndex, imagesLoaded, isVisible]);

  // Don't render if not visible (reduced motion preference)
  if (!isVisible) {
    return <div className="fixed inset-0 z-0 bg-gray-900"></div>;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gray-900">
      {/* Current Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000 ease-in-out will-change-transform"
        style={{
          backgroundImage: `url(${fashionImages[currentImageIndex]})`,
          opacity: isTransitioning ? 0 : 1,
        }}
      />
      
      {/* Next Image (for smooth transition) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-2000 ease-in-out will-change-transform"
        style={{
          backgroundImage: `url(${fashionImages[nextImageIndex]})`,
          opacity: isTransitioning ? 1 : 0,
        }}
      />
      
      {/* Consistent overlay - never changes */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
      
      {/* Animated particles - reduced for performance */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: typeof window !== 'undefined' ? window.innerHeight : 1080,
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(FashionBackground);
