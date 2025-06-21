import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, ExternalLink } from 'lucide-react';

interface OutfitDetailsProps {
  outfit: {
    occasion: string;
    confidence: number;
    description: string;
    styleNotes?: string;
    missingItems?: Array<{
      category: string;
      description: string;
      priority: string;
      availableProducts?: Array<{
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        url: string;
        source: string;
      }>;
    }>;
  };
  items: Array<{
    id: string;
    name: string;
    category: string;
    color: string;
    imageUrl: string;
  }>;
}

const OutfitDetails: React.FC<OutfitDetailsProps> = ({ outfit, items }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Great Match';
    if (confidence >= 0.6) return 'Good Match';
    return 'Needs Improvement';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {outfit.occasion} Outfit
        </h4>
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span className={`text-sm font-medium ${getConfidenceColor(outfit.confidence)}`}>
            {Math.round(outfit.confidence * 100)}% - {getConfidenceLabel(outfit.confidence)}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{outfit.description}</p>
        {outfit.styleNotes && (
          <p className="text-sm text-gray-500 italic mb-4">{outfit.styleNotes}</p>
        )}
      </div>

      {/* Outfit Items Grid */}
      <div>
        <h5 className="font-medium text-gray-900 mb-3">Items in this outfit:</h5>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div
                className="w-full h-20 rounded mb-2 border shadow-sm bg-center bg-cover"
                style={{
                  backgroundImage: `url(${item.imageUrl})`
                }}
              />
              <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-600">{item.category}</span>
                <div
                  className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* Missing Items */}
      {outfit.missingItems && outfit.missingItems.length > 0 && (
        <div className="border-t pt-4">
          <h5 className="font-medium text-gray-900 mb-3">Complete the look:</h5>
          <div className="space-y-3">
            {outfit.missingItems.map((missingItem, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {missingItem.description}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(missingItem.priority)}`}>
                    {missingItem.priority}
                  </span>
                </div>
                
                {missingItem.availableProducts && missingItem.availableProducts.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {missingItem.availableProducts.slice(0, 3).map((product) => (
                      <a
                        key={product.id}
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <div className="relative">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-12 object-cover rounded group-hover:opacity-80 transition-opacity"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400';
                            }}
                          />
                          <div className="absolute top-0 right-0 p-1 bg-white/80 rounded-bl">
                            <ExternalLink className="w-2 h-2 text-gray-500" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">{product.name}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">${product.price}</span>
                          <span className="text-xs text-gray-500">{product.source}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
                
                <div className="mt-2 flex justify-end">
                  <a
                    href="/marketplace"
                    className="flex items-center text-xs text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    <span>Shop similar items</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitDetails;
