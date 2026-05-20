const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    specialties: {
        type: [String],
        default: []
    },
    portfolioImages: {
        type: [String], // URLs to images
        default: []
    },
    contactInfo: {
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            trim: true
        },
        website: {
            type: String,
            trim: true
        }
    },
    bio: {
        type: String,
        trim: true
    },
    averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Artist', ArtistSchema);