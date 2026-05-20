const mongoose = require('mongoose');

const DesignSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Assuming a User model will be created later
    },
    imageUrl: {
        type: String,
        required: true,
    },
    metadata: {
        style: { type: String },
        location: { type: String },
        realism: { type: String },
        // Add other relevant metadata fields as needed
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Design', DesignSchema);