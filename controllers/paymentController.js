import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';
import { logAudit } from '../utils/auditLogger.js';

// @route   POST /api/payments/fiat/initiate
// @desc    Initiate fiat payment
// @access  Private
export const initiateFiatPayment = async (req, res) => {
    try {
        const { bookingId, paymentGateway, currency = 'MAD' } = req.body;

        const booking = await Booking.findById(bookingId).populate('tour');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to pay for this booking'
            });
        }

        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Booking already paid'
            });
        }

        // Mock payment initiation with simulated payment intent
        const paymentIntent = {
            bookingId: booking._id,
            amount: booking.totalPrice,
            currency,
            paymentGateway,
            status: 'pending',
            clientSecret: `mock_secret_${Date.now()}`,
            redirectUrl: `${process.env.FRONTEND_URL}/payment/confirm/${bookingId}`
        };

        res.json({
            success: true,
            message: 'Payment initiated successfully',
            paymentIntent
        });
    } catch (error) {
        console.error('Initiate fiat payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error initiating payment',
            error: error.message
        });
    }
};

// @route   POST /api/payments/fiat/confirm
// @desc    Confirm fiat payment (simulated card payment)
// @access  Private
export const confirmFiatPayment = async (req, res) => {
    try {
        const { 
            bookingId, 
            cardNumber,
            cardholderName,
            expiryDate,
            cvv,
            paymentGateway = 'card'
        } = req.body;

        // Validate card details (simple simulation)
        if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
            return res.status(400).json({
                success: false,
                message: 'All card details are required'
            });
        }

        // Simulate card validation
        const cardLast4 = cardNumber.slice(-4);
        
        // Simulate failed payment for specific test card
        if (cardNumber === '4000000000000002') {
            return res.status(400).json({
                success: false,
                message: 'Payment declined - Insufficient funds'
            });
        }

        // Simulate network error for specific test card
        if (cardNumber === '4000000000000127') {
            return res.status(400).json({
                success: false,
                message: 'Payment declined - Invalid card number'
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Generate simulated transaction ID
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Update booking with payment details
        booking.paymentStatus = 'paid';
        booking.paymentMethod = 'fiat';
        booking.status = 'confirmed';
        booking.fiatPayment = {
            transactionId,
            paymentGateway,
            cardLast4,
            cardholderName,
            paymentDate: new Date(),
            currency: 'MAD',
            amount: booking.totalPrice
        };

        await booking.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate('tour', 'name location price duration images')
            .populate('user', 'fullName email');

        // Log successful payment
        await logAudit('PAYMENT_SUCCESS', req, {
            bookingId: booking._id,
            amount: booking.totalPrice,
            gateway: paymentGateway,
            transactionId
        });

        res.json({
            success: true,
            message: 'Payment successful! Your booking is confirmed.',
            booking: populatedBooking,
            transaction: {
                id: transactionId,
                amount: booking.totalPrice,
                currency: 'MAD',
                cardLast4,
                date: new Date()
            }
        });
    } catch (error) {
        console.error('Confirm fiat payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
};

// @route   POST /api/payments/fiat/refund
// @desc    Process refund
// @access  Private (Admin or Agency)
export const processRefund = async (req, res) => {
    try {
        const { bookingId, reason } = req.body;

        const booking = await Booking.findById(bookingId).populate('tour');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check authorization (admin or tour agency)
        const tour = await Tour.findById(booking.tour._id);
        if (req.user.role !== 'admin' && tour.agency.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to process refunds'
            });
        }

        if (booking.paymentStatus !== 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Booking is not paid, cannot refund'
            });
        }

        // In production, call actual payment gateway refund API
        booking.paymentStatus = 'refunded';
        booking.status = 'cancelled';

        await booking.save();

        res.json({
            success: true,
            message: 'Refund processed successfully',
            booking
        });
    } catch (error) {
        console.error('Process refund error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing refund',
            error: error.message
        });
    }
};

// @route   GET /api/payments/methods
// @desc    Get available payment methods
// @access  Public
export const getPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = [
            {
                id: 'hedera',
                name: 'Hedera (HBAR)',
                description: 'Pay with HBAR cryptocurrency',
                enabled: true,
                type: 'crypto'
            },
            {
                id: 'stripe',
                name: 'Credit/Debit Card',
                description: 'Pay with Visa, Mastercard, Amex',
                enabled: true,
                type: 'fiat',
                gateway: 'stripe'
            },
            {
                id: 'paypal',
                name: 'PayPal',
                description: 'Pay with your PayPal account',
                enabled: true,
                type: 'fiat',
                gateway: 'paypal'
            },
            {
                id: 'cash',
                name: 'Cash on Tour',
                description: 'Pay in cash when tour starts',
                enabled: true,
                type: 'cash'
            }
        ];

        res.json({
            success: true,
            paymentMethods
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payment methods',
            error: error.message
        });
    }
};

// @route   GET /api/payments/history
// @desc    Get user's payment history
// @access  Private
export const getPaymentHistory = async (req, res) => {
    try {
        const bookings = await Booking.find({ 
            user: req.user.id,
            paymentStatus: { $in: ['paid', 'refunded'] }
        })
        .populate('tour', 'name location price')
        .select('totalPrice paymentStatus paymentMethod fiatPayment hederaTransactionId createdAt')
        .sort('-createdAt');

        const history = bookings.map(booking => ({
            bookingId: booking._id,
            tour: booking.tour,
            amount: booking.totalPrice,
            paymentStatus: booking.paymentStatus,
            paymentMethod: booking.paymentMethod,
            transactionId: booking.paymentMethod === 'hedera' 
                ? booking.hederaTransactionId 
                : booking.fiatPayment?.transactionId,
            paymentDate: booking.fiatPayment?.paymentDate || booking.createdAt,
            receiptUrl: booking.fiatPayment?.receiptUrl
        }));

        res.json({
            success: true,
            count: history.length,
            payments: history
        });
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment history',
            error: error.message
        });
    }
};
