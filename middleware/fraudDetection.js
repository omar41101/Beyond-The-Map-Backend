import Booking from '../models/Booking.js';
import { logAudit } from '../utils/auditLogger.js';

// Detect suspicious booking patterns
export const detectSuspiciousBooking = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const oneHourAgo = new Date(now - 60 * 60 * 1000);

        // Check for multiple bookings in short time
        const recentBookings = await Booking.countDocuments({
            user: userId,
            createdAt: { $gte: oneHourAgo }
        });

        if (recentBookings >= 5) {
            await logAudit('SUSPICIOUS_ACTIVITY', req, {
                reason: 'Multiple bookings in short time',
                count: recentBookings
            }, 'warning');

            return res.status(429).json({
                success: false,
                message: 'Too many bookings. Please wait before making another booking.'
            });
        }

        next();
    } catch (error) {
        console.error('Fraud detection error:', error);
        next(); // Continue even if fraud detection fails
    }
};

// Detect suspicious payment patterns
export const detectSuspiciousPayment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const oneHourAgo = new Date(now - 60 * 60 * 1000);

        // Check for multiple failed payments
        const failedPayments = await Booking.countDocuments({
            user: userId,
            paymentStatus: 'failed',
            updatedAt: { $gte: oneHourAgo }
        });

        if (failedPayments >= 3) {
            await logAudit('SUSPICIOUS_ACTIVITY', req, {
                reason: 'Multiple failed payments',
                count: failedPayments
            }, 'warning');

            return res.status(429).json({
                success: false,
                message: 'Multiple failed payment attempts detected. Please contact support.'
            });
        }

        next();
    } catch (error) {
        console.error('Fraud detection error:', error);
        next();
    }
};

// Validate booking amount against tour price
export const validateBookingAmount = async (req, res, next) => {
    try {
        const { bookingId, amount } = req.body;
        
        if (bookingId && amount) {
            const booking = await Booking.findById(bookingId).populate('tour');
            
            if (booking && Math.abs(booking.totalPrice - amount) > 0.01) {
                await logAudit('SUSPICIOUS_ACTIVITY', req, {
                    reason: 'Price mismatch',
                    expectedAmount: booking.totalPrice,
                    providedAmount: amount
                }, 'warning');

                return res.status(400).json({
                    success: false,
                    message: 'Payment amount does not match booking price.'
                });
            }
        }

        next();
    } catch (error) {
        console.error('Amount validation error:', error);
        next();
    }
};
