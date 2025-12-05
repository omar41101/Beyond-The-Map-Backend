import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false  // Made optional for guest bookings
    },
    // Guest booking fields (for fiat payments without authentication)
    isGuestBooking: {
        type: Boolean,
        default: false
    },
    guestEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    guestName: {
        type: String,
        trim: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    numberOfParticipants: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['hedera', 'fiat', 'cash', 'wallet'],
        default: 'fiat'
    },
    // Hedera payment details
    hederaTransactionId: {
        type: String,
        trim: true
    },
    // Fiat payment details
    fiatPayment: {
        transactionId: String,
        paymentGateway: {
            type: String,
            enum: ['stripe', 'paypal', 'square', 'other']
        },
        cardLast4: String,
        paymentDate: Date,
        currency: {
            type: String,
            default: 'USD'
        },
        receiptUrl: String
    },
    nftMinted: {
        type: Boolean,
        default: false
    },
    nftSerialNumber: {
        type: String,
        trim: true
    },
    specialRequests: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
