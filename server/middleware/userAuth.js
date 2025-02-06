const jwt = require("jsonwebtoken");
const User = require('../models/userModel');

const userAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            
            if (!user) {
                return res.status(401).json({ 
                    success: false,
                    message: 'User not found' 
                });
            }

            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Server error in authentication' 
        });
    }
};

module.exports = userAuth;
