const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const config = dotenv.config();
const JWT_SECRET = process.env.SECRET_KEY;

exports.authToken = async (req, res, next) => {
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};