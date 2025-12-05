import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    category: {
        type: String,
        enum: ['pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'painting', 'sculpture', 'calligraphy', 'leather', 'basketry', 'other'],
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'HBAR', 'MAD']
    },
    images: [{
        url: String,
        alt: String
    }],
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
            type: String,
            enum: ['cm', 'in', 'm'],
            default: 'cm'
        }
    },
    weight: {
        value: Number,
        unit: {
            type: String,
            enum: ['g', 'kg', 'lb'],
            default: 'kg'
        }
    },
    materials: [String],
    colors: [String],
    stockQuantity: {
        type: Number,
        default: 1,
        min: 0
    },
    isCustomizable: {
        type: Boolean,
        default: false
    },
    customizationDetails: String,
    productionTime: {
        type: Number, // in days
        default: 7
    },
    tags: [String],
    featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'sold', 'archived'],
        default: 'draft'
    },
    nftMinted: {
        type: Boolean,
        default: false
    },
    nftTokenId: String,
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }
}, {
    timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Calculate average rating before saving
productSchema.pre('save', function(next) {
    if (this.reviews && this.reviews.length > 0) {
        const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        this.averageRating = sum / this.reviews.length;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
