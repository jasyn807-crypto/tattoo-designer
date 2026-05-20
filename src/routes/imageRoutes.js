const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs'); // Required to delete local files after S3 upload
const { uploadFile } = require('../config/s3'); // Import S3 upload function
const { protect } = require('../middleware/authMiddleware'); // Import auth middleware
const { generateImage } = require('../services/aiService'); // Import AI service
const { backgroundRemoval, outlineConversion } = require('../services/imageProcessingService'); // Import image processing service
const Design = require('../models/Design'); // Import Design model

const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

// Image upload endpoint
router.post('/upload-image', protect, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
    }

    try {
        const imageUrl = await uploadFile(req.file);
        // Delete the local file after successful upload to S3
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting local file:", err);
        });
        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error("Image upload failed:", error);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

// Background removal endpoint
router.post('/modify-image/background-removal', protect, async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ message: 'No image URL provided for background removal.' });
    }

    try {
        // In a real scenario, backgroundRemoval would return a buffer or a path to a local file
        // For this task, it returns a dummy URL.
        const modifiedImageUrl = await backgroundRemoval(imageUrl);

        // If backgroundRemoval returns a buffer, upload it to S3
        // For now, we assume it returns a URL directly.
        // If it returned a buffer:
        // const s3Key = `modified-images/bg-removed-${Date.now()}.png`;
        // const uploadedUrl = await uploadFile({ buffer: modifiedImageBuffer, filename: s3Key, mimetype: 'image/png' });

        res.status(200).json({
            message: 'Background removal successful',
            modifiedImageUrl: modifiedImageUrl
        });
    } catch (error) {
        console.error("Background removal failed:", error);
        res.status(500).json({ message: 'Background removal failed', error: error.message });
    }
});

// Outline conversion endpoint
router.post('/modify-image/outline-conversion', protect, async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ message: 'No image URL provided for outline conversion.' });
    }

    try {
        // In a real scenario, outlineConversion would return a buffer or a path to a local file
        // For this task, it returns a dummy URL.
        const modifiedImageUrl = await outlineConversion(imageUrl);

        // If outlineConversion returns a buffer, upload it to S3
        // For now, we assume it returns a URL directly.
        // If it returned a buffer:
        // const s3Key = `modified-images/outline-${Date.now()}.png`;
        // const uploadedUrl = await uploadFile({ buffer: modifiedImageBuffer, filename: s3Key, mimetype: 'image/png' });

        res.status(200).json({
            message: 'Outline conversion successful',
            modifiedImageUrl: modifiedImageUrl
        });
    } catch (error) {
        console.error("Outline conversion failed:", error);
        res.status(500).json({ message: 'Outline conversion failed', error: error.message });
    }
});

// Design refinement endpoint
router.post('/refine-design', protect, async (req, res) => {
    const { designId, refinementPrompt, style, location, realism } = req.body;

    try {
        const originalDesign = await Design.findById(designId);
        if (!originalDesign) {
            return res.status(404).json({ message: 'Original design not found.' });
        }

        // Construct a new prompt based on original design and refinement parameters
        let newPrompt = originalDesign.metadata.prompt || ''; // Assuming original design stores its prompt
        if (refinementPrompt) {
            newPrompt += `, ${refinementPrompt}`;
        }
        if (style) {
            newPrompt += `, style: ${style}`;
        }
        if (location) {
            newPrompt += `, location: ${location}`;
        }
        if (realism) {
            newPrompt += `, realism: ${realism}`;
        }

        // Call AI image generation service
        const aiResponse = await generateImage(newPrompt);

        let imageUrl;
        if (aiResponse.imageUrl) {
            imageUrl = aiResponse.imageUrl;
        } else if (aiResponse.imageBuffer) {
            const s3Key = `designs/refined-${aiResponse.filename}`;
            imageUrl = await uploadFile({ buffer: aiResponse.imageBuffer, filename: s3Key, mimetype: aiResponse.mimetype });
        } else {
            throw new Error('AI service did not return a valid image.');
        }

        // Create a new design entry for the refined image
        const refinedDesign = await Design.create({
            userId: req.user.id, // Assuming user ID is available from protect middleware
            imageUrl: imageUrl,
            metadata: {
                ...originalDesign.metadata, // Keep original metadata
                prompt: newPrompt, // Update with new prompt
                style: style || originalDesign.metadata.style,
                location: location || originalDesign.metadata.location,
                realism: realism || originalDesign.metadata.realism,
                refinedFrom: designId // Link to the original design
            }
        });

        res.status(200).json({
            message: 'Design refined successfully',
            imageUrl: refinedDesign.imageUrl,
            design: refinedDesign
        });

    } catch (error) {
        console.error("Design refinement failed:", error);
        res.status(500).json({ message: 'Design refinement failed', error: error.message });
    }
});

// Design generation endpoint
router.post('/generate-design', protect, async (req, res) => {
    const { designId, prompt, style, location, realism } = req.body;

    try {
        let basePrompt = '';
        let baseStyle = '';
        let baseLocation = '';
        let baseRealism = '';
        let regeneratedFrom = null;

        if (designId) {
            const originalDesign = await Design.findById(designId);
            if (!originalDesign) {
                return res.status(404).json({ message: 'Original design for regeneration not found.' });
            }
            basePrompt = originalDesign.metadata.prompt || '';
            baseStyle = originalDesign.metadata.style || '';
            baseLocation = originalDesign.metadata.location || '';
            baseRealism = originalDesign.metadata.realism || '';
            regeneratedFrom = designId;
        }

        // Construct the full prompt for the AI service, prioritizing new parameters
        let fullPrompt = prompt || basePrompt;
        let finalStyle = style || baseStyle;
        let finalLocation = location || baseLocation;
        let finalRealism = realism || baseRealism;

        if (!fullPrompt) {
            return res.status(400).json({ message: 'Prompt is required for design generation.' });
        }

        let aiPrompt = fullPrompt;
        if (finalStyle) {
            aiPrompt += `, style: ${finalStyle}`;
        }
        if (finalLocation) {
            aiPrompt += `, location: ${finalLocation}`;
        }
        if (finalRealism) {
            aiPrompt += `, realism: ${finalRealism}`;
        }

        // Call AI image generation service
        const aiResponse = await generateImage(aiPrompt);

        let imageUrl;
        if (aiResponse.imageUrl) {
            imageUrl = aiResponse.imageUrl;
        } else if (aiResponse.imageBuffer) {
            const s3Key = `designs/generated-${aiResponse.filename}`;
            imageUrl = await uploadFile({ buffer: aiResponse.imageBuffer, filename: s3Key, mimetype: aiResponse.mimetype });
        } else {
            throw new Error('AI service did not return a valid image.');
        }

        // Save the new design to the database
        const newDesign = await Design.create({
            userId: req.user.id,
            imageUrl: imageUrl,
            metadata: {
                prompt: fullPrompt,
                style: finalStyle,
                location: finalLocation,
                realism: finalRealism,
                regeneratedFrom: regeneratedFrom // Link to the original design if regenerated
            }
        });

        res.status(201).json({
            message: 'Design generated successfully',
            imageUrl: newDesign.imageUrl,
            design: newDesign
        });

    } catch (error) {
        console.error("Design generation failed:", error);
        res.status(500).json({ message: 'Design generation failed', error: error.message });
    }
});

module.exports = router;