import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String
    }],
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure user can only review a tour once per booking
reviewSchema.index({ tour: 1, user: 1, booking: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
