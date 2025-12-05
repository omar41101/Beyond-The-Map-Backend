import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';

// @route   POST /api/bookings
// @desc    Create booking (supports both authenticated and fiat payments)
// @access  Private for wallet, Public for fiat
export const createBooking = async (req, res) => {
    try {
        const { tourId, bookingDate, numberOfParticipants, specialRequests, paymentMethod, email, customerName } = req.body;
        
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found'
            });
        }
        
        if (!tour.isActive) {
            return res.status(400).json({
                success: false,
                message: 'This tour is not available'
            });
        }
        
        const totalPrice = tour.price * numberOfParticipants;
        
        // Handle user assignment based on payment method
        let userId = req.user?.id;
        let bookingData = {
            tour: tourId,
            bookingDate,
            numberOfParticipants,
            totalPrice,
            specialRequests,
            paymentMethod: paymentMethod || 'wallet'
        };

        // For fiat payments without authentication
        if (req.isFiatPayment && req.user?.isAnonymous) {
            bookingData.guestEmail = email || req.user.email;
            bookingData.guestName = customerName || req.user.fullName;
            bookingData.isGuestBooking = true;
            // Don't set user field for anonymous bookings
        } else {
            bookingData.user = userId;
        }
        
        const booking = await Booking.create(bookingData);
        
        const populatedBooking = await Booking.findById(booking._id)
            .populate('tour', 'name location price')
            .populate('user', 'fullName email');
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: populatedBooking,
            paymentMethod: paymentMethod || 'wallet'
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// @route   GET /api/bookings/my-bookings
// @desc    Get user's bookings
// @access  Private
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('tour', 'name location price duration images')
            .sort('-createdAt');
        
        res.json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
export const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('tour')
            .populate('user', 'fullName email phone');
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        // Check if user owns this booking or is the tour agency
        const tour = await Tour.findById(booking.tour._id);
        if (booking.user._id.toString() !== req.user.id && 
            tour.agency.toString() !== req.user.id &&
            req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this booking'
            });
        }
        
        res.json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (Agency/Admin)
// @access  Private
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const booking = await Booking.findById(req.params.id).populate('tour');
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        const tour = await Tour.findById(booking.tour._id);
        if (tour.agency.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this booking'
            });
        }
        
        booking.status = status;
        await booking.save();
        
        res.json({
            success: true,
            message: 'Booking status updated',
            booking
        });
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking',
            error: error.message
        });
    }
};

// @route   PUT /api/bookings/:id/payment
// @desc    Update payment status
// @access  Private
export const updatePaymentStatus = async (req, res) => {
    try {
        const { 
            paymentStatus, 
            paymentMethod,
            hederaTransactionId,
            fiatPayment 
        } = req.body;
        
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        // Update payment status
        booking.paymentStatus = paymentStatus;
        
        // Update payment method if provided
        if (paymentMethod) {
            booking.paymentMethod = paymentMethod;
        }
        
        // Handle Hedera payment
        if (paymentMethod === 'hedera' && hederaTransactionId) {
            booking.hederaTransactionId = hederaTransactionId;
        }
        
        // Handle Fiat payment
        if (paymentMethod === 'fiat' && fiatPayment) {
            booking.fiatPayment = {
                ...booking.fiatPayment,
                ...fiatPayment,
                paymentDate: fiatPayment.paymentDate || new Date()
            };
        }
        
        // Auto-confirm booking if payment is successful
        if (paymentStatus === 'paid' && booking.status === 'pending') {
            booking.status = 'confirmed';
        }
        
        await booking.save();
        
        const populatedBooking = await Booking.findById(booking._id)
            .populate('tour', 'name location price')
            .populate('user', 'fullName email');
        
        res.json({
            success: true,
            message: 'Payment status updated successfully',
            booking: populatedBooking
        });
    } catch (error) {
        console.error('Update payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating payment',
            error: error.message
        });
    }
};

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        booking.status = 'cancelled';
        await booking.save();
        
        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};
