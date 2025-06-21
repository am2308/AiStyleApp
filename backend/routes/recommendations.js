import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUserWardrobeItems } from '../services/wardrobeService.js';
import { generateOutfitRecommendations } from '../services/aiService.js';
import { getUserById } from '../services/userService.js';
import { User } from '../models/User.js';

const router = express.Router();

// Get outfit recommendations with subscription check
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { occasion } = req.query;
    
    console.log('Generating outfit recommendations for user:', req.user.id, 'occasion:', occasion);
    
    // Get user data and check subscription status
    const userData = await getUserById(req.user.id);
    const user = new User(userData);
    
    // Check if user can access recommendations
    const accessCheck = user.canAccessRecommendations();
    
    if (!accessCheck.allowed) {
      return res.status(403).json({
        error: accessCheck.message,
        reason: accessCheck.reason,
        subscriptionRequired: true
      });
    }
    
    // Get user's wardrobe items
    const wardrobeItems = await getUserWardrobeItems(req.user.id);
    
    if (wardrobeItems.length === 0) {
      return res.json({
        recommendations: [],
        message: 'Add items to your wardrobe to get outfit recommendations',
        wardrobeAnalysis: {
          strengths: [],
          gaps: ['Empty wardrobe'],
          suggestions: ['Start by adding basic items like tops and bottoms']
        },
        subscriptionInfo: user.getSubscriptionInfo()
      });
    }

    console.log('Found wardrobe items:', wardrobeItems.length);

    // Generate AI recommendations
    const result = await generateOutfitRecommendations(
      wardrobeItems,
      req.user,
      occasion
    );

    // Increment recommendation usage for free users
    if (user.subscriptionStatus !== 'active') {
      await user.incrementRecommendationUsage();
    }

    console.log('Generated recommendations:', result.recommendations?.length || 0);

    // Add subscription info to response
    const updatedUser = new User(await getUserById(req.user.id));
    result.subscriptionInfo = updatedUser.getSubscriptionInfo();
    result.accessInfo = updatedUser.canAccessRecommendations();

    res.json(result);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    next(error);
  }
});

// Get outfit recommendations for specific items
router.post('/for-items', authenticateToken, async (req, res, next) => {
  try {
    const { itemIds, occasion } = req.body;
    
    if (!itemIds || !Array.isArray(itemIds)) {
      return res.status(400).json({ error: 'Item IDs array is required' });
    }

    // Check subscription status
    const userData = await getUserById(req.user.id);
    const user = new User(userData);
    
    const accessCheck = user.canAccessRecommendations();
    if (!accessCheck.allowed) {
      return res.status(403).json({
        error: accessCheck.message,
        reason: accessCheck.reason,
        subscriptionRequired: true
      });
    }

    // Get user's wardrobe items
    const allWardrobeItems = await getUserWardrobeItems(req.user.id);
    
    // Filter to only the specified items
    const selectedItems = allWardrobeItems.filter(item => itemIds.includes(item.id));
    
    if (selectedItems.length === 0) {
      return res.status(404).json({ error: 'No matching items found in wardrobe' });
    }

    // Generate recommendations for the selected items
    const recommendations = await generateOutfitRecommendations(
      selectedItems,
      req.user,
      occasion
    );

    // Increment usage for free users
    if (user.subscriptionStatus !== 'active') {
      await user.incrementRecommendationUsage();
    }

    res.json(recommendations);
  } catch (error) {
    console.error('Error generating item-specific recommendations:', error);
    next(error);
  }
});

export default router;
