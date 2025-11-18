import express, { Request, Response } from 'express';
import Subscription from '../models/Subscription';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Subscription plan features
const PLAN_FEATURES = {
  free: [
    'Access to Beginner level courses',
    'Basic course materials',
    'Community discussion access',
    'Progress tracking',
  ],
  premium: [
    'All Free features',
    'Access to Intermediate level courses',
    'Premium course materials',
    'Priority support',
    'Downloadable resources',
    'Certificate of completion',
  ],
  pro: [
    'All Premium features',
    'Access to Advanced level courses',
    'Exclusive advanced materials',
    '1-on-1 mentoring sessions',
    'Project review and feedback',
    'Job placement assistance',
    'Lifetime access to all content',
  ],
};

const PLAN_PRICES = {
  free: 0,
  premium: 29.99,
  pro: 79.99,
};

/**
 * @route   GET /api/subscriptions/plans
 * @desc    Get available subscription plans
 * @access  Public
 */
router.get('/plans', async (req: Request, res: Response) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: PLAN_PRICES.free,
        interval: 'forever',
        features: PLAN_FEATURES.free,
      },
      {
        id: 'premium',
        name: 'Premium',
        price: PLAN_PRICES.premium,
        interval: 'month',
        features: PLAN_FEATURES.premium,
        popular: true,
      },
      {
        id: 'pro',
        name: 'Professional',
        price: PLAN_PRICES.pro,
        interval: 'month',
        features: PLAN_FEATURES.pro,
      },
    ];

    res.json({
      success: true,
      data: plans,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/subscriptions/current
 * @desc    Get current user's subscription
 * @access  Private
 */
router.get('/current', authMiddleware, async (req: Request, res: Response) => {
  try {
    let subscription = await Subscription.findOne({ userId: req.userId });

    // Create free subscription if none exists
    if (!subscription) {
      subscription = await Subscription.create({
        userId: req.userId,
        plan: 'free',
        status: 'active',
        startDate: new Date(),
        endDate: new Date('2099-12-31'),
        features: PLAN_FEATURES.free,
        amount: 0,
      });
    }

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/subscriptions/upgrade
 * @desc    Upgrade subscription
 * @access  Private
 */
router.post('/upgrade', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { plan, paymentMethod } = req.body;

    if (!['premium', 'pro'].includes(plan)) {
      res.status(400).json({
        success: false,
        error: 'Invalid plan selected',
      });
      return;
    }

    let subscription = await Subscription.findOne({ userId: req.userId });

    const subscriptionData = {
      userId: req.userId,
      plan,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      autoRenew: true,
      paymentMethod,
      amount: PLAN_PRICES[plan as keyof typeof PLAN_PRICES],
      features: PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES],
    };

    if (subscription) {
      // Update existing subscription
      subscription = await Subscription.findOneAndUpdate(
        { userId: req.userId },
        subscriptionData,
        { new: true }
      );
    } else {
      // Create new subscription
      subscription = await Subscription.create(subscriptionData);
    }

    res.json({
      success: true,
      message: `Successfully upgraded to ${plan} plan!`,
      data: subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/subscriptions/cancel
 * @desc    Cancel subscription
 * @access  Private
 */
router.post('/cancel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.userId },
      { 
        status: 'cancelled',
        autoRenew: false,
      },
      { new: true }
    );

    if (!subscription) {
      res.status(404).json({
        success: false,
        error: 'Subscription not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

