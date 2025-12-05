import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tour name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    duration: {
        type: String,
        required: true
    },
    maxParticipants: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: String,
        enum: ['adventure', 'cultural', 'historical', 'nature', 'food', 'religious', 'other'],
        default: 'other'
    },
    images: [{
        type: String
    }],
    agency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hederaTourId: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    availableDates: [{
        type: Date
    }],
    startDate: {
        type: Date,
        required: false
    },
    endDate: {
        type: Date,
        required: false
    },
    tourStatus: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Virtual field to calculate time left until tour starts
tourSchema.virtual('timeUntilStart').get(function() {
    if (!this.startDate) return null;
    const now = new Date();
    const diff = this.startDate - now;
    
    if (diff < 0) return null; // Tour already started
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return {
        milliseconds: diff,
        days,
        hours,
        humanReadable: days > 0 ? `${days} days, ${hours} hours` : `${hours} hours`
    };
});

// Virtual field to calculate time left until tour ends
tourSchema.virtual('timeUntilEnd').get(function() {
    if (!this.endDate) return null;
    const now = new Date();
    const diff = this.endDate - now;
    
    if (diff < 0) return null; // Tour already ended
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return {
        milliseconds: diff,
        days,
        hours,
        humanReadable: days > 0 ? `${days} days, ${hours} hours` : `${hours} hours`
    };
});

// Method to update tour status based on dates
tourSchema.methods.updateStatus = function() {
    if (!this.startDate || !this.endDate) return this.tourStatus;
    
    const now = new Date();
    
    if (this.tourStatus === 'cancelled') {
        return 'cancelled';
    }
    
    if (now < this.startDate) {
        this.tourStatus = 'upcoming';
    } else if (now >= this.startDate && now <= this.endDate) {
        this.tourStatus = 'ongoing';
    } else if (now > this.endDate) {
        this.tourStatus = 'completed';
    }
    
    return this.tourStatus;
};

// Ensure virtuals are included in JSON
tourSchema.set('toJSON', { virtuals: true });
tourSchema.set('toObject', { virtuals: true });

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
