import rateLimit from 'express-rate-limit';

// General API rate limiter - more lenient for development
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased to 500 requests per 15 minutes for development
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting if request fails before hitting limiter
    skipFailedRequests: false,
    // Don't apply to OPTIONS requests (CORS preflight)
    skip: (req) => req.method === 'OPTIONS'
});

// Strict limiter for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes.'
    },
    skipSuccessfulRequests: true,
});

// Payment endpoints limiter
export const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 payment requests per hour
    message: {
        success: false,
        message: 'Too many payment attempts, please try again later.'
    },
});

// Registration limiter
export const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 registrations per hour
    message: {
        success: false,
        message: 'Too many accounts created from this IP, please try again later.'
    },
});
