const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_super_secret_key'; // same as in authController

// Middleware to check JWT token
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ error: 'Access denied. Token missing.' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = decoded; // attach decoded info to request
        next();
    });
};