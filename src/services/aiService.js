require('dotenv').config();
const axios = require('axios');

const AI_API_KEY = process.env.AI_API_KEY;
const AI_API_ENDPOINT = process.env.AI_API_ENDPOINT;

const generateImage = async (prompt) => {
    try {
        const response = await axios.post(AI_API_ENDPOINT, {
            prompt: prompt,
            // Other parameters like image size, model, etc. can be added here
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
            }
        });
        // Assuming the AI service returns a direct image URL or base64 encoded image
        if (response.data.imageUrl) {
            return { imageUrl: response.data.imageUrl };
        } else if (response.data.image) {
            // Assuming response.data.image is a base64 encoded string
            const imageBuffer = Buffer.from(response.data.image, 'base64');
            const filename = `ai-generated-${Date.now()}.png`; // Or derive from AI response
            const mimetype = 'image/png'; // Or derive from AI response
            return { imageBuffer, filename, mimetype };
        } else {
            throw new Error('AI service did not return an image URL or image data.');
        }
    } catch (error) {
        console.error('Error calling AI image generation service:', error.response ? error.response.data : error.message);
        throw new Error('Failed to generate image from AI service.');
    }
};

module.exports = {
    generateImage,
};