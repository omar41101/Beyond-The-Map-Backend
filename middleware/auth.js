import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, token failed' 
            });
        }
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, no token' 
        });
    }
};

// Optional authentication - allows both authenticated and anonymous users
export const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            console.log('Optional auth: Invalid token, continuing as anonymous');
            req.user = null;
        }
    }

    // Continue regardless of auth status
    next();
};

// Allow fiat payments without authentication (creates anonymous booking)
export const allowFiatPayment = async (req, res, next) => {
    let token;

    // Check for JWT token first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            req.isAuthenticated = true;
        } catch (error) {
            console.log('Auth failed, checking payment method');
            req.isAuthenticated = false;
        }
    }

    // If no valid token, check if this is a fiat payment
    if (!req.user && req.body.paymentMethod === 'fiat') {
        // Allow fiat payments - create anonymous user context
        req.user = {
            isAnonymous: true,
            email: req.body.email || 'anonymous@fiat-booking.com',
            fullName: req.body.customerName || 'Anonymous Customer'
        };
        req.isAuthenticated = false;
        req.isFiatPayment = true;
        return next();
    }

    // If authenticated, continue normally
    if (req.user) {
        req.isAuthenticated = true;
        req.isFiatPayment = req.body.paymentMethod === 'fiat';
        return next();
    }

    // No auth and not a fiat payment - reject
    return res.status(401).json({ 
        success: false, 
        message: 'Authentication required for wallet payments' 
    });
};

