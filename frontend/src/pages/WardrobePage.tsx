import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shirt, Upload, X, Plus, Search, Filter, Grid3X3, List, 
  Sparkles, TrendingUp, Eye, Heart, Star, ShoppingBag,
  ChevronDown, ArrowRight, Zap, Camera
} from 'lucide-react';
import { useWardrobe } from '../contexts/WardrobeContext';
import { useAuth } from '../contexts/AuthContext';
import FashionBackground from '../components/FashionBackground';
import { PhotoTryOnModal } from '../components/PhotoTryOn';

const categories = [
  { name: 'All Items', icon: Grid3X3, count: 0 },
  { name: 'Tops', icon: Shirt, count: 0 },
  { name: 'Bottoms', icon: Shirt, count: 0 },
  { name: 'Dresses', icon: Shirt, count: 0 },
  { name: 'Outerwear', icon: Shirt, count: 0 },
  { name: 'Footwear', icon: Shirt, count: 0 },
  { name: 'Accessories', icon: Sparkles, count: 0 },
];

const colors = [
  'Black', 'White', 'Gray', 'Red', 'Blue', 'Green', 
  'Yellow', 'Purple', 'Pink', 'Brown', 'Orange', 'Multi',
];

const WardrobePage: React.FC = () => {
  const { items, addItem, removeItem, isLoading } = useWardrobe();
  const { user } = useAuth();
  
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    color: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPhotoTryOn, setShowPhotoTryOn] = useState(false);
  const [selectedItemForTryOn, setSelectedItemForTryOn] = useState<any>(null);

  // Calculate category counts
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: cat.name === 'All Items' 
      ? items.length 
      : items.filter(item => item.category === cat.name).length
  }));

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      const matchesCategory = selectedCategory === 'All Items' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.color.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'color':
          return a.color.localeCompare(b.color);
        default:
          return 0;
      }
    });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5242880, // 5MB
    multiple: false,
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

  const validateForm = () => {
    if (!newItem.name.trim()) {
      setError('Please enter an item name');
      return false;
    }
    if (!newItem.category) {
      setError('Please select a category');
      return false;
    }
    if (!newItem.color) {
      setError('Please select a color');
      return false;
    }
    if (!selectedFile) {
      setError('Please upload an image');
      return false;
    }
    return true;
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await addItem({
        ...newItem,
        image: selectedFile!,
      });
      resetForm();
    } catch (error: any) {
      setError(error.message || 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      await removeItem(id);
    }
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      category: '',
      color: '',
    });
    setSelectedFile(null);
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setIsAdding(false);
    setError(null);
  };

  const handleTryOn = (item: any) => {
    setSelectedItemForTryOn(item);
    setShowPhotoTryOn(true);
  };

  if (!user?.skinTone) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <FashionBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
            >
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
                <Shirt className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Style Profile</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Before building your digital wardrobe, we need to understand your unique style preferences 
                to provide personalized recommendations.
              </p>
              <button
                onClick={() => window.location.href = '/profile'}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Set Up Your Profile
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aesthetic Background */}
      <FashionBackground />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-3">
                  <Shirt className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Digital Wardrobe</h1>
                  <p className="text-gray-600">Organize, visualize, and style your fashion collection</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search your wardrobe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90 backdrop-blur-sm"
                  />
                </div>
                
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600'
                    }`}
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600'
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
                
                {/* Add Item Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAdding(true)}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50"
                >
                  <Plus size={18} />
                  <span>Add Item</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-purple-600" />
                  Categories
                </h3>
                
                <div className="space-y-2">
                  {categoriesWithCounts.map((category) => (
                    <motion.button
                      key={category.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedCategory === category.name
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <category.icon size={18} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedCategory === category.name
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name A-Z</option>
                    <option value="color">Color</option>
                  </select>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Total Items:</span>
                      <span className="font-medium">{items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categories:</span>
                      <span className="font-medium">{categoriesWithCounts.filter(c => c.count > 0 && c.name !== 'All Items').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Most Popular:</span>
                      <span className="font-medium">
                        {categoriesWithCounts
                          .filter(c => c.name !== 'All Items')
                          .sort((a, b) => b.count - a.count)[0]?.name || 'None'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading your wardrobe...</p>
                    </div>
                  </div>
                </div>
              ) : filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 text-center"
                >
                  {items.length === 0 ? (
                    <>
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                        <Shirt className="w-12 h-12 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Start Building Your Digital Wardrobe</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Add your favorite clothing items to get personalized outfit recommendations and style insights.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(true)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                      >
                        <Plus size={18} className="mr-2" />
                        Add Your First Item
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                        <Search className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Items Found</h3>
                      <p className="text-gray-600">
                        No items match your current filters. Try adjusting your search or category selection.
                      </p>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
                >
                  {/* Results Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedCategory} {selectedCategory !== 'All Items' && `(${filteredItems.length})`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                    
                    {filteredItems.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">Style Score: {Math.round(filteredItems.length * 8.5)}%</span>
                      </div>
                    )}
                  </div>

                  {/* Items Grid */}
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className={`group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all ${
                          viewMode === 'list' ? 'flex' : ''
                        }`}
                      >
                        <div className={`relative ${viewMode === 'list' ? 'w-32 h-32' : 'h-64'} bg-gray-100`}>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400';
                            }}
                          />
                          
                          {/* Overlay Actions */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleTryOn(item)}
                              className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white transition-colors"
                            >
                              <Camera size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white transition-colors"
                            >
                              <Eye size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white transition-colors"
                            >
                              <Heart size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                            >
                              <X size={16} />
                            </motion.button>
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                              {item.category}
                            </span>
                          </div>

                          {/* Color Indicator */}
                          <div className="absolute top-2 right-2">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
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
                        </div>
                        
                        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <h4 className="font-semibold text-gray-900 truncate mb-1">{item.name}</h4>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{item.color}</span>
                              <span>•</span>
                              <span>{item.category}</span>
                            </div>
                            {viewMode === 'list' && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">4.8</span>
                              </div>
                            )}
                          </div>
                          
                          {viewMode === 'list' && (
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                Added {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                              <div className="flex items-center space-x-1 text-xs text-green-600">
                                <Zap className="w-3 h-3" />
                                <span>Versatile</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Try On Button (List View) */}
                          {viewMode === 'list' && (
                            <button
                              onClick={() => handleTryOn(item)}
                              className="mt-2 w-full flex items-center justify-center space-x-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                            >
                              <Camera className="w-3 h-3" />
                              <span>Try On with Photo</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Item Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
                onClick={resetForm}
              />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <form onSubmit={handleAddItem}>
                  <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
                        <Plus className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>
                    </div>
                    <button
                      type="button"
                      onClick={resetForm}
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
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item Name *
                        </label>
                        <input
                          type="text"
                          value={newItem.name}
                          onChange={(e) => {
                            setNewItem({ ...newItem, name: e.target.value });
                            setError(null);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="e.g., Blue Oxford Shirt"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <div className="relative">
                            <select
                              value={newItem.category}
                              onChange={(e) => {
                                setNewItem({ ...newItem, category: e.target.value });
                                setError(null);
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                              required
                            >
                              <option value="">Select Category</option>
                              {categories.slice(1).map((category) => (
                                <option key={category.name} value={category.name}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Color *
                          </label>
                          <div className="relative">
                            <select
                              value={newItem.color}
                              onChange={(e) => {
                                setNewItem({ ...newItem, color: e.target.value });
                                setError(null);
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                              required
                            >
                              <option value="">Select Color</option>
                              {colors.map((color) => (
                                <option key={color} value={color}>
                                  {color}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item Photo *
                        </label>
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
                            {previewImage ? (
                              <div className="flex flex-col items-center">
                                <img
                                  src={previewImage}
                                  alt="Preview"
                                  className="h-32 object-contain mb-4 rounded-lg shadow-sm"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (previewImage) {
                                      URL.revokeObjectURL(previewImage);
                                    }
                                    setPreviewImage(null);
                                    setSelectedFile(null);
                                    setError(null);
                                  }}
                                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                                >
                                  Remove Image
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium text-purple-600 hover:text-purple-500">
                                    Upload a file
                                  </span>{' '}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Adding...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Plus size={16} className="mr-2" />
                          Add Item
                        </div>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Photo Try-On Modal */}
      <PhotoTryOnModal
        isOpen={showPhotoTryOn}
        onClose={() => setShowPhotoTryOn(false)}
        wardrobeItem={selectedItemForTryOn}
      />
    </div>
  );
};

export default WardrobePage;
