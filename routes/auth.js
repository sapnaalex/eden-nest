const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'eden_nest_secret_key';

// 1. API: User Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide name, email, and password.' });
        }
        
        // Encrypt password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, role });
        
        res.status(201).json({ message: 'User registered successfully!', userId: newUser.id });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed: ' + error.message });
    }
});

// 2. API: User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        
        // Generate security token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: 'Login successful!', token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: 'Login failed: ' + error.message });
    }
});

module.exports = router;