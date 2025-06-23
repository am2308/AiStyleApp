import { useState, useEffect } from 'react';

export function useImagePreloader(imageUrls: string[]) {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    if (!imageUrls.length) {
      setImagesPreloaded(true);
      return;
    }

    let loadedCounter = 0;
    let errorCounter = 0;
    const totalImages = imageUrls.length;

    const checkAllLoaded = () => {
      if (loadedCounter + errorCounter === totalImages) {
        setImagesPreloaded(true);
      }
    };

    imageUrls.forEach(src => {
      const img = new Image();
      
      img.onload = () => {
        loadedCounter++;
        setLoadedCount(loadedCounter);
        checkAllLoaded();
      };
      
      img.onerror = () => {
        errorCounter++;
        setErrorCount(errorCounter);
        checkAllLoaded();
      };
      
      img.src = src;
    });

    return () => {
      // Clean up by removing event listeners
      imageUrls.forEach(src => {
        const img = new Image();
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [imageUrls]);

  return { imagesPreloaded, loadedCount, errorCount };
}
