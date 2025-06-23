import React, { useState, useEffect } from 'react';
import { getResponsiveImageUrl } from '../utils/imageOptimizer';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholderSrc?: string;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderSrc = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=100',
  onError
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholderSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setHasError(false);
    setImageSrc(placeholderSrc);
    
    if (!src) return;
    
    // Get responsive image URL
    const responsiveSrc = getResponsiveImageUrl(src, width);
    
    // Create a new image element to preload the image
    const img = new Image();
    img.src = responsiveSrc;
    
    img.onload = () => {
      setImageSrc(responsiveSrc);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setHasError(true);
      setImageSrc(placeholderSrc);
      if (onError) onError();
    };
    
    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholderSrc, width, onError]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
    >
      {/* Placeholder/Blur-up image */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Main image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        width={width}
        height={height}
      />
    </div>
  );
};

export default LazyImage;
