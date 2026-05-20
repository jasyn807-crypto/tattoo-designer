const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const { protect, authorize } = require('../middleware/authMiddleware'); // Assuming authMiddleware exists

// @route   POST /api/artists
// @desc    Create a new artist profile
// @access  Private (Admin/Artist) - for now, simple creation
router.post('/', protect, async (req, res) => {
    try {
        const artist = new Artist(req.body);
        await artist.save();
        res.status(201).json(artist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/artists
// @desc    Get all artists with optional filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { location, specialties } = req.query;
        let query = {};

        if (location) {
            query.location = new RegExp(location, 'i'); // Case-insensitive search
        }

        if (specialties) {
            query.specialties = { $in: specialties.split(',') }; // Search for any of the provided specialties
        }

        const artists = await Artist.find(query);
        res.json(artists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/artists/:id
// @desc    Get a single artist by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);

        if (!artist) {
            return res.status(404).json({ msg: 'Artist not found' });
        }

        res.json(artist);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Artist not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;