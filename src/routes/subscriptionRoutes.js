const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Subscription = require('../models/Subscription');

// @desc    Initiate a checkout session with a payment gateway
// @route   POST /api/subscriptions/create-checkout-session
// @access  Private
router.post('/create-checkout-session', protect, async (req, res) => {
    try {
        // Placeholder for Stripe checkout session creation
        // In a real application, you would integrate with Stripe API here
        // and return the checkout session URL.
        console.log('Create checkout session requested by user:', req.user.id);
        res.status(200).json({
            message: 'Checkout session creation initiated (Stripe integration placeholder)',
            checkoutUrl: 'https://example.com/stripe-checkout-placeholder'
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Webhook endpoint to handle events from the payment gateway
// @route   POST /api/subscriptions/webhook
// @access  Public (Stripe will send requests to this endpoint)
router.post('/webhook', async (req, res) => {
    // Placeholder for Stripe webhook handling
    // In a real application, you would verify the webhook signature
    // and process events like 'checkout.session.completed', 'invoice.payment_succeeded', etc.
    console.log('Webhook received:', req.body);
    res.status(200).json({ received: true });
});

// @desc    Retrieve the authenticated user's current subscription status
// @route   GET /api/subscriptions/my-subscription
// @access  Private
router.get('/my-subscription', protect, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ userId: req.user.id }).populate('userId', 'email');

        if (!subscription) {
            return res.status(404).json({ message: 'No subscription found for this user.' });
        }

        res.status(200).json(subscription);
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;