import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        required: true,
        enum: [
            'USER_LOGIN',
            'USER_LOGOUT',
            'USER_REGISTER',
            'BOOKING_CREATE',
            'BOOKING_UPDATE',
            'BOOKING_CANCEL',
            'PAYMENT_INITIATE',
            'PAYMENT_SUCCESS',
            'PAYMENT_FAILED',
            'PAYMENT_REFUND',
            'TOUR_CREATE',
            'TOUR_UPDATE',
            'TOUR_DELETE',
            'NFT_MINT',
            'NFT_TRANSFER',
            'REVIEW_CREATE',
            'REVIEW_UPDATE',
            'REVIEW_DELETE',
            'ADMIN_ACTION',
            'ROLE_CHANGE',
            'AGENCY_APPROVED',
            'AGENCY_REJECTED',
            'ARTIST_APPROVED',
            'ARTIST_REJECTED',
            'SUSPICIOUS_ACTIVITY'
        ]
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'warning'],
        default: 'success'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Index for efficient queries
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ ipAddress: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
