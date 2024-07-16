const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.SECRET_KEY;

exports.register = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        user = new User({
            username,
            password: await bcrypt.hash(password, 10)
        });

        const savedUser = await user.save();
        res.json({ message: 'Registration successful', user: savedUser });

    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });

    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}