const Subscription = require('../models/Subscription');

const checkSubscription = (requiredPlan = 'Free') => async (req, res, next) => {
    // If user is not authenticated, they are treated as 'Free'
    if (!req.user) {
        req.user.subscription = { plan: 'Free' };
        return next();
    }

    try {
        let subscription = await Subscription.findOne({ userId: req.user.id, isActive: true });

        if (!subscription) {
            // If no active subscription, default to 'Free' plan
            subscription = { plan: 'Free' };
        }

        req.user.subscription = subscription; // Attach subscription to user object

        const planOrder = { "Free": 0, "Premium": 1, "Pro": 2 };

        if (planOrder[req.user.subscription.plan] >= planOrder[requiredPlan]) {
            next();
        } else {
            res.status(403).json({ message: `Access denied. ${requiredPlan} subscription required.` });
        }

    } catch (error) {
        console.error('Error in subscription middleware:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Middleware to limit AI generations for free users
const limitAIGenerations = async (req, res, next) => {
    if (req.user && req.user.subscription && req.user.subscription.plan === 'Free') {
        // Placeholder for actual AI generation count logic
        // In a real application, you would track AI generations per user
        // and compare against a limit.
        const freeUserGenerationLimit = 5; // Example limit
        const userGenerationsToday = 0; // Placeholder: fetch actual count from DB/cache

        if (userGenerationsToday >= freeUserGenerationLimit) {
            return res.status(403).json({ message: 'Free plan users are limited to 5 AI generations per day. Please upgrade to Premium or Pro.' });
        }
    }
    next();
};

module.exports = { checkSubscription, limitAIGenerations };