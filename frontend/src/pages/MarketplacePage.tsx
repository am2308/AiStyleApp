import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  ExternalLink, 
  Filter, 
  Search, 
  Star, 
  TrendingUp,
  DollarSign,
  Sparkles,
  RefreshCw,
  Zap,
  Grid3X3,
  List,
  Heart,
  Eye
} from 'lucide-react';
import { recommendationService, MarketplaceItem } from '../services/recommendationService';
import { useLocation } from 'react-router-dom';
import FashionBackground from '../components/FashionBackground';

const categories = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Footwear',
  'Accessories',
];

const colors = [
  'Black',
  'White',
  'Gray',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Purple',
  'Pink',
  'Brown',
  'Orange',
  'Multi',
];

const occasions = [
  'Casual',
  'Work',
  'Date Night',
  'Party',
  'Formal',
  'Weekend',
  'Travel',
];

const MarketplacePage: React.FC = () => {
  const location = useLocation();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [trendingItems, setTrendingItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    occasion: '',
    minPrice: '',
    maxPrice: '',
  });
  const [activeTab, setActiveTab] = useState<'recommended' | 'search' | 'trending'>('recommended');
  const [totalCount, setTotalCount] = useState(0);
  const [sources, setSources] = useState<string[]>([]);
  const [isSmartMode, setIsSmartMode] = useState(false);

  // Check if coming from smart recommendation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const smartMode = urlParams.get('smart');
    const categoryParam = urlParams.get('category');
    
    if (smartMode === 'true') {
      setIsSmartMode(true);
      setActiveTab('recommended');
      if (categoryParam) {
        setFilters(prev => ({ ...prev, category: categoryParam }));
      }
    }
  }, [location]);

  const fetchRecommendedItems = async () => {
    try {
      setIsLoading(true);
      const priceRange = filters.minPrice && filters.maxPrice ? {
        min: parseFloat(filters.minPrice),
        max: parseFloat(filters.maxPrice)
      } : undefined;

      const response = await recommendationService.getMarketplaceItems(
        filters.category || undefined,
        filters.color || undefined,
        filters.occasion || undefined,
        priceRange
      );
      
      setItems(response.items);
      setTotalCount(response.totalCount);
      setSources(response.sources);
    } catch (error) {
      console.error('Failed to fetch marketplace items:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingItems = async () => {
    try {
      const response = await recommendationService.getTrendingItems(filters.category || undefined);
      setTrendingItems(response.trending);
    } catch (error) {
      console.error('Failed to fetch trending items:', error);
      setTrendingItems([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      const priceRange = filters.minPrice && filters.maxPrice ? {
        min: parseFloat(filters.minPrice),
        max: parseFloat(filters.maxPrice)
      } : undefined;

      const response = await recommendationService.searchMarketplace(
        searchQuery,
        filters.category || undefined,
        priceRange
      );
      
      setItems(response.products);
      setTotalCount(response.totalCount);
      setSources(response.sources);
    } catch (error) {
      console.error('Failed to search marketplace:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      color: '',
      occasion: '',
      minPrice: '',
      maxPrice: '',
    });
    setSearchQuery('');
    setIsSmartMode(false);
  };

  useEffect(() => {
    if (activeTab === 'recommended') {
      fetchRecommendedItems();
    } else if (activeTab === 'trending') {
      fetchTrendingItems();
    }
  }, [filters, activeTab]);

  useEffect(() => {
    fetchTrendingItems();
  }, []);

  const displayItems = activeTab === 'trending' ? trendingItems : items;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aesthetic Background */}
      <FashionBackground />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-3">
                  <ShoppingBag className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Fashion Marketplace</h1>
                  <p className="text-gray-600">Discover trending fashion from top retailers worldwide</p>
                </div>
              </div>

              {/* Smart Mode Banner */}
              {isSmartMode && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">Smart Shopping Mode</h3>
                      <p className="text-sm text-green-700">
                        Showing items that will improve your outfit recommendations and wardrobe completeness.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab('recommended')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'recommended'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sparkles className="inline w-4 h-4 mr-2" />
                  Recommended
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'search'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Search className="inline w-4 h-4 mr-2" />
                  Search
                </button>
                <button
                  onClick={() => setActiveTab('trending')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'trending'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp className="inline w-4 h-4 mr-2" />
                  Trending
                </button>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
          >
            {/* Search Bar */}
            {activeTab === 'search' && (
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search for clothing items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}

            {/* Filters and Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 flex-1">
                <div>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={filters.color}
                    onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90"
                  >
                    <option value="">All Colors</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={filters.occasion}
                    onChange={(e) => setFilters({ ...filters, occasion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90"
                  >
                    <option value="">All Occasions</option>
                    {occasions.map((occasion) => (
                      <option key={occasion} value={occasion}>
                        {occasion}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90"
                    />
                  </div>
                </div>

                <div>
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw size={16} className="inline mr-2" />
                    Clear
                  </button>
                </div>
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-2">
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
              </div>
            </div>

            {/* Results Info */}
            {(totalCount > 0 || sources.length > 0) && (
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
                <span>{totalCount} items found</span>
                {sources.length > 0 && (
                  <span>Sources: {sources.join(', ')}</span>
                )}
              </div>
            )}
          </motion.div>
          
          {/* Items Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
          >
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Discovering fashion items...</p>
                </div>
              </div>
            ) : displayItems.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-6 w-24 h-24 mx-auto mb-6">
                  <ShoppingBag className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {activeTab === 'search' ? 'No Results Found' : 'No Items Available'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'search' 
                    ? 'Try adjusting your search terms or filters.'
                    : 'Try adjusting your filters to see more items.'
                  }
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activeTab === 'trending' ? 'Trending Now' : 'Recommended for You'}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {displayItems.length} items
                  </span>
                </div>

                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {displayItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
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
                        </div>

                        {/* Price Badge */}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-900 shadow-sm">
                          ${item.price.toFixed(2)}
                        </div>
                        
                        {/* Rating */}
                        {item.rating && (
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-900 shadow-sm flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                            {item.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                      
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <h3 className="font-medium text-gray-900 truncate mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{item.category}</span>
                            {item.color && (
                              <>
                                <span>•</span>
                                <span>{item.color}</span>
                              </>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {item.source}
                          </span>
                        </div>
                        
                        {item.condition && (
                          <p className="text-xs text-gray-500 mb-3">Condition: {item.condition}</p>
                        )}
                        
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                        >
                          <ShoppingBag size={16} />
                          <span>View on {item.source}</span>
                          <ExternalLink size={12} />
                        </motion.a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;