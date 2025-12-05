import helmet from 'helmet';

// Configure security headers
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
});

// XSS Protection
export const xssProtection = (req, res, next) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
};

// Prevent clickjacking
export const noSniff = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
};
