import Review from '../models/Review.js';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { tourId, bookingId, rating, comment, images } = req.body;
        
        // Check if booking exists and belongs to user
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
                message: 'You can only review your own bookings'
            });
        }
        
        if (booking.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'You can only review completed tours'
            });
        }
        
        // Check if review already exists
        const existingReview = await Review.findOne({
            tour: tourId,
            user: req.user.id,
            booking: bookingId
        });
        
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this tour'
            });
        }
        
        const review = await Review.create({
            tour: tourId,
            user: req.user.id,
            booking: bookingId,
            rating,
            comment,
            images,
            isVerified: true // Verified because linked to completed booking
        });
        
        // Update tour rating
        const reviews = await Review.find({ tour: tourId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        
        await Tour.findByIdAndUpdate(tourId, {
            rating: avgRating,
            reviewCount: reviews.length
        });
        
        const populatedReview = await Review.findById(review._id)
            .populate('user', 'fullName profileImage');
        
        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review: populatedReview
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }
};

// @route   GET /api/reviews/tour/:tourId
// @desc    Get reviews for a tour
// @access  Public
export const getTourReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ tour: req.params.tourId })
            .populate('user', 'fullName profileImage')
            .sort('-createdAt');
        
        res.json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

// @route   GET /api/reviews/my-reviews
// @desc    Get user's reviews
// @access  Private
export const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.id })
            .populate('tour', 'name location images')
            .sort('-createdAt');
        
        res.json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error('Get my reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
export const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        const { rating, comment, images } = req.body;
        
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;
        if (images) review.images = images;
        
        await review.save();
        
        // Recalculate tour rating
        const reviews = await Review.find({ tour: review.tour });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        
        await Tour.findByIdAndUpdate(review.tour, {
            rating: avgRating
        });
        
        res.json({
            success: true,
            message: 'Review updated successfully',
            review
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review',
            error: error.message
        });
    }
};

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        const tourId = review.tour;
        await review.deleteOne();
        
        // Recalculate tour rating
        const reviews = await Review.find({ tour: tourId });
        const avgRating = reviews.length > 0 
            ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
            : 0;
        
        await Tour.findByIdAndUpdate(tourId, {
            rating: avgRating,
            reviewCount: reviews.length
        });
        
        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
};
