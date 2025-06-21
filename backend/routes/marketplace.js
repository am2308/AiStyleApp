import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { generateMarketplaceRecommendations, generateSmartShoppingList } from '../services/aiService.js';
import marketplaceService from '../services/marketplaceService.js';

const router = express.Router();

// Get marketplace items with real-time data
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { category, color, occasion, minPrice, maxPrice, source } = req.query;
    
    const filters = {
      category,
      color,
      occasion,
      priceRange: minPrice && maxPrice ? { min: parseFloat(minPrice), max: parseFloat(maxPrice) } : null
    };

    console.log('Fetching marketplace items with filters:', filters);
    
    // Generate AI-powered recommendations
    const items = await generateMarketplaceRecommendations(req.user, filters);
    
    res.json({
      items,
      totalCount: items.length,
      filters: filters,
      sources: ['eBay', 'Online Stores']
    });
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    next(error);
  }
});

// Search specific marketplace
router.get('/search', authenticateToken, async (req, res, next) => {
  try {
    const { q, category, minPrice, maxPrice, sources } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerms = q.split(' ').filter(term => term.length > 0);
    const priceRange = minPrice && maxPrice ? { min: parseFloat(minPrice), max: parseFloat(maxPrice) } : null;
    const searchSources = sources ? sources.split(',') : ['ebay', 'rapidapi', 'free'];

    console.log('Searching marketplace with terms:', searchTerms);
    
    const products = await marketplaceService.searchProducts(
      searchTerms,
      category,
      priceRange,
      searchSources
    );

    res.json({
      products,
      query: q,
      totalCount: products.length,
      sources: searchSources
    });
  } catch (error) {
    console.error('Error searching marketplace:', error);
    next(error);
  }
});

// Get smart shopping list
router.get('/shopping-list', authenticateToken, async (req, res, next) => {
  try {
    const { getUserWardrobeItems } = await import('../services/wardrobeService.js');
    const wardrobeItems = await getUserWardrobeItems(req.user.id);
    
    const { occasions } = req.query;
    const targetOccasions = occasions ? occasions.split(',') : [];

    console.log('Generating smart shopping list for user:', req.user.id);
    
    const shoppingList = await generateSmartShoppingList(wardrobeItems, req.user, targetOccasions);
    
    res.json(shoppingList);
  } catch (error) {
    console.error('Error generating shopping list:', error);
    next(error);
  }
});

// Get trending items
router.get('/trending', authenticateToken, async (req, res, next) => {
  try {
    const { category } = req.query;
    
    // Get trending search terms based on season and user preferences
    const trendingTerms = getTrendingTerms(req.user.preferredStyle, category);
    
    const trendingProducts = await marketplaceService.searchProducts(
      trendingTerms,
      category,
      null,
      ['ebay', 'free']
    );

    res.json({
      trending: trendingProducts.slice(0, 15),
      category: category || 'all',
      terms: trendingTerms
    });
  } catch (error) {
    console.error('Error fetching trending items:', error);
    next(error);
  }
});

// Helper function to get trending terms
function getTrendingTerms(preferredStyle, category) {
  const currentMonth = new Date().getMonth();
  const season = getSeason(currentMonth);
  
  const seasonalTerms = {
    'spring': ['spring', 'light', 'pastel', 'fresh'],
    'summer': ['summer', 'lightweight', 'breathable', 'bright'],
    'fall': ['fall', 'autumn', 'warm', 'cozy'],
    'winter': ['winter', 'warm', 'layering', 'thermal']
  };

  const styleTerms = {
    'Casual': ['casual', 'comfortable'],
    'Business': ['professional', 'business'],
    'Formal': ['formal', 'elegant'],
    'Bohemian': ['boho', 'bohemian'],
    'Minimalist': ['minimalist', 'simple'],
    'Trendy': ['trendy', 'fashion'],
    'Classic': ['classic', 'timeless']
  };

  let terms = [...(seasonalTerms[season] || [])];
  
  if (preferredStyle && styleTerms[preferredStyle]) {
    terms.push(...styleTerms[preferredStyle]);
  }
  
  if (category) {
    terms.push(category.toLowerCase());
  }
  
  return terms.length > 0 ? terms : ['fashion', 'trending'];
}

function getSeason(month) {
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

export default router;
