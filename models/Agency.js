import mongoose from 'mongoose';

const agencySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    licenseNumber: {
        type: String,
        required: [true, 'License number is required'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    contactInfo: {
        phone: String,
        email: String,
        website: String
    },
    documents: [{
        type: {
            type: String,
            enum: ['license', 'certificate', 'insurance', 'other']
        },
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
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
    totalTours: {
        type: Number,
        default: 0
    },
    totalBookings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Agency = mongoose.model('Agency', agencySchema);

export default Agency;
