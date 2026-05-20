const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Collection = require('../models/Collection');
const Design = require('../models/Design'); // Assuming Design model exists

// @route   POST /api/collections
// @desc    Create a new collection
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, description, designs } = req.body;
        const newCollection = new Collection({
            name,
            description,
            userId: req.user.id,
            designs: designs || []
        });

        const collection = await newCollection.save();
        res.status(201).json(collection);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/collections
// @desc    Get all collections for the authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const collections = await Collection.find({ userId: req.user.id }).populate('designs');
        res.json(collections);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/collections/:id
// @desc    Get a single collection by ID and its designs
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id).populate('designs');

        if (!collection) {
            return res.status(404).json({ msg: 'Collection not found' });
        }

        // Ensure user owns the collection
        if (collection.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        res.json(collection);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Collection not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/collections/:id
// @desc    Update a collection (add/remove designs, change name/description)
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { name, description, designs } = req.body;

        let collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({ msg: 'Collection not found' });
        }

        // Ensure user owns the collection
        if (collection.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        collection.name = name || collection.name;
        collection.description = description || collection.description;
        if (designs) {
            collection.designs = designs;
        }

        await collection.save();
        res.json(collection);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Collection not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/collections/:id
// @desc    Delete a collection
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            return res.status(404).json({ msg: 'Collection not found' });
        }

        // Ensure user owns the collection
        if (collection.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Collection.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Collection removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Collection not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;