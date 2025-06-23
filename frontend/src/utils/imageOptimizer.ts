/**
 * Utility functions for image optimization
 */

// Resize an image to a maximum width/height while maintaining aspect ratio
export const resizeImage = (
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Create a FileReader to read the file
    const reader = new FileReader();
    
    reader.onload = (readerEvent) => {
      // Create an image element
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = Math.round(width * (maxHeight / height));
          height = maxHeight;
        }
        
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Could not create blob'));
            return;
          }
          
          // Create a new file from the blob
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          
          resolve(resizedFile);
        }, 'image/jpeg', quality);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      // Set the image source to the file data
      if (readerEvent.target?.result) {
        img.src = readerEvent.target.result as string;
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
};

// Convert a data URL to a File object
export const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

// Lazy load images
export const lazyLoadImage = (
  src: string,
  placeholder: string = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=100'
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      resolve(src);
    };
    
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}, using placeholder`);
      resolve(placeholder);
    };
    
    img.src = src;
  });
};

// Get appropriate image size based on device
export const getResponsiveImageUrl = (url: string, width: number = 600): string => {
  // For Pexels images, we can use their sizing parameters
  if (url.includes('pexels.com')) {
    return url.replace(/w=\d+/, `w=${width}`);
  }
  
  // For other URLs, just return the original
  return url;
};
