// Simple CORS proxy for handling image loading issues
// This script is included in your HTML to help with CORS issues

// Function to create a CORS-friendly URL
function createCorsProxyUrl(originalUrl) {
  // If the URL is already from a CORS-friendly source, return it as is
  if (originalUrl.includes('pexels.com')) {
    return originalUrl;
  }
  
  // For S3 images, we can try using a different approach
  if (originalUrl.includes('amazonaws.com')) {
    // Try replacing the direct S3 URL with the CloudFront URL if available
    return originalUrl.replace(
      'kinderloop-app-demo.s3.amazonaws.com', 
      'd2isva7xmlrxtz.cloudfront.net'
    );
  }
  
  // Fallback to a placeholder image if we can't handle the URL
  if (originalUrl.includes('amazonaws.com')) {
    return 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  return originalUrl;
}

// Make the function available globally
window.createCorsProxyUrl = createCorsProxyUrl;

// Patch the THREE.js TextureLoader to use our CORS proxy
document.addEventListener('DOMContentLoaded', function() {
  // Wait for THREE.js to be loaded
  const checkForThree = setInterval(() => {
    if (window.THREE) {
      clearInterval(checkForThree);
      
      // Save the original TextureLoader.load method
      const originalTextureLoad = window.THREE.TextureLoader.prototype.load;
      
      // Override the TextureLoader.load method
      window.THREE.TextureLoader.prototype.load = function(url, onLoad, onProgress, onError) {
        // Check if the URL might have CORS issues
        if (url && typeof url === 'string' && url.includes('amazonaws.com')) {
          console.log(`THREE.js TextureLoader: Fixing CORS for ${url}`);
          
          // Try with the original URL first
          return originalTextureLoad.call(
            this, 
            url,
            onLoad,
            onProgress,
            // If there's an error, try with a fallback
            (error) => {
              console.warn(`THREE.js TextureLoader: CORS error for ${url}, using fallback`);
              
              // Determine fallback based on URL path
              let fallbackUrl = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400';
              
              if (url.includes('/Tops/')) {
                fallbackUrl = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400';
              } else if (url.includes('/Bottoms/')) {
                fallbackUrl = 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400';
              } else if (url.includes('/Dresses/')) {
                fallbackUrl = 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400';
              } else if (url.includes('/Outerwear/')) {
                fallbackUrl = 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400';
              } else if (url.includes('/Footwear/')) {
                fallbackUrl = 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400';
              } else if (url.includes('/Accessories/')) {
                fallbackUrl = 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400';
              }
              
              // Try loading with the fallback URL
              return originalTextureLoad.call(this, fallbackUrl, onLoad, onProgress, onError);
            }
          );
        }
        
        // For other URLs, use the original method
        return originalTextureLoad.call(this, url, onLoad, onProgress, onError);
      };
      
      console.log('THREE.js TextureLoader patched for CORS support');
    }
  }, 100);
  
  // Stop checking after 10 seconds to avoid infinite loop
  setTimeout(() => clearInterval(checkForThree), 10000);
});
