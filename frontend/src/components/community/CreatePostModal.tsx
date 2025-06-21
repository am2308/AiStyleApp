import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Hash, MapPin, Calendar, Users, ChevronDown, Plus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/AuthContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => Promise<void>;
  wardrobeItems: any[];
  challenges: any[];
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  wardrobeItems,
  challenges
}) => {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const captionRef = useRef<HTMLTextAreaElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5242880, // 5MB
    maxFiles: 4,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setImages(prev => [...prev, ...acceptedFiles].slice(0, 4));
        
        // Create preview URLs
        const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews].slice(0, 4));
        
        setError(null);
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File size must be less than 5MB');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Only image files are allowed');
      } else if (rejection.errors[0]?.code === 'too-many-files') {
        setError('Maximum 4 images allowed');
      } else {
        setError('Invalid file');
      }
    },
  });

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleRemoveImage = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index]);
    
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      setError('Please add at least one image');
      return;
    }

    if (!caption.trim()) {
      setError('Please add a caption');
      captionRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const postData = {
        caption,
        images,
        tags,
        location,
        wardrobeItems: selectedItems,
        challengeId: selectedChallenge || undefined
      };

      await onSubmit(postData);
      
      // Reset form
      setCaption('');
      setSelectedItems([]);
      setSelectedChallenge('');
      setTags([]);
      setLocation('');
      setImages([]);
      
      // Revoke all object URLs
      previewImages.forEach(url => URL.revokeObjectURL(url));
      setPreviewImages([]);
      
    } catch (error: any) {
      setError(error.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up object URLs when modal closes
  const handleClose = () => {
    previewImages.forEach(url => URL.revokeObjectURL(url));
    setPreviewImages([]);
    setImages([]);
    setCaption('');
    setSelectedItems([]);
    setSelectedChallenge('');
    setTags([]);
    setLocation('');
    setError(null);
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
                  <h3 className="text-lg font-semibold text-gray-900">Create Style Post</h3>
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
                
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">Sharing with everyone</p>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  <div>
                    <textarea
                      ref={captionRef}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Share your style story..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                      rows={3}
                    />
                  </div>
                  
                  {/* Image Upload */}
                  <div>
                    {previewImages.length > 0 ? (
                      <div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {previewImages.map((preview, index) => (
                            <div key={index} className="relative aspect-square">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          {previewImages.length < 4 && (
                            <div
                              {...getRootProps()}
                              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-gray-50 transition-all"
                            >
                              <input {...getInputProps()} />
                              <Plus size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {4 - previewImages.length} more {previewImages.length === 3 ? 'image' : 'images'} allowed
                        </p>
                      </div>
                    ) : (
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg px-6 pt-5 pb-6 flex justify-center cursor-pointer transition-all ${
                          isDragActive 
                            ? 'border-purple-400 bg-purple-50' 
                            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-purple-600 hover:text-purple-500">
                              Upload photos
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB (max 4 images)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Wardrobe Items */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tag Wardrobe Items
                    </label>
                    {wardrobeItems.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No wardrobe items available. <a href="/wardrobe" className="text-purple-600 hover:text-purple-800">Add items to your wardrobe</a>
                      </p>
                    ) : (
                      <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                        {wardrobeItems.map(item => (
                          <div 
                            key={item.id} 
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer mb-1 ${
                              selectedItems.includes(item.id) 
                                ? 'bg-purple-100 border border-purple-200' 
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() => handleToggleItem(item.id)}
                          >
                            <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.category} • {item.color}</p>
                            </div>
                            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                              {selectedItems.includes(item.id) && (
                                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Style Challenge */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add to Style Challenge (Optional)
                    </label>
                    <div className="relative">
                      <select
                        value={selectedChallenge}
                        onChange={(e) => setSelectedChallenge(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                      >
                        <option value="">Select a challenge (optional)</option>
                        {challenges.filter(c => c.isActive && c.isJoined).map(challenge => (
                          <option key={challenge.id} value={challenge.id}>
                            {challenge.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Tags
                    </label>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="relative flex-1">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                          placeholder="Add a tag"
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <button
                        onClick={handleAddTag}
                        disabled={!currentTag.trim()}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <div key={tag} className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                            <span className="text-sm">#{tag}</span>
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="text-purple-600 hover:text-purple-800"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Location (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Add a location"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Posting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Camera size={16} className="mr-2" />
                      Share Post
                    </div>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
