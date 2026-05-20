const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Dummy user for authentication
const DUMMY_USER = { id: '1', username: 'testuser' };

// Dummy login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // In a real app, you'd validate credentials against a database
    if (username === DUMMY_USER.username && password === 'password') {
        const token = jwt.sign({ id: DUMMY_USER.id, username: DUMMY_USER.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;