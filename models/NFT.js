import mongoose from 'mongoose';

const nftSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['proof_of_visit', 'artisanat', 'tour_package'],
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serialNumber: {
        type: String,
        required: true
    },
    metadata: {
        name: String,
        description: String,
        image: String,
        attributes: mongoose.Schema.Types.Mixed
    },
    relatedTour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour'
    },
    relatedBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    mintedAt: {
        type: Date,
        default: Date.now
    },
    hederaTransactionId: {
        type: String
    }
}, {
    timestamps: true
});

const NFT = mongoose.model('NFT', nftSchema);

export default NFT;
