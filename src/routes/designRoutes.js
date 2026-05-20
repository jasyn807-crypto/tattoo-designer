const express = require('express');
const router = express.Router();
const { generateImage } = require('../services/aiService');
const { uploadFile } = require('../config/s3');
const Design = require('../models/Design');
const { protect } = require('../middleware/authMiddleware');
const { checkSubscription, limitAIGenerations } = require('../middleware/subscriptionMiddleware');

// AI design generation endpoint
router.post('/generate-design', protect, checkSubscription('Premium'), limitAIGenerations, async (req, res) => {
    const { style, location, realism, description } = req.body;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    try {
        // 1. Construct prompt for AI service
        const prompt = `Generate a tattoo design with the following characteristics: style - ${style}, location - ${location}, realism - ${realism}. Additional details: ${description || ''}.`;
        console.log('AI Prompt:', prompt);

        // 2. Call AI service to generate image
        const imageData = await generateImage(prompt); // This could be a URL or base64 image data

        let imageUrl;
        if (imageData.startsWith('http')) {
            // If AI service returns a direct URL
            imageUrl = imageData;
        } else {
            // If AI service returns base64 image data, convert to buffer and upload to S3
            const buffer = Buffer.from(imageData, 'base64');
            const filename = `design-${Date.now()}.png`; // Unique filename
            const s3UploadResult = await uploadFile({
                path: filename, // S3 upload expects a path, but we're providing a buffer
                filename: filename,
                mimetype: 'image/png',
                buffer: buffer // Pass buffer directly for upload
            });
            imageUrl = s3UploadResult;
        }

        // 3. Save design metadata to the database
        const newDesign = new Design({
            userId,
            imageUrl,
            metadata: {
                style,
                location,
                realism,
                description,
                prompt, // Store the prompt used for generation
            },
        });
        await newDesign.save();

        res.status(201).json({
            message: 'AI design generated and saved successfully',
            design: newDesign,
            imageUrl: newDesign.imageUrl,
        });

    } catch (error) {
        console.error('Error in AI design generation:', error);
        res.status(500).json({ message: 'Failed to generate AI design', error: error.message });
    }
});

module.exports = router;