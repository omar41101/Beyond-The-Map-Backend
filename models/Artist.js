import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    artistName: {
        type: String,
        required: [true, 'Artist name is required'],
        trim: true
    },
    bio: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        enum: ['pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'painting', 'sculpture', 'calligraphy', 'other'],
        required: true
    },
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    portfolio: [{
        title: String,
        description: String,
        image: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    certifications: [{
        name: String,
        issuer: String,
        date: Date,
        documentUrl: String
    }],
    socialMedia: {
        instagram: String,
        facebook: String,
        twitter: String,
        website: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalProducts: {
        type: Number,
        default: 0
    },
    totalSales: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;
