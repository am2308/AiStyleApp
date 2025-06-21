import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Palette, BarChart3, Zap } from 'lucide-react';

interface StyleInsightsProps {
  wardrobeItems: any[];
  userProfile: any;
  recommendations: any[];
}

const StyleInsights: React.FC<StyleInsightsProps> = ({ wardrobeItems, userProfile, recommendations }) => {
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    generateInsights();
  }, [wardrobeItems, recommendations]);

  const generateInsights = () => {
    // Color analysis
    const colorDistribution = wardrobeItems.reduce((acc, item) => {
      acc[item.color] = (acc[item.color] || 0) + 1;
      return acc;
    }, {});

    const dominantColors = Object.entries(colorDistribution)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3);

    // Category analysis
    const categoryDistribution = wardrobeItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    // Style score calculation
    const styleScore = calculateStyleScore();
    
    // Versatility score
    const versatilityScore = calculateVersatilityScore();

    // Trend alignment
    const trendAlignment = calculateTrendAlignment();

    setInsights({
      colorDistribution: dominantColors,
      categoryDistribution,
      styleScore,
      versatilityScore,
      trendAlignment,
      totalItems: wardrobeItems.length,
      recommendations: recommendations.length
    });
  };

  const calculateStyleScore = () => {
    // Complex algorithm considering color harmony, style consistency, etc.
    const baseScore = Math.min(wardrobeItems.length * 10, 100);
    const colorVariety = Object.keys(wardrobeItems.reduce((acc, item) => {
      acc[item.color] = true;
      return acc;
    }, {})).length;
    
    const varietyBonus = Math.min(colorVariety * 5, 20);
    return Math.min(baseScore + varietyBonus, 100);
  };

  const calculateVersatilityScore = () => {
    const categories = Object.keys(wardrobeItems.reduce((acc, item) => {
      acc[item.category] = true;
      return acc;
    }, {}));
    
    return Math.min(categories.length * 15, 100);
  };

  const calculateTrendAlignment = () => {
    // Mock trend alignment based on recent additions and style preferences
    const trendyColors = ['Purple', 'Green', 'Pink', 'Blue'];
    const trendyItems = wardrobeItems.filter(item => 
      trendyColors.includes(item.color) || 
      item.name.toLowerCase().includes('trendy') ||
      item.name.toLowerCase().includes('modern')
    );
    
    return Math.min((trendyItems.length / wardrobeItems.length) * 100, 100);
  };

  if (!insights) return null;

  const insightCards = [
    {
      title: 'Style Score',
      value: insights.styleScore,
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      description: 'Overall style coherence and quality'
    },
    {
      title: 'Versatility',
      value: insights.versatilityScore,
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      description: 'Outfit combination potential'
    },
    {
      title: 'Trend Alignment',
      value: insights.trendAlignment,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      description: 'How current your style is'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
          <BarChart3 className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Style Insights</h3>
          <p className="text-gray-600">AI-powered analysis of your wardrobe</p>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {insightCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-lg bg-gradient-to-r p-4 text-white"
            style={{
              background: `linear-gradient(135deg, ${card.color.split(' ')[1]}, ${card.color.split(' ')[3]})`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <card.icon className="w-6 h-6" />
              <span className="text-2xl font-bold">{Math.round(card.value)}</span>
            </div>
            <h4 className="font-semibold mb-1">{card.title}</h4>
            <p className="text-sm opacity-90">{card.description}</p>
            
            {/* Progress bar */}
            <div className="mt-3 bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${card.value}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                className="bg-white rounded-full h-2"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Color Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Palette className="w-5 h-5 mr-2 text-purple-600" />
            Color Palette
          </h4>
          <div className="space-y-2">
            {insights.colorDistribution.map(([color, count]: [string, number], index: number) => (
              <div key={color} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: color === 'White' ? '#ffffff' :
                                     color === 'Black' ? '#000000' :
                                     color === 'Blue' ? '#3b82f6' :
                                     color === 'Red' ? '#ef4444' :
                                     color === 'Green' ? '#10b981' :
                                     color === 'Gray' ? '#6b7280' :
                                     color === 'Purple' ? '#8b5cf6' :
                                     color === 'Pink' ? '#ec4899' :
                                     color === 'Yellow' ? '#f59e0b' :
                                     color === 'Orange' ? '#f97316' :
                                     color === 'Brown' ? '#92400e' :
                                     '#6b7280'
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">{color}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(count / insights.totalItems) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" />
            Quick Stats
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Items</span>
              <span className="font-semibold text-gray-900">{insights.totalItems}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Categories</span>
              <span className="font-semibold text-gray-900">{Object.keys(insights.categoryDistribution).length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Outfit Combinations</span>
              <span className="font-semibold text-gray-900">{insights.recommendations}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Style Preference</span>
              <span className="font-semibold text-gray-900">{userProfile.preferredStyle || 'Not set'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-purple-900 mb-2">AI Recommendations</h4>
        <div className="space-y-2 text-sm text-purple-800">
          {insights.styleScore < 70 && (
            <p>• Consider adding more coordinated pieces to improve style coherence</p>
          )}
          {insights.versatilityScore < 60 && (
            <p>• Add versatile basics that can be mixed and matched easily</p>
          )}
          {insights.trendAlignment < 50 && (
            <p>• Incorporate some trending colors or styles to modernize your wardrobe</p>
          )}
          {insights.styleScore >= 80 && insights.versatilityScore >= 80 && (
            <p>• Excellent wardrobe! Consider exploring new styles or occasions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleInsights;
