const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Each user can only have one active subscription at a time
    },
    plan: {
        type: String,
        enum: ["Free", "Premium", "Pro"],
        default: "Free"
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false // Optional for recurring subscriptions
    },
    isActive: {
        type: Boolean,
        default: true
    },
    stripeCustomerId: {
        type: String,
        required: false
    },
    stripeSubscriptionId: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;