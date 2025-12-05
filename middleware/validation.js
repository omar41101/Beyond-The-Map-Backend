import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// User validation rules
export const validateRegistration = [
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number and special character'),
    body('fullName')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
    body('phone')
        .optional()
        .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Please provide a valid phone number'),
    validate
];

export const validateLogin = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

// Booking validation rules
export const validateBooking = [
    body('tourId').isMongoId().withMessage('Invalid tour ID'),
    body('bookingDate').isISO8601().withMessage('Invalid booking date'),
    body('numberOfParticipants')
        .isInt({ min: 1, max: 50 }).withMessage('Participants must be between 1 and 50'),
    body('specialRequests')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Special requests must be less than 500 characters'),
    validate
];

// Payment validation rules
export const validatePayment = [
    body('bookingId').isMongoId().withMessage('Invalid booking ID'),
    body('paymentGateway')
        .isIn(['stripe', 'paypal', 'square']).withMessage('Invalid payment gateway'),
    body('amount')
        .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    validate
];

export const validatePaymentConfirmation = [
    body('bookingId').isMongoId().withMessage('Invalid booking ID'),
    body('transactionId').notEmpty().withMessage('Transaction ID is required'),
    body('paymentGateway')
        .isIn(['stripe', 'paypal', 'square']).withMessage('Invalid payment gateway'),
    validate
];

// Tour validation rules
export const validateTour = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Tour name must be 3-100 characters'),
    body('description')
        .trim()
        .isLength({ min: 20, max: 2000 }).withMessage('Description must be 20-2000 characters'),
    body('price')
        .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
    body('duration')
        .isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
    body('maxParticipants')
        .isInt({ min: 1, max: 100 }).withMessage('Max participants must be 1-100'),
    body('category')
        .isIn(['adventure', 'cultural', 'historical', 'nature', 'food', 'shopping', 'relaxation'])
        .withMessage('Invalid category'),
    validate
];

// Review validation rules
export const validateReview = [
    body('rating')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment')
        .trim()
        .isLength({ min: 10, max: 1000 }).withMessage('Comment must be 10-1000 characters'),
    validate
];

// MongoDB ID validation
export const validateMongoId = [
    param('id').isMongoId().withMessage('Invalid ID'),
    validate
];

// Agency validation
export const validateAgency = [
    body('companyName')
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Company name must be 2-100 characters'),
    body('licenseNumber')
        .trim()
        .notEmpty().withMessage('License number is required'),
    body('description')
        .trim()
        .isLength({ min: 20, max: 1000 }).withMessage('Description must be 20-1000 characters'),
    validate
];

// Artist validation
export const validateArtist = [
    body('artistName')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Artist name must be 2-50 characters'),
    body('bio')
        .trim()
        .isLength({ min: 20, max: 1000 }).withMessage('Bio must be 20-1000 characters'),
    body('specialty')
        .isIn(['pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'painting', 'sculpture', 'calligraphy', 'other'])
        .withMessage('Invalid specialty'),
    body('experience')
        .isInt({ min: 0, max: 100 }).withMessage('Experience must be 0-100 years'),
    validate
];
