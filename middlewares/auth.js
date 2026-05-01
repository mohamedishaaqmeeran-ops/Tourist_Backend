const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');

// auth middleware fix


const isAuthenticated = async (req, res, next) => {
    try {
        let token = null;

        // Authorization Header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Cookie Fallback
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        req.userId = user._id.toString();

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: error.message
        });
    }
};


const allowRoles = (roles) => {
    return async (req, res, next) => {
        
        const userId = req.userId;

        
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        
       req.user = user;
req.userId = user._id;
      
        next();
    }
}

module.exports = {
    isAuthenticated,
    allowRoles
}