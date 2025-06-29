import express from 'express';
import Joi from 'joi';
import { authenticateToken } from '../middleware/auth.js';
import { getUserById, updateUser } from '../services/userService.js';
import { User } from '../models/User.js';
import { verifyRevenueCatReceipt } from '../services/revenueCatService.js';

const router = express.Router();

const subscriptionSchema = Joi.object({
  plan: Joi.string().valid('1_month', '3_months', '6_months', '1_year').required(),
});

const revenueCatReceiptSchema = Joi.object({
  productIdentifier: Joi.string().required(),
  transactionIdentifier: Joi.string().required(),
  receipt: Joi.string().required(),
});

// Get subscription plans
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: '1_month',
      name: '1 Month',
      duration: '1 month',
      price: 9.99,
      features: ['Unlimited outfit recommendations', 'Smart shopping suggestions', 'Priority support'],
      popular: false
    },
    {
      id: '3_months',
      name: '3 Months',
      duration: '3 months',
      price: 24.99,
      originalPrice: 29.97,
      savings: '17%',
      features: ['Unlimited outfit recommendations', 'Smart shopping suggestions', 'Priority support', 'Advanced style analytics'],
      popular: true
    },
    {
      id: '6_months',
      name: '6 Months',
      duration: '6 months',
      price: 44.99,
      originalPrice: 59.94,
      savings: '25%',
      features: ['Unlimited outfit recommendations', 'Smart shopping suggestions', 'Priority support', 'Advanced style analytics', 'Personal stylist consultation'],
      popular: false
    },
    {
      id: '1_year',
      name: '1 Year',
      duration: '1 year',
      price: 79.99,
      originalPrice: 119.88,
      savings: '33%',
      features: ['Unlimited outfit recommendations', 'Smart shopping suggestions', 'Priority support', 'Advanced style analytics', 'Personal stylist consultation', 'Exclusive fashion insights'],
      popular: false
    }
  ];

  res.json({ plans });
});

// Get user subscription status
router.get('/status', authenticateToken, async (req, res, next) => {
  try {
    const userData = await getUserById(req.user.id);
    const user = new User(userData);
    
    const subscriptionInfo = user.getSubscriptionInfo();
    const accessInfo = user.canAccessRecommendations();
    
    res.json({
      subscription: subscriptionInfo,
      access: accessInfo
    });
  } catch (error) {
    next(error);
  }
});

// Subscribe to a plan (dummy payment)
router.post('/subscribe', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = subscriptionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userData = await getUserById(req.user.id);
    const user = new User(userData);
    
    // Simulate payment processing
    console.log(`Processing subscription for user ${user.id}, plan: ${value.plan}`);
    
    // Subscribe user
    await user.subscribe(value.plan);
    
    // Get updated subscription info
    const subscriptionInfo = user.getSubscriptionInfo();
    
    res.json({
      success: true,
      message: 'Subscription activated successfully!',
      subscription: subscriptionInfo
    });
  } catch (error) {
    next(error);
  }
});

// Verify RevenueCat receipt
router.post('/verify-receipt', authenticateToken, async (req, res, next) => {
  try {
    const { error, value } = revenueCatReceiptSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userData = await getUserById(req.user.id);
    const user = new User(userData);
    
    // Verify receipt with RevenueCat
    const verificationResult = await verifyRevenueCatReceipt(
      value.productIdentifier,
      value.transactionIdentifier,
      value.receipt
    );
    
    if (!verificationResult.isValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid receipt',
        error: verificationResult.error
      });
    }
    
    // Map RevenueCat product to our plan
    let plan;
    if (value.productIdentifier === 'com.styleai.monthly') {
      plan = '1_month';
    } else if (value.productIdentifier === 'com.styleai.quarterly') {
      plan = '3_months';
    } else if (value.productIdentifier === 'com.styleai.annual') {
      plan = '1_year';
    } else {
      plan = '1_month'; // Default to 1 month
    }
    
    // Subscribe user
    await user.subscribe(plan);
    
    // Get updated subscription info
    const subscriptionInfo = user.getSubscriptionInfo();
    
    res.json({
      success: true,
      message: 'Subscription verified and activated successfully!',
      subscription: subscriptionInfo
    });
  } catch (error) {
    next(error);
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, async (req, res, next) => {
  try {
    const userData = await getUserById(req.user.id);
    
    await updateUser(req.user.id, {
      subscriptionStatus: 'cancelled',
      subscriptionPlan: null,
      subscriptionEndDate: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
