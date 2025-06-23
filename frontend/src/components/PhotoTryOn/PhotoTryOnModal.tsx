import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, RefreshCw, Download, Share2, Zap, Check, Info } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import ARTryOn from './ARTryOn';

interface PhotoTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobeItem: {
    id: string;
    name: string;
    category: string;
    color: string;
    imageUrl: string;
  } | null;
}

const PhotoTryOnModal: React.FC<PhotoTryOnModalProps> = ({ isOpen, onClose, wardrobeItem }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'ar'>('upload');
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setError(null);
        setIsModelLoading(true);
        
        // Check if models are already loaded
        if (faceapi.nets.tinyFaceDetector.isLoaded) {
          setModelsLoaded(true);
          setIsModelLoading(false);
          return;
        }
        
        // Load models from public directory
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        
        setModelsLoaded(true);
        console.log('Face detection models loaded successfully');
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setError('Failed to load face detection models. Please try the AR option instead.');
      } finally {
        setIsModelLoading(false);
      }
    };

    if (isOpen && (activeTab === 'upload' || activeTab === 'camera')) {
      loadModels();
    }
  }, [isOpen, activeTab]);

  // Handle file drop/upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageUpload(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File size must be less than 5MB');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Only image files are allowed');
      } else {
        setError('Invalid file');
      }
    },
  });

  const handleImageUpload = (file: File) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        setSelfieImage(e.target.result as string);
        await detectFace(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const captureFromWebcam = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setSelfieImage(imageSrc);
        await detectFace(imageSrc);
      } else {
        setError('Failed to capture image');
      }
    }
  };

  const handleARCapture = (imageDataUrl: string) => {
    setSelfieImage(imageDataUrl);
    setProcessedImage(imageDataUrl);
    setFaceDetected(true);
    setIsProcessing(false);
  };

  const detectFace = async (imageSrc: string) => {
    if (!modelsLoaded) {
      setError('Face detection models are not loaded yet. Please try again or use AR mode.');
      return;
    }

    setIsProcessing(true);
    setFaceDetected(false);
    
    try {
      // Create an image element to process with face-api
      const img = new Image();
      img.src = imageSrc;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Detect faces in the image
      const detections = await faceapi.detectAllFaces(
        img, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks();

      if (detections.length === 0) {
        setError('No face detected. Please try another photo with a clear view of your face.');
        setIsProcessing(false);
        return;
      }

      setFaceDetected(true);
      
      // Process the image with the wardrobe item
      await processImage(imageSrc, detections[0]);
      
    } catch (err) {
      console.error('Error during face detection:', err);
      setError('Failed to process image. Please try again or use AR mode.');
      setIsProcessing(false);
    }
  };

  const processImage = async (imageSrc: string, faceDetection: any) => {
    if (!wardrobeItem) {
      setError('No wardrobe item selected');
      setIsProcessing(false);
      return;
    }

    try {
      // Create canvas for processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Load the selfie image
      const selfieImg = new Image();
      selfieImg.src = imageSrc;
      
      await new Promise((resolve, reject) => {
        selfieImg.onload = resolve;
        selfieImg.onerror = reject;
      });
      
      // Set canvas dimensions to match the image
      canvas.width = selfieImg.width;
      canvas.height = selfieImg.height;
      
      // Draw the selfie as background
      ctx.drawImage(selfieImg, 0, 0);
      
      // Load the wardrobe item image
      const itemImg = new Image();
      itemImg.crossOrigin = "Anonymous"; // Try to avoid CORS issues
      itemImg.src = wardrobeItem.imageUrl;
      
      try {
        await new Promise((resolve, reject) => {
          itemImg.onload = resolve;
          itemImg.onerror = (e) => {
            console.error('Error loading item image:', e);
            reject(new Error('Failed to load item image'));
          };
          
          // Set a timeout in case the image load hangs
          setTimeout(() => reject(new Error('Image load timeout')), 10000);
        });
        
        // Get face position and dimensions
        const box = faceDetection.detection.box;
        
        // Determine placement based on item category
        if (wardrobeItem.category === 'Tops' || 
            wardrobeItem.category === 'Outerwear') {
          
          // Position below the face for tops
          const topWidth = box.width * 3;
          const topHeight = (topWidth / itemImg.width) * itemImg.height;
          const topX = box.x - (topWidth - box.width) / 2;
          const topY = box.y + box.height * 1.2;
          
          // Draw the top
          ctx.drawImage(itemImg, topX, topY, topWidth, topHeight);
          
        } else if (wardrobeItem.category === 'Accessories') {
          // For accessories like hats, place on top of head
          if (wardrobeItem.name.toLowerCase().includes('hat') || 
              wardrobeItem.name.toLowerCase().includes('cap')) {
            
            const hatWidth = box.width * 1.5;
            const hatHeight = (hatWidth / itemImg.width) * itemImg.height;
            const hatX = box.x - (hatWidth - box.width) / 2;
            const hatY = box.y - hatHeight * 0.8;
            
            // Draw the hat
            ctx.drawImage(itemImg, hatX, hatY, hatWidth, hatHeight);
            
          } else if (wardrobeItem.name.toLowerCase().includes('glasses') || 
                    wardrobeItem.name.toLowerCase().includes('sunglasses')) {
            
            // For glasses, place over eyes
            const eyeWidth = box.width * 0.9;
            const eyeHeight = (eyeWidth / itemImg.width) * itemImg.height;
            const eyeX = box.x + box.width * 0.05;
            const eyeY = box.y + box.height * 0.3;
            
            // Draw the glasses
            ctx.drawImage(itemImg, eyeX, eyeY, eyeWidth, eyeHeight);
            
          } else {
            // For other accessories like necklaces
            const accWidth = box.width * 1.2;
            const accHeight = (accWidth / itemImg.width) * itemImg.height;
            const accX = box.x - (accWidth - box.width) / 2;
            const accY = box.y + box.height * 1.1;
            
            // Draw the accessory
            ctx.drawImage(itemImg, accX, accY, accWidth, accHeight);
          }
        }
        
        // Get the processed image
        const processedImageUrl = canvas.toDataURL('image/jpeg');
        setProcessedImage(processedImageUrl);
      } catch (imgError) {
        console.error('Error with item image:', imgError);
        setError('Could not load the wardrobe item image. Please try a different item or use AR mode.');
        
        // Still show the original image
        const originalImageUrl = canvas.toDataURL('image/jpeg');
        setProcessedImage(originalImageUrl);
      }
      
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to apply virtual try-on. Please try again or use AR mode.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `styleai-tryon-${new Date().getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = () => {
    if (processedImage) {
      if (navigator.share) {
        // Use Web Share API if available
        fetch(processedImage)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'styleai-tryon.jpg', { type: 'image/jpeg' });
            navigator.share({
              title: 'My StyleAI Virtual Try-On',
              text: 'Check out my virtual try-on with StyleAI!',
              files: [file]
            }).catch(err => {
              console.error('Error sharing:', err);
              // Fallback to clipboard
              copyToClipboard();
            });
          });
      } else {
        // Fallback to clipboard
        copyToClipboard();
      }
    }
  };

  const copyToClipboard = () => {
    if (processedImage) {
      // Create a temporary textarea to copy the image URL
      const textarea = document.createElement('textarea');
      textarea.value = processedImage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      alert('Image copied to clipboard!');
    }
  };

  const resetProcess = () => {
    setSelfieImage(null);
    setProcessedImage(null);
    setFaceDetected(false);
    setError(null);
  };

  // Clean up when modal closes
  const handleClose = () => {
    resetProcess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
              onClick={handleClose}
            />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
                    <Camera className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Photo Try-On</h3>
                    <p className="text-sm text-gray-600">
                      {wardrobeItem ? `Try on: ${wardrobeItem.name}` : 'Upload a selfie to try on items'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="px-6 py-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}
                
                {isModelLoading && activeTab !== 'ar' ? (
                  <div className="flex justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading face detection models...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mx-auto">
                      <button
                        onClick={() => {
                          setActiveTab('upload');
                          resetProcess();
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === 'upload'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Upload className="inline w-4 h-4 mr-2" />
                        Upload Photo
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('camera');
                          resetProcess();
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === 'camera'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Camera className="inline w-4 h-4 mr-2" />
                        Take Selfie
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('ar');
                          resetProcess();
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === 'ar'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Zap className="inline w-4 h-4 mr-2" />
                        AR Try-On
                      </button>
                    </div>
                    
                    {/* AR Mode */}
                    {activeTab === 'ar' ? (
                      <ARTryOn 
                        wardrobeItem={wardrobeItem}
                        onCapture={handleARCapture}
                      />
                    ) : !selfieImage ? (
                      <>
                        {/* Tips Button */}
                        <div className="text-center">
                          <button
                            onClick={() => setShowTips(!showTips)}
                            className="text-sm text-purple-600 hover:text-purple-800 flex items-center mx-auto"
                          >
                            <Info className="w-4 h-4 mr-1" />
                            {showTips ? 'Hide tips' : 'Show tips for best results'}
                          </button>
                        </div>
                        
                        {/* Tips */}
                        <AnimatePresence>
                          {showTips && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                            >
                              <h4 className="font-medium text-blue-800 mb-2">Tips for best results:</h4>
                              <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                                <li>Use a well-lit photo with a neutral background</li>
                                <li>Face the camera directly with your full face visible</li>
                                <li>Avoid wearing items similar to what you're trying on</li>
                                <li>Keep a neutral expression for best face detection</li>
                                <li>For tops, wear a plain t-shirt or tank top</li>
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Upload Area */}
                        {activeTab === 'upload' && (
                          <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg px-6 pt-5 pb-6 flex flex-col items-center justify-center h-64 cursor-pointer transition-all ${
                              isDragActive 
                                ? 'border-purple-400 bg-purple-50' 
                                : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                            }`}
                          >
                            <input {...getInputProps()} ref={fileInputRef} />
                            <div className="space-y-2 text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="text-sm text-gray-600">
                                <span className="font-medium text-purple-600 hover:text-purple-500">
                                  Upload a selfie
                                </span>{' '}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Camera Capture */}
                        {activeTab === 'camera' && (
                          <div className="flex flex-col items-center">
                            <div className="relative w-full max-w-md h-64 bg-gray-100 rounded-lg overflow-hidden">
                              <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{
                                  facingMode: "user",
                                  width: 640,
                                  height: 480
                                }}
                                onUserMedia={() => setIsCameraReady(true)}
                                onUserMediaError={(err) => {
                                  console.error('Camera error:', err);
                                  setError('Failed to access camera. Please check permissions or try uploading a photo instead.');
                                }}
                                className="w-full h-full object-cover"
                              />
                              {!isCameraReady && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={captureFromWebcam}
                              disabled={!isCameraReady}
                              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50"
                            >
                              <Camera className="w-5 h-5 inline mr-2" />
                              Capture Selfie
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-6">
                        {/* Processing Indicator */}
                        {isProcessing && (
                          <div className="flex justify-center py-4">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
                              <p className="text-gray-600">Processing your image...</p>
                              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Face Detection Success */}
                        {faceDetected && !isProcessing && (
                          <div className="bg-green-50 rounded-lg p-3 border border-green-200 flex items-start">
                            <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-800">Face detected successfully!</p>
                              <p className="text-xs text-green-700">Your virtual try-on is ready below.</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Result Display */}
                        {!isProcessing && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Original Image */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Your Photo</h4>
                              <div className="bg-gray-100 rounded-lg overflow-hidden">
                                <img 
                                  src={selfieImage} 
                                  alt="Your selfie" 
                                  className="w-full object-contain"
                                />
                              </div>
                            </div>
                            
                            {/* Processed Image */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Virtual Try-On</h4>
                              <div className="bg-gray-100 rounded-lg overflow-hidden">
                                {processedImage ? (
                                  <img 
                                    src={processedImage} 
                                    alt="Virtual try-on" 
                                    className="w-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center p-6 text-center">
                                    <p className="text-gray-500">Processing your image...</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        {!isProcessing && (
                          <div className="flex flex-wrap justify-center gap-3">
                            <button
                              onClick={resetProcess}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Try Another Photo
                            </button>
                            
                            {processedImage && (
                              <>
                                <button
                                  onClick={handleDownload}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Save Image
                                </button>
                                
                                <button
                                  onClick={handleShare}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                >
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Selected Item Preview */}
                    {wardrobeItem && activeTab !== 'ar' && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Item</h4>
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={wardrobeItem.imageUrl} 
                              alt={wardrobeItem.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400';
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{wardrobeItem.name}</p>
                            <p className="text-sm text-gray-600">{wardrobeItem.category} • {wardrobeItem.color}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Technology Info */}
                    {activeTab !== 'ar' && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-700">Powered by AI</h4>
                          <div className="flex items-center text-purple-600">
                            <Zap className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">StyleAI Technology</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Our advanced AI uses face detection and image processing to create realistic virtual try-ons. 
                          Results may vary based on lighting, angle, and image quality.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { PhotoTryOnModal };
export default PhotoTryOnModal;
