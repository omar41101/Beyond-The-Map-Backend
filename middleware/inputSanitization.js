import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// Sanitize data to prevent MongoDB Operator Injection
export const sanitizeMongo = mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`[SECURITY] Sanitized ${key} in request`);
    }
});

// Clean data from XSS attacks
export const sanitizeXSS = xss();

// Custom input validation middleware
export const validateInput = (req, res, next) => {
    // Remove null bytes
    const sanitizeString = (str) => {
        if (typeof str === 'string') {
            return str.replace(/\0/g, '');
        }
        return str;
    };

    const sanitizeObject = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = sanitizeString(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };

    if (req.body) sanitizeObject(req.body);
    if (req.params) sanitizeObject(req.params);
    if (req.query) sanitizeObject(req.query);

    next();
};
