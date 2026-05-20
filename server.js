require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Import routes
const designRoutes = require('./src/routes/designRoutes');
const imageRoutes = require('./src/routes/imageRoutes');
const authRoutes = require('./src/routes/authRoutes');
const artistRoutes = require('./src/routes/artistRoutes');
const collectionRoutes = require('./src/routes/collectionRoutes');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const { protect } = require('./src/middleware/authMiddleware');

app.use(express.json());

// Use authentication routes
app.use('/api/auth', authRoutes);

// Protect other routes
app.use('/api/designs', protect, designRoutes);
app.use('/api/images', protect, imageRoutes);
app.use('/api/artists', protect, artistRoutes); // Protect POST route for artist creation
app.use('/api/artists', artistRoutes); // Public GET routes for artists
app.use('/api/collections', protect, collectionRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/', (req, res) => {
    res.send('Tattoo Design App Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});